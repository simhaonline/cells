/*
 * Copyright (c) 2018. Abstrium SAS <team (at) pydio.com>
 * This file is part of Pydio Cells.
 *
 * Pydio Cells is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * Pydio Cells is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with Pydio Cells.  If not, see <http://www.gnu.org/licenses/>.
 *
 * The latest code can be found at <https://pydio.com>.
 */

package grpc

import (
	"context"
	"encoding/json"
	"fmt"
	"path"
	"sort"
	"strings"
	"sync"
	"time"

	"github.com/golang/protobuf/ptypes"
	"github.com/golang/protobuf/ptypes/any"
	"github.com/micro/go-micro/client"
	"github.com/micro/go-micro/errors"
	"github.com/patrickmn/go-cache"
	"go.uber.org/zap"

	"github.com/pydio/cells/common"
	"github.com/pydio/cells/common/log"
	"github.com/pydio/cells/common/proto/idm"
	"github.com/pydio/cells/common/proto/jobs"
	"github.com/pydio/cells/common/proto/tree"
	"github.com/pydio/cells/common/registry"
	servicecontext "github.com/pydio/cells/common/service/context"
	service "github.com/pydio/cells/common/service/proto"
	context2 "github.com/pydio/cells/common/utils/context"
	"github.com/pydio/cells/common/utils/permissions"
	"github.com/pydio/cells/idm/user"
	"github.com/pydio/cells/scheduler/tasks"
)

var (
	defaultPolicies = []*service.ResourcePolicy{
		{Subject: "profile:standard", Action: service.ResourcePolicyAction_READ, Effect: service.ResourcePolicy_allow},
		{Subject: "profile:admin", Action: service.ResourcePolicyAction_WRITE, Effect: service.ResourcePolicy_allow},
	}
	autoAppliesCache *cache.Cache
)

// ByAge implements sort.Interface for []Person based on
// the Age field.
type ByOverride []*idm.Role

func (a ByOverride) Len() int           { return len(a) }
func (a ByOverride) Swap(i, j int)      { a[i], a[j] = a[j], a[i] }
func (a ByOverride) Less(i, j int) bool { return !a[i].ForceOverride && a[j].ForceOverride }

// Handler definition
type Handler struct{}

// BindUser binds a user with login/password
func (h *Handler) BindUser(ctx context.Context, req *idm.BindUserRequest, resp *idm.BindUserResponse) error {
	if servicecontext.GetDAO(ctx) == nil {
		return fmt.Errorf("no DAO found, wrong initialization")
	}

	dao := servicecontext.GetDAO(ctx).(user.DAO)
	user, err := dao.Bind(req.UserName, req.Password)
	if err != nil {
		return err
	}
	resp.User = user
	resp.User.Password = ""

	client.Publish(ctx, client.NewPublication(common.TOPIC_IDM_EVENT, &idm.ChangeEvent{
		Type: idm.ChangeEventType_BIND,
		User: user,
	}))

	return nil
}

