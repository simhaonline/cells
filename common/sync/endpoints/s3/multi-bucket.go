package s3

import (
	"context"
	"fmt"
	"io"
	"path"
	"regexp"
	"strings"

	"github.com/gobwas/glob"

	"github.com/pydio/cells/common"

	"github.com/pydio/cells/common/log"
	"go.uber.org/zap"

	"github.com/micro/go-micro/errors"

	"github.com/pydio/cells/common/proto/tree"
	"github.com/pydio/cells/common/sync/model"
)

const s3BucketTagPrefix = "pydio:s3-bucket-tag-"

type MultiBucketClient struct {
	// Global context
	globalContext context.Context
	bucketRegexp  *regexp.Regexp
	bucketMetas   []glob.Glob

	// Connection options
	host    string
	key     string
	secret  string
	secure  bool
	options model.EndpointOptions

	// Clients implementations
	mainClient    *Client
	bucketClients map[string]*Client

	// To be passed to clients
	plainSizeComputer       func(nodeUUID string) (int64, error)
	requiresNormalization   bool
	skipRecomputeEtagByCopy bool
	checksumMapper          ChecksumMapper
}

// NewMultiBucketClient creates an s3 wrapped client that lists buckets as top level folders
func NewMultiBucketClient(ctx context.Context, host string, key string, secret string, secure bool, options model.EndpointOptions, bucketsFilter string) (*MultiBucketClient, error) {
	c, e := NewClient(ctx, host, key, secret, "", "", secure, options)
	if e != nil {
		return nil, e
	}
	m := &MultiBucketClient{
		host:          host,
		key:           key,
		secret:        secret,
		secure:        secure,
		options:       options,
		mainClient:    c,
		bucketClients: make(map[string]*Client),
	}
	if len(bucketsFilter) > 0 {
		if r, e := regexp.Compile(bucketsFilter); e == nil {
			m.bucketRegexp = r
		} else {
			return nil, e
		}
	}
	if options.Properties != nil {
		if bucketsTags, o := options.Properties["bucketsTags"]; o {
			for _, pattern := range strings.Split(bucketsTags, ",") {
				if gl, e := glob.Compile(s3BucketTagPrefix + pattern); e == nil {
					m.bucketMetas = append(m.bucketMetas, gl)
				}
			}
		}
	}
	return m, nil
}

// ProvidesMetadataNamespaces implements MetadataProvider interface
func (m *MultiBucketClient) ProvidesMetadataNamespaces() (out []glob.Glob, o bool) {
	return m.bucketMetas, len(m.bucketMetas) > 0
}

func (m *MultiBucketClient) LoadNode(ctx context.Context, p string, extendedStats ...bool) (node *tree.Node, err error) {
	c, b, i, e := m.getClient(p)
	if e != nil {
		return nil, e
	}
	if b == "" {
		// Return a fake root
		return &tree.Node{
			Uuid: "ROOT",
			Path: "",
			Type: tree.NodeType_COLLECTION,
		}, nil
	} else {
		n, e := c.LoadNode(ctx, i, extendedStats...)
		m.patchPath(b, n)
		return n, e
	}
}

func (m *MultiBucketClient) GetEndpointInfo() model.EndpointInfo {
	return m.mainClient.GetEndpointInfo()
}

