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

// Package grpc spins an OpenID Connect Server using the coreos/dex implementation
package grpc

import (
	"log"

	"github.com/micro/go-micro"

	"github.com/pydio/cells/common"
	"github.com/pydio/cells/common/auth"
	"github.com/pydio/cells/common/config"
	"github.com/pydio/cells/common/plugins"
	proto "github.com/pydio/cells/common/proto/auth"
	"github.com/pydio/cells/common/service"
	servicecontext "github.com/pydio/cells/common/service/context"
	"github.com/pydio/cells/common/sql"
	"github.com/pydio/cells/idm/oauth"
)

func init() {

	plugins.Register(func() {
		// Configuration
		auth.InitConfiguration(config.Values("services", common.SERVICE_WEB_NAMESPACE_+common.SERVICE_OAUTH))
		auth.RegisterGRPCProvider(common.SERVICE_GRPC_NAMESPACE_ + common.SERVICE_OAUTH)

		service.NewService(
			service.Name(common.SERVICE_GRPC_NAMESPACE_+common.SERVICE_OAUTH),
			service.Tag(common.SERVICE_TAG_IDM),
			service.Description("OAuth Provider"),
			service.WithStorage(oauth.NewDAO),
			service.WithMicro(func(m micro.Service) error {
				proto.RegisterLoginProviderHandler(m.Options().Server, &Handler{})
				proto.RegisterConsentProviderHandler(m.Options().Server, &Handler{})
				proto.RegisterLogoutProviderHandler(m.Options().Server, &Handler{})
				proto.RegisterAuthCodeProviderHandler(m.Options().Server, &Handler{})
				proto.RegisterAuthCodeExchangerHandler(m.Options().Server, &Handler{})
				proto.RegisterAuthTokenVerifierHandler(m.Options().Server, &Handler{})
				proto.RegisterAuthTokenRefresherHandler(m.Options().Server, &Handler{})
				proto.RegisterAuthTokenRevokerHandler(m.Options().Server, &Handler{})

				return nil
			}),
			service.BeforeStart(initialize),
		)
	})
}

func initialize(s service.Service) error {

	ctx := s.Options().Context

	dao := servicecontext.GetDAO(ctx).(sql.DAO)

	auth.OnConfigurationInit(func() {
		var m []struct {
			ID   string `"json:id"`
			Name string `"json:id"`
			Type string `"json:type"`
		}

		if err := auth.GetConfigurationProvider().Connectors().Scan(&m); err != nil {
			log.Fatal("Wrong configuration ", err)
		}

		for _, mm := range m {
			if mm.Type == "pydio" {
				// Registering the first connector
				auth.RegisterConnector(m[0].ID, m[0].Name, m[0].Type, nil)
			}
		}
	})

	// Registry
	auth.InitRegistry(dao)

	watcher, err := config.Watch("services", common.SERVICE_WEB_NAMESPACE_+common.SERVICE_OAUTH)
	if err != nil {
		return err
	}

	go func() {
		defer watcher.Stop()
		for {
			_, err := watcher.Next()
			if err != nil {
				break
			}

			auth.InitConfiguration(config.Values("services", common.SERVICE_WEB_NAMESPACE_+common.SERVICE_OAUTH))
		}
	}()

	return nil
}