// CreateUser adds or creates a user or a group in the underlying database.
func (h *Handler) CreateUser(ctx context.Context, req *idm.CreateUserRequest, resp *idm.CreateUserResponse) error {

	if servicecontext.GetDAO(ctx) == nil {
		return fmt.Errorf("no DAO found, wrong initialization")
	}
	dao := servicecontext.GetDAO(ctx).(user.DAO)

	passChange := req.User.Password
	// Create or update user
	newUser, createdNodes, err := dao.Add(req.User)
	if err != nil {
		log.Logger(ctx).Error("cannot put user "+req.User.Login, req.User.ZapUuid(), zap.Error(err))
		return err
	}

	out := newUser.(*idm.User)
	if passChange != "" {
		// Check if it is a "force pass change operation".
		ctxLogin, _ := permissions.FindUserNameInContext(ctx)
		if l, ok := out.Attributes["locks"]; ok && strings.Contains(l, "pass_change") && ctxLogin == out.Login {
			if req.User.OldPassword == out.Password {
				return fmt.Errorf("new password is the same as the old password, please use a different one")
			}
			var locks, newLocks []string
			json.Unmarshal([]byte(l), &locks)
			for _, lock := range locks {
				if lock != "pass_change" {
					newLocks = append(newLocks, lock)
				}
			}
			marsh, _ := json.Marshal(newLocks)
			out.Attributes["locks"] = string(marsh)
			if _, _, e := dao.Add(out); e == nil {
				log.Logger(ctx).Info("user "+req.User.Login+" successfully updated his password", req.User.ZapUuid())
			}
		}
	}
	out.Password = ""
	resp.User = out
	if len(req.User.Policies) == 0 {
		var userPolicies []*service.ResourcePolicy
		userPolicies = append(userPolicies, defaultPolicies...)
		if !req.User.IsGroup {
			// A user must be able to edit his own profile!
			userPolicies = append(userPolicies, &service.ResourcePolicy{
				Subject: "user:" + out.Login,
				Action:  service.ResourcePolicyAction_WRITE,
				Effect:  service.ResourcePolicy_allow,
			})
		}
		req.User.Policies = userPolicies
	}
	log.Logger(ctx).Debug("ADDING POLICIES NOW", zap.Any("p", req.User.Policies), zap.Any("createdNodes", createdNodes))
	if err := dao.AddPolicies(len(createdNodes) == 0, out.Uuid, req.User.Policies); err != nil {
		return err
	}
	for _, g := range createdNodes {
		if g.Uuid != out.Uuid && g.Type == tree.NodeType_COLLECTION {
			// Groups where created in the process, add default policies on them
			log.Logger(ctx).Info("Setting Default Policies on groups that were created automatically", zap.Any("groupPath", g.Path))
			if err := dao.AddPolicies(false, g.Uuid, defaultPolicies); err != nil {
				return err
			}
		}
	}

	if len(createdNodes) == 0 {
		// Propagate creation event
		client.Publish(ctx, client.NewPublication(common.TOPIC_IDM_EVENT, &idm.ChangeEvent{
			Type: idm.ChangeEventType_UPDATE,
			User: out,
		}))
		if out.IsGroup {
			log.Auditer(ctx).Info(
				fmt.Sprintf("Updated group [%s]", out.GroupLabel),
				log.GetAuditId(common.AUDIT_GROUP_UPDATE),
				out.ZapUuid(),
			)
		} else {
			log.Auditer(ctx).Info(
				fmt.Sprintf("Updated user [%s]", out.Login),
				log.GetAuditId(common.AUDIT_USER_UPDATE),
				out.ZapUuid(),
			)
		}
	} else {
		// Propagate creation event
		client.Publish(ctx, client.NewPublication(common.TOPIC_IDM_EVENT, &idm.ChangeEvent{
			Type: idm.ChangeEventType_CREATE,
			User: out,
		}))
		if out.IsGroup {
			log.Auditer(ctx).Info(
				fmt.Sprintf("Created group [%s]", out.GroupPath),
				log.GetAuditId(common.AUDIT_GROUP_CREATE),
				out.ZapUuid(),
			)
		} else {
			path := "/"
			if len(out.GroupPath) > 1 {
				path = out.GroupPath + "/"
			}
			log.Auditer(ctx).Info(
				fmt.Sprintf("Created user [%s%s]", path, out.Login),
				log.GetAuditId(common.AUDIT_USER_CREATE),
				out.ZapUuid(),
				zap.String("GroupPath", out.GroupPath),
			)
		}
	}
	return nil
}