func (m *MultiBucketClient) Walk(walknFc model.WalkNodesFunc, root string, recursive bool) (err error) {
	c, b, i, e := m.getClient(root)
	if e != nil {
		return e
	}
	if b == "" {
		collect := recursive && c.checksumMapper != nil
		var eTags []string
		// List buckets first
		bb, er := c.Mc.ListBucketsWithContext(context.Background())
		if er != nil {
			return er
		}
		var taggingError error
		for _, bucket := range bb {
			if m.bucketRegexp != nil && !m.bucketRegexp.MatchString(bucket.Name) {
				continue
			}
			bC, _, _, _ := m.getClient(bucket.Name)
			uid, _, _ := bC.readOrCreateFolderId("")
			// Walk bucket as a folder
			fNode := &tree.Node{Uuid: uid, Path: bucket.Name, Type: tree.NodeType_COLLECTION, MTime: bucket.CreationDate.Unix()}
			// Additional read of bucket tagging if configured
			if len(m.bucketMetas) > 0 && taggingError == nil {
				if tags, err := c.Mc.GetBucketTagging(bucket.Name); err == nil {
					if tags == nil || len(tags) == 0 {
						log.Logger(context.Background()).Debug("No tags found on bucket " + bucket.Name)
					} else {
						for _, t := range tags {
							tKey := s3BucketTagPrefix + t.Key
							for _, g := range m.bucketMetas {
								if g.Match(tKey) {
									log.Logger(context.Background()).Info("Attaching tag information to bucket "+bucket.Name, zap.Any(tKey, t.Value))
									fNode.SetMeta(tKey, t.Value)
									break
								}
							}
						}
					}
				} else {
					log.Logger(context.Background()).Warn("Cannot read bucket tagging for "+bucket.Name+", will not retry for other buckets", zap.Error(err))
					taggingError = err
				}
			}
			walknFc(bucket.Name, fNode, nil)
			if !m.options.BrowseOnly {
				// Walk associated .pydio file
				metaId, metaHash, metaSize, er := bC.getFileHash(common.PYDIO_SYNC_HIDDEN_FILE_META)
				if er != nil {
					log.Logger(context.Background()).Error("cannot get filehash for bucket hidden file", zap.Error(er))
				}
				metaFilePath := path.Join(bucket.Name, common.PYDIO_SYNC_HIDDEN_FILE_META)
				walknFc(metaFilePath, &tree.Node{Uuid: metaId, Etag: metaHash, Size: metaSize, Path: metaFilePath, Type: tree.NodeType_LEAF, MTime: bucket.CreationDate.Unix()}, nil)
			}
			// Walk children
			if recursive {
				e := bC.Walk(func(iPath string, node *tree.Node, err error) {
					wrapped := m.patchPath(bucket.Name, node, iPath)
					if collect && node.IsLeaf() {
						eTags = append(eTags, node.Etag)
					}
					walknFc(wrapped, node, err)
				}, "", recursive)
				if e != nil {
					return e
				}
			}
		}
		if collect {
			go func() {
				// We know all eTags from this datasource, now purge unused from mapper
				if deleted := c.checksumMapper.Purge(eTags); deleted > 0 {
					log.Logger(c.globalContext).Info(fmt.Sprintf("Purged %d eTag(s) from ChecksumMapper", deleted))
				} else {
					log.Logger(c.globalContext).Info(fmt.Sprintf("ChecksumMapper nothing to purge"))
				}
			}()
		}
		return nil
	} else {
		return c.Walk(walknFc, i, recursive)
	}
}

func (m *MultiBucketClient) Watch(recursivePath string) (*model.WatchObject, error) {

	// We handle only recursivePath = "" case here

	bb, e := m.mainClient.Mc.ListBuckets()
	if e != nil {
		return nil, e
	}
	eventChan := make(chan model.EventInfo)
	errorChan := make(chan error)
	doneChan := make(chan bool)
	wConn := make(chan model.WatchConnectionInfo)
	watchObject := &model.WatchObject{
		EventInfoChan:  eventChan,
		ErrorChan:      errorChan,
		DoneChan:       doneChan,
		ConnectionInfo: wConn,
	}
	var subCloses []chan bool
	// Setup a watcher on each bucket : init clients
	for _, b := range bb {
		subClose := make(chan bool)
		subCloses = append(subCloses, subClose)
		if m.bucketRegexp != nil && !m.bucketRegexp.MatchString(b.Name) {
			continue
		}
		bClient, _, _, e := m.getClient(b.Name)
		if e != nil {
			continue
		}
		bWatcher, e := bClient.Watch("")
		if e != nil {
			continue
		}
		log.Logger(context.Background()).Info("Started watcher for bucket", zap.String("bucket", b.Name))
		go func(bName string) {
			internalClose := false
			defer func() {
				if !internalClose {
					log.Logger(context.Background()).Info("Closing watcher for bucket", zap.String("bucket", bName))
					bWatcher.DoneChan <- true
				}
			}()
			for {
				select {
				case event, open := <-bWatcher.Events():
					if !open {
						internalClose = true
						return
					}
					// Patch Event data for output
					event.Path = m.patchPath(bName, nil, event.Path)
					event.Source = m
					eventChan <- event
				case evErr := <-bWatcher.Errors():
					errorChan <- evErr
				case conn := <-bWatcher.ConnectionInfos():
					wConn <- conn
				case <-subClose:
					return
				}
			}
		}(b.Name)
	}
	// close all sub watchers when global done is called
	go func() {
		<-doneChan
		for _, s := range subCloses {
			close(s)
		}
	}()
	return watchObject, nil
}

func (m *MultiBucketClient) GetWriterOn(cancel context.Context, path string, targetSize int64) (out io.WriteCloser, writeDone chan bool, writeErr chan error, err error) {
	c, b, i, e := m.getClient(path)
	if e != nil {
		err = e
		return
	}
	if b == "" {
		err = errors.Unauthorized("level.unauthorized", "cannot write file at the buckets level")
		return
	}
	return c.GetWriterOn(cancel, i, targetSize)
}

func (m *MultiBucketClient) GetReaderOn(path string) (out io.ReadCloser, err error) {
	c, b, i, e := m.getClient(path)
	if e != nil {
		err = e
		return
	}
	if b == "" {
		err = errors.Unauthorized("level.unauthorized", "cannot read objects at the buckets level")
		return
	}
	return c.GetReaderOn(i)
}

