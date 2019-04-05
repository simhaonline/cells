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

package sync

import (
	"context"
	"fmt"
	"sync"
	"time"

	"go.uber.org/zap"

	"github.com/micro/go-micro/client"
	"github.com/pydio/cells/common/log"
	"github.com/pydio/cells/common/micro"
	"github.com/pydio/cells/common/proto/tree"
)

type IndexStreamer struct {
	done chan bool

	readMutex        *sync.RWMutex
	readClient       tree.NodeProviderStreamer_ReadNodeStreamClient
	readClientErrors chan error
	readInput        chan *tree.ReadNodeRequest
	readOutput       chan *tree.ReadNodeResponse
	readErrors       chan error

	delIsOpen bool
	delInput  chan *tree.DeleteNodeRequest
	delOutput chan *tree.DeleteNodeResponse
	delErrors chan error

	createIsOpen bool
	createInput  chan *tree.CreateNodeRequest
	createOutput chan *tree.CreateNodeResponse
	createErrors chan error

	updateIsOpen bool
	updateInput  chan *tree.UpdateNodeRequest
	updateOutput chan *tree.UpdateNodeResponse
	updateErrors chan error

	serviceName string
}

func NewIndexStreamer(serviceName string) *IndexStreamer {
	i := &IndexStreamer{
		serviceName: serviceName,
		done:        make(chan bool, 1),

		readMutex:        new(sync.RWMutex),
		readClientErrors: make(chan error),
		readInput:        make(chan *tree.ReadNodeRequest, 1),
		readOutput:       make(chan *tree.ReadNodeResponse, 1),
		readErrors:       make(chan error),

		delInput:  make(chan *tree.DeleteNodeRequest, 1),
		delOutput: make(chan *tree.DeleteNodeResponse, 1),
		delErrors: make(chan error),

		createInput:  make(chan *tree.CreateNodeRequest, 1),
		createOutput: make(chan *tree.CreateNodeResponse, 1),
		createErrors: make(chan error),

		updateInput:  make(chan *tree.UpdateNodeRequest, 1),
		updateOutput: make(chan *tree.UpdateNodeResponse, 1),
		updateErrors: make(chan error),
	}

	i.StartReader(context.Background())

	return i
}

func (i *IndexStreamer) Stop() {
	i.done <- true
	i.delIsOpen, i.createIsOpen, i.updateIsOpen = false, false, false
}

func (i *IndexStreamer) StartReader(ctx context.Context) error {
	i.readMutex.Lock()

	reader := tree.NewNodeProviderStreamerClient(i.serviceName, defaults.NewClient())
	streamer, err := reader.ReadNodeStream(ctx, client.WithRequestTimeout(1*time.Hour))
	if err != nil {
		return err
	}

	i.readMutex.Unlock()

	i.readClient = streamer

	go func() {
		for {
			for err := range i.readClientErrors {
				fmt.Println(err)
				if err == nil {
					continue
				}
				if streamer != nil {
					streamer.Close()
				}
				break
			}

			i.readMutex.Lock()

			reader := tree.NewNodeProviderStreamerClient(i.serviceName, defaults.NewClient())
			streamer, err := reader.ReadNodeStream(ctx, client.WithRequestTimeout(1*time.Hour))

			if err != nil {
				continue
			}

			i.readClient = streamer

			i.readMutex.Unlock()
		}
	}()

	go func() {
		for readRequest := range i.readInput {
			i.readMutex.RLock()

			if err := i.readClient.Send(readRequest); err != nil {
				i.readClientErrors <- err
				continue
			}
			fmt.Println("Sent ", readRequest)

			i.readMutex.RUnlock()
		}
	}()

	go func() {
		for {
			var resp interface{}

			if err := i.readClient.RecvMsg(&resp); err != nil {
				fmt.Println("Error in response ", err)
				i.readClientErrors <- err
			}

			fmt.Println("Received a message ", resp)

			switch v := resp.(type) {
			case error:
				fmt.Println("Error ", v)
				i.readErrors <- v
			case *tree.ReadNodeResponse:
				fmt.Println("Resp ", v)
				i.readOutput <- v
			}
		}
	}()

	return nil
}

func (i *IndexStreamer) StartDeleter(ctx context.Context) error {

	//fmt.Println("Starting Deleter for service " + i.serviceName)
	delClient := tree.NewNodeReceiverStreamClient(i.serviceName, defaults.NewClient())
	streamer, err := delClient.DeleteNodeStream(ctx)
	if err != nil {
		fmt.Println("Error starting Deleter for service "+i.serviceName, err)
		i.delIsOpen = false
		return err
	}
	i.delIsOpen = true

	go func() {
		for {
			select {
			case delRequest := <-i.delInput:
				e := streamer.Send(delRequest)
				if e != nil {
					// Error sending request, break, reconnect and requeue delete request
					streamer.Close()
					<-time.After(2 * time.Second)
					if e := i.StartDeleter(ctx); e == nil {
						i.delInput <- delRequest
					}
					return
				} else {
					if resp, e := streamer.Recv(); e != nil {
						i.delErrors <- e
					} else {
						i.delOutput <- resp
					}

				}
			case <-i.done:
				streamer.Close()
				return
			}
		}
	}()

	return nil
}