// DeleteUser from database
func (h *Handler) DeleteUser(ctx context.Context, req *idm.DeleteUserRequest, response *idm.DeleteUserResponse) error {
	if servicecontext.GetDAO(ctx) == nil {
		return fmt.Errorf("no DAO found, wrong initialization")
	}
	usersChan := make(chan *idm.User)
	done := make(chan bool)

	var autoClient *tasks.ReconnectingClient
	var task *jobs.Task
	var taskChan chan interface{}
	uName, _ := permissions.FindUserNameInContext(ctx)
	if tU, ok := context2.CanonicalMeta(ctx, servicecontext.ContextMetaTaskUuid); ok {
		jU, _ := context2.CanonicalMeta(ctx, servicecontext.ContextMetaJobUuid)
		task = &jobs.Task{
			JobID:        jU,
			ID:           tU,
			TriggerOwner: uName,
			Status:       jobs.TaskStatus_Running,
			HasProgress:  true,
		}
		taskChan = make(chan interface{})
		autoClient = tasks.NewTaskReconnectingClient(ctx)
		autoClient.StartListening(taskChan)
		defer autoClient.Stop()
	}
	dao := servicecontext.GetDAO(ctx).(user.DAO)

	i, err := dao.Count(req.Query, true)
	if err != nil {
		return err
	}
	total := float32(i)
	wg := &sync.WaitGroup{}
	wg.Add(1)

	go func() {
		defer wg.Done()
		var crt float32
		for {
			select {
			case deleted := <-usersChan:
				if deleted != nil {
					dao.DeletePoliciesForResource(deleted.Uuid)
					if deleted.IsGroup {
						dao.DeletePoliciesBySubject(fmt.Sprintf("role:%s", deleted.Uuid))
					} else {
						dao.DeletePoliciesBySubject(fmt.Sprintf("user:%s", deleted.Uuid))
					}

					// Propagate deletion event
					client.Publish(ctx, client.NewPublication(common.TOPIC_IDM_EVENT, &idm.ChangeEvent{
						Type: idm.ChangeEventType_DELETE,
						User: deleted,
					}))
					var msg string
					if deleted.IsGroup {
						msg = fmt.Sprintf("Deleted group [%s]", path.Join(deleted.GroupPath, deleted.GroupLabel))
						log.Auditer(ctx).Info(msg, log.GetAuditId(common.AUDIT_GROUP_DELETE), deleted.ZapUuid())
					} else {
						msg = fmt.Sprintf("Deleted user [%s] from [%s]", deleted.Login, deleted.GroupPath)
						log.Auditer(ctx).Info(msg, log.GetAuditId(common.AUDIT_USER_DELETE), deleted.ZapUuid())
					}
					crt++
					percent := crt / total
					if task != nil {
						task.Progress = percent
						task.StatusMessage = msg
						task.Status = jobs.TaskStatus_Running
						log.TasksLogger(ctx).Info(msg)
						taskChan <- task
					}
				}
			case <-done:
				if task != nil {
					task.Progress = 1
					task.StatusMessage = "Background delete complete"
					task.EndTime = int32(time.Now().Unix())
					task.Status = jobs.TaskStatus_Finished
					taskChan <- task
				}
				return
			}
		}
	}()

	numRows, err := dao.Del(req.Query, usersChan)
	close(done)
	close(usersChan)
	if err != nil {
		if task != nil {
			task.Progress = 1
			task.StatusMessage = err.Error()
			task.Status = jobs.TaskStatus_Error
			taskChan <- task
		}
		return err
	}
	wg.Wait()
	close(taskChan)
	response.RowsDeleted = numRows
	return nil
}

// SearchUser in database
func (h *Handler) SearchUser(ctx context.Context, request *idm.SearchUserRequest, response idm.UserService_SearchUserStream) error {
	if servicecontext.GetDAO(ctx) == nil {
		return fmt.Errorf("no DAO found, wrong initialization")
	}
	dao := servicecontext.GetDAO(ctx).(user.DAO)
	autoApplies, er := h.loadAutoAppliesRoles(ctx)
	if er != nil {
		return er
	}

	usersGroups := new([]interface{})
	if err := dao.Search(request.Query, usersGroups); err != nil {
		return err
	}

	var e error
	for _, in := range *usersGroups {
		if usr, ok := in.(*idm.User); ok {
			usr.Password = ""
			if usr.Policies, e = dao.GetPoliciesForResource(usr.Uuid); e != nil {
				log.Logger(ctx).Error("cannot load policies for user "+usr.Uuid, zap.Error(e))
				continue
			}
			h.applyAutoApplies(usr, autoApplies)
			response.Send(&idm.SearchUserResponse{User: usr})
		} else {
			return errors.InternalServerError(common.SERVICE_USER, "wrong type received, should have been idm.User or idm.Group")
		}
	}

	response.Close()

	return nil
}

// CountUser in database
func (h *Handler) CountUser(ctx context.Context, request *idm.SearchUserRequest, response *idm.CountUserResponse) error {
	if servicecontext.GetDAO(ctx) == nil {
		return fmt.Errorf("no DAO found, wrong initialization")
	}
	dao := servicecontext.GetDAO(ctx).(user.DAO)

	total, err := dao.Count(request.Query)
	if err != nil {
		return err
	}
	response.Count = int32(total)

	return nil
}