func (m *MultiBucketClient) CreateNode(ctx context.Context, node *tree.Node, updateIfExists bool) (err error) {
	c, b, i, e := m.getClient(node.Path)
	if e != nil {
		err = e
		return
	}
	if b == "" {
		err = errors.Unauthorized("level.unauthorized", "cannot create objects at the buckets level")
		return
	}
	patched := node.Clone()
	patched.Path = i
	return c.CreateNode(ctx, patched, updateIfExists)
}

func (m *MultiBucketClient) DeleteNode(ctx context.Context, path string) (err error) {
	c, b, i, e := m.getClient(path)
	if e != nil {
		err = e
		return
	}
	if b == "" {
		err = errors.Unauthorized("level.unauthorized", "cannot create objects at the buckets level")
		return
	}
	return c.DeleteNode(ctx, i)
}

func (m *MultiBucketClient) MoveNode(ctx context.Context, oldPath string, newPath string) (err error) {
	c, b, i, e := m.getClient(oldPath)
	if e != nil {
		err = e
		return
	}
	if b == "" {
		err = errors.Unauthorized("level.unauthorized", "cannot move objects at the buckets level")
		return
	}
	_, b2, i2, _ := m.getClient(newPath)
	if b2 != b {
		err = errors.BadRequest("not.implemented", "cannot move objects accross buckets for the moment")
	}
	return c.MoveNode(ctx, i, i2)
}

func (m *MultiBucketClient) ComputeChecksum(node *tree.Node) (err error) {
	c, b, i, e := m.getClient(node.Path)
	if e != nil {
		err = e
		return
	}
	if b == "" {
		err = errors.Unauthorized("level.unauthorized", "cannot compute checksum at the buckets level")
		return
	}
	patched := node.Clone()
	patched.Path = i
	if e := c.ComputeChecksum(patched); e != nil {
		return e
	} else {
		node.Etag = patched.Etag
		return nil
	}
}

func (m *MultiBucketClient) UpdateNodeUuid(ctx context.Context, node *tree.Node) (n *tree.Node, err error) {
	c, b, i, e := m.getClient(node.Path)
	if e != nil {
		err = e
		return
	}
	if b == "" {
		err = errors.Unauthorized("level.unauthorized", "cannot update node Uuid at the buckets level")
		return
	}
	patched := node.Clone()
	patched.Path = i
	out, e := c.UpdateNodeUuid(ctx, patched)
	m.patchPath(b, out)
	return out, e
}

func (m *MultiBucketClient) SetPlainSizeComputer(computer func(nodeUUID string) (int64, error)) {
	m.plainSizeComputer = computer
	m.mainClient.SetPlainSizeComputer(computer)
}

func (m *MultiBucketClient) SetServerRequiresNormalization() {
	m.requiresNormalization = true
	m.mainClient.SetServerRequiresNormalization()
}

func (m *MultiBucketClient) SetChecksumMapper(cs ChecksumMapper) {
	m.checksumMapper = cs
	m.mainClient.SetChecksumMapper(cs, false)
}

// SkipRecomputeEtagByCopy sets a special behavior to avoir recomputing etags by in-place copying
// objects on storages that do not support this feature
func (m *MultiBucketClient) SkipRecomputeEtagByCopy() {
	m.skipRecomputeEtagByCopy = true
	m.mainClient.skipRecomputeEtagByCopy = true
}

func (m *MultiBucketClient) getClient(p string) (c *Client, bucket string, internal string, e error) {
	p = strings.Trim(p, "/")
	parts := strings.Split(p, "/")
	if len(parts) >= 1 && parts[0] != "" {
		bucket = parts[0]
		internal = strings.Join(parts[1:], "/")
		if cl, ok := m.bucketClients[bucket]; ok {
			c = cl
		} else {
			o := m.options
			if o.BrowseOnly {
				if o.Properties == nil {
					o.Properties = make(map[string]string)
				}
				o.Properties["stableUuidPrefix"] = bucket
			}
			c, e = NewClient(m.globalContext, m.host, m.key, m.secret, bucket, "", m.secure, o)
			if e != nil {
				return
			}
			if m.plainSizeComputer != nil {
				c.SetPlainSizeComputer(m.plainSizeComputer)
			}
			if m.requiresNormalization {
				c.SetServerRequiresNormalization()
			}
			if m.checksumMapper != nil {
				c.SetChecksumMapper(m.checksumMapper, false)
			}
			if m.skipRecomputeEtagByCopy {
				c.SkipRecomputeEtagByCopy()
			}
			m.bucketClients[bucket] = c
		}
	} else {
		c = m.mainClient
	}
	return
}

func (m *MultiBucketClient) patchPath(bucketName string, node *tree.Node, p ...string) (patched string) {
	if len(p) > 0 {
		patched = path.Join(bucketName, p[0])
	}
	if node != nil {
		node.Path = path.Join(bucketName, node.Path)
	}
	return
}