func (i *IndexStreamer) StartCreator(ctx context.Context) error {

	//fmt.Println("Starting Creator for service " + i.serviceName)
	createClient := tree.NewNodeReceiverStreamClient(i.serviceName, defaults.NewClient())
	streamer, err := createClient.CreateNodeStream(ctx)
	if err != nil {
		//fmt.Println("Error starting for service " + i.serviceName, err)
		i.createIsOpen = false
		return err
	}
	i.createIsOpen = true

	go func() {
		for {
			select {
			case createRequest := <-i.createInput:

				e := streamer.Send(createRequest)
				if e != nil {
					log.Logger(ctx).Error("error in stream", zap.Error(e))
					// Error sending request, break, reconnect and requeue createete request
					streamer.Close()
					<-time.After(2 * time.Second)
					if e := i.StartCreator(ctx); e == nil {
						i.createInput <- createRequest
					}
					return
				} else {
					if resp, e := streamer.Recv(); e != nil {
						i.createErrors <- e
					} else {
						i.createOutput <- resp
					}
				}
			case <-i.done:
				streamer.Close()
				return
			}
		}
	}()

	return nil
}

func (i *IndexStreamer) StartUpdater(ctx context.Context) error {

	//fmt.Println("Starting Updater for service " + i.serviceName)
	updateClient := tree.NewNodeReceiverStreamClient(i.serviceName, defaults.NewClient())
	streamer, err := updateClient.UpdateNodeStream(ctx)
	if err != nil {
		//fmt.Println("Error starting for service " + i.serviceName, err)
		i.updateIsOpen = false
		return err
	}
	i.updateIsOpen = true

	go func() {
		for {
			select {
			case updateRequest := <-i.updateInput:
				e := streamer.Send(updateRequest)
				if e != nil {
					// Error sending request, break, reconnect and requeue updateete request
					streamer.Close()
					<-time.After(2 * time.Second)
					if e := i.StartUpdater(ctx); e == nil {
						i.updateInput <- updateRequest
					}
					return
				} else {
					if resp, e := streamer.Recv(); e != nil {
						i.updateErrors <- e
					} else {
						i.updateOutput <- resp
					}

				}
			case <-i.done:
				streamer.Close()
				return
			}
		}
	}()

	return nil
}

func (i *IndexStreamer) ReadNode(ctx context.Context, request *tree.ReadNodeRequest) (response *tree.ReadNodeResponse, err error) {

	wg := &sync.WaitGroup{}
	wg.Add(1)
	go func() {
		defer wg.Done()
		for {
			select {
			case response = <-i.readOutput:
				return
			case err = <-i.readErrors:
				return
			case <-time.After(10 * time.Second):
				err = fmt.Errorf("read node stream timeout after 10s")
				return
			}
		}

	}()

	i.readInput <- request

	wg.Wait()

	return
}

func (i *IndexStreamer) DeleteNode(ctx context.Context, request *tree.DeleteNodeRequest) (response *tree.DeleteNodeResponse, err error) {

	if !i.delIsOpen {
		if e := i.StartDeleter(ctx); e != nil {
			return nil, e
		}
	}

	wg := &sync.WaitGroup{}
	wg.Add(1)
	go func() {
		defer wg.Done()
		for {
			select {
			case response = <-i.delOutput:
				return
			case err = <-i.delErrors:
				return
			case <-time.After(10 * time.Second):
				err = fmt.Errorf("delete node stream timeout after 10s")
				return
			}
		}

	}()

	i.delInput <- request

	wg.Wait()

	return
}

func (i *IndexStreamer) CreateNode(ctx context.Context, request *tree.CreateNodeRequest) (response *tree.CreateNodeResponse, err error) {

	if !i.createIsOpen {
		if e := i.StartCreator(ctx); e != nil {
			return nil, e
		}
	}

	wg := &sync.WaitGroup{}
	wg.Add(1)
	go func() {
		defer wg.Done()
		for {
			select {
			case response = <-i.createOutput:
				return
			case err = <-i.createErrors:
				return
			case <-time.After(10 * time.Second):
				err = fmt.Errorf("create node stream timeout after 10s")
				return
			}
		}

	}()

	i.createInput <- request

	wg.Wait()

	return
}

func (i *IndexStreamer) UpdateNode(ctx context.Context, request *tree.UpdateNodeRequest) (response *tree.UpdateNodeResponse, err error) {

	if !i.updateIsOpen {
		if e := i.StartUpdater(ctx); e != nil {
			return nil, e
		}
	}

	wg := &sync.WaitGroup{}
	wg.Add(1)
	go func() {
		defer wg.Done()
		for {
			select {
			case response = <-i.updateOutput:
				return
			case err = <-i.updateErrors:
				return
			case <-time.After(10 * time.Second):
				err = fmt.Errorf("update node stream timeout after 10s")
				return
			}
		}

	}()

	i.updateInput <- request

	wg.Wait()

	return
}