// StreamUser from database
func (h *Handler) StreamUser(ctx context.Context, streamer idm.UserService_StreamUserStream) error {
	if servicecontext.GetDAO(ctx) == nil {
		return fmt.Errorf("no DAO found, wrong initialization")
	}
	dao := servicecontext.GetDAO(ctx).(user.DAO)
	defer streamer.Close()

	autoApplies, e := h.loadAutoAppliesRoles(ctx)
	if e != nil {
		return e
	}

	for {
		incoming, err := streamer.Recv()
		if incoming == nil || err != nil {
			break
		}

		users := new([]interface{})
		if err := dao.Search(incoming.Query, users); err != nil {
			return err
		}

		for _, in := range *users {
			if usr, ok := in.(*idm.User); ok {
				usr.Password = ""
				h.applyAutoApplies(usr, autoApplies)
				streamer.Send(&idm.SearchUserResponse{User: usr})
			}
		}

		streamer.Send(nil)
	}

	return nil
}

// applyAutoApplies tries to find if some roles must be added to this user.
// If necessary, it adds role to the list AFTER the groupRoles and before other roles.
func (h *Handler) applyAutoApplies(usr *idm.User, autoApplies map[string][]*idm.Role) {
	// Apply automatically role for profile
	if usr.Attributes != nil {
		if profile, ok := usr.Attributes[idm.UserAttrProfile]; ok {
			// For shared users, disable group roles inheritance
			if profile == common.PYDIO_PROFILE_SHARED || profile == common.PYDIO_PROFILE_ANON {
				var newRoles []*idm.Role
				for _, role := range usr.Roles {
					if !role.GroupRole {
						newRoles = append(newRoles, role)
					}
				}
				usr.Roles = newRoles
			}
			if len(autoApplies) == 0 {
				return
			}
			// Apply AutoApply role if any
			if applies, has := autoApplies[profile]; has {
				var newRoles []*idm.Role
				var added = false
				for _, crt := range usr.Roles {
					if !added && !crt.GroupRole {
						newRoles = append(newRoles, applies...)
						added = true
					}
					newRoles = append(newRoles, crt)
				}
				usr.Roles = newRoles
			}
		}
	}
	// Sort so that ForceOverride are at the bottom of the list
	var head, body, foot []*idm.Role
	for _, r := range usr.Roles {
		if r.GroupRole {
			head = append(head, r)
		} else if r.UserRole {
			foot = append(foot, r)
		} else {
			body = append(body, r)
		}
	}
	sort.Sort(ByOverride(body))
	all := append(head, body...)
	all = append(all, foot...)
	usr.Roles = all

}

// LoadAutoAppliesRoles performs a request to the Roles service to find all roles that have a non-empty list
// of "AutoApplies" : these roles must be applied to user with a given profile.
func (h *Handler) loadAutoAppliesRoles(ctx context.Context) (autoApplies map[string][]*idm.Role, err error) {

	// Check if it's not already cached
	if autoAppliesCache != nil {
		if values, ok := autoAppliesCache.Get("autoApplies"); ok {
			var conv bool
			if autoApplies, conv = values.(map[string][]*idm.Role); conv {
				return
			}
		}
	}

	autoApplies = make(map[string][]*idm.Role)
	roleCli := idm.NewRoleServiceClient(registry.GetClient(common.SERVICE_ROLE))
	q, _ := ptypes.MarshalAny(&idm.RoleSingleQuery{HasAutoApply: true})
	stream, e := roleCli.SearchRole(ctx, &idm.SearchRoleRequest{Query: &service.Query{SubQueries: []*any.Any{q}}})
	if e != nil {
		return autoApplies, e
	}
	defer stream.Close()
	for {
		resp, e := stream.Recv()
		if e != nil {
			break
		}
		applies := resp.Role.AutoApplies
		for _, profileId := range applies {
			var data []*idm.Role
			var ok bool
			if data, ok = autoApplies[profileId]; !ok {
				data = []*idm.Role{}
			}
			data = append(data, resp.Role)
			autoApplies[profileId] = data
		}
	}

	// Save to cache
	if autoAppliesCache == nil {
		autoAppliesCache = cache.New(10*time.Second, 20*time.Second)
	}
	autoAppliesCache.Set("autoApplies", autoApplies, 0) // 0 means use cache default

	return
}
