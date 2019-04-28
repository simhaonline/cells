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

// Package rest is used once at install-time when running install via browser
package rest

import (
	"bytes"
	"context"
	"fmt"
	"html/template"
	"log"
	"net/http"
	"time"

	oidc "github.com/coreos/go-oidc"
	httptransport "github.com/go-openapi/runtime/client"
	"github.com/gorilla/mux"
	"github.com/gorilla/sessions"
	"go.uber.org/zap"
	"golang.org/x/oauth2"

	negronilogrus "github.com/meatballhat/negroni-logrus"
	micro "github.com/micro/go-micro"
	hydraclient "github.com/ory/hydra/sdk/go/hydra/client"
	"github.com/ory/hydra/sdk/go/hydra/client/admin"
	"github.com/ory/hydra/sdk/go/hydra/models"
	"github.com/pkg/errors"
	"github.com/pydio/cells/common"
	"github.com/pydio/cells/common/caddy"
	"github.com/pydio/cells/common/micro"
	"github.com/pydio/cells/common/plugins"
	"github.com/pydio/cells/common/service"
	"github.com/urfave/negroni"
)

// This store will be used to save user authentication
var store = sessions.NewCookieStore([]byte("something-very-secret-keep-it-safe"))

// The session is a unique session identifier
const sessionName = "authentication"

// This is the Hydra SDK
var client *hydraclient.OryHydra

// A state for performing the OAuth 2.0 flow. This is usually not part of a consent app, but in order for the demo
// to make sense, it performs the OAuth 2.0 authorize code flow.
var state = "demostatedemostatedemo"

var (
	authTemplate    *template.Template
	authTemplateStr = `
        proxy /authpoc/ {{.Auth | urls}} {
			transparent
			without /authpoc/
        }
    `
)

var provider *oidc.Provider

// Configure an OpenID Connect aware OAuth2 client.
var oauth2Config oauth2.Config

func init() {
	var err error

	provider, err = oidc.NewProvider(context.Background(), "http://localhost:44444/")
	if err != nil {
		// handle error
		fmt.Println("Error is ", err)
	}

	// Configure an OpenID Connect aware OAuth2 client.
	oauth2Config = oauth2.Config{
		ClientID:     "poc-client",
		ClientSecret: "secret",
		RedirectURL:  "http://192.168.1.92/authpoc/callback",

		// Discovery returns the OAuth2 endpoints.
		Endpoint: provider.Endpoint(),

		// "openid" is a required scope for OpenID Connect flows.
		Scopes: []string{oidc.ScopeOpenID},
	}

	plugins.Register(func() {
		caddy.RegisterPluginTemplate(
			caddy.TemplateFunc(play),
			[]string{"frontend", "authpoc"},
			"/authpoc",
		)

		tmpl, err := template.New("caddyfile").Funcs(caddy.FuncMap).Parse(authTemplateStr)
		if err != nil {
			log.Fatal("Could not read template ", zap.Error(err))
		}

		authTemplate = tmpl

		service.NewService(
			service.Name("pydio.poc.auth"),
			service.Tag(common.SERVICE_TAG_DISCOVERY),
			service.Description("RESTful Installation server"),
			service.WithGeneric(func(ctx context.Context, cancel context.CancelFunc) (service.Runner, service.Checker, service.Stopper, error) {
				return service.RunnerFunc(func() error {
						return nil
					}), service.CheckerFunc(func() error {
						return nil
					}), service.StopperFunc(func() error {
						return nil
					}), nil
			}, func(s service.Service) (micro.Option, error) {

				transport := httptransport.New("localhost:44445", "", []string{"http"})
				client = hydraclient.New(transport, nil)

				// Set up a router and some routes
				r := mux.NewRouter()
				r.HandleFunc("/", handleHome)
				r.HandleFunc("/consent", handleConsent)
				r.HandleFunc("/login", handleLogin)
				r.HandleFunc("/callback", handleCallback)

				// Set up a request logger, useful for debugging
				n := negroni.New()
				n.Use(negronilogrus.NewMiddleware())
				n.UseHandler(r)

				srv := defaults.NewHTTPServer()

				hd := srv.NewHandler(n)

				// http.Handle("/", router)
				if err := srv.Handle(hd); err != nil {
					return nil, err
				}

				return micro.Server(srv), nil
			}),
		)
	})
}

func play() (*bytes.Buffer, error) {

	buf := bytes.NewBuffer([]byte{})
	if err := authTemplate.Execute(buf, struct {
		Auth string
	}{
		"pydio.poc.auth",
	}); err != nil {
		return nil, err
	}

	return buf, nil
}

// handles request at /home - a small page that let's you know what you can do in this app. Usually the first.
// page a user sees.
func handleHome(w http.ResponseWriter, r *http.Request) {

	state := "foobaree"
	http.Redirect(w, r, oauth2Config.AuthCodeURL(state), http.StatusFound)
}

// The user hits this endpoint if not authenticated. In this example, they can sign in with the credentials
// buzz:lightyear
func handleConsent(w http.ResponseWriter, r *http.Request) {
	if r.Method == "POST" {
		handleConsentPost(w, r)
	} else {
		handleConsentGet(w, r)
	}
}

// After pressing "click here", the Authorize Code flow is performed and the user is redirected to Hydra. Next, Hydra
// validates the consent request (it's not valid yet) and redirects us to the consent endpoint which we set with `CONSENT_URL=http://localhost:4445/consent`.
func handleConsentGet(w http.ResponseWriter, r *http.Request) {
	// Get the consent challenge from the query.
	challenge := r.URL.Query().Get("consent_challenge")
	if challenge == "" {
		http.Error(w, errors.New("Consent endpoint was called without a consent challenge").Error(), http.StatusBadRequest)
		return
	}

	params := new(admin.GetConsentRequestParams)
	params = params.WithChallenge(challenge)
	params = params.WithContext(context.Background())
	params = params.WithHTTPClient(&http.Client{
		Timeout: time.Second * 10,
	})

	// Fetch consent information
	response, err := client.Admin.GetConsentRequest(params)
	if err != nil {
		http.Error(w, errors.Wrap(err, "The consent request endpoint does not respond").Error(), http.StatusBadRequest)
		return
	}

	if response.Payload.Skip {
		params := new(admin.AcceptConsentRequestParams)
		params = params.WithChallenge(challenge)
		params = params.WithContext(context.Background())
		params = params.WithHTTPClient(&http.Client{
			Timeout: time.Second * 10,
		})
		params = params.WithBody(&models.HandledConsentRequest{
			GrantedScope:    response.Payload.RequestedScope,
			GrantedAudience: response.Payload.RequestedAudience,
		})

		// Ok, now we accept the consent request
		response, err := client.Admin.AcceptConsentRequest(params)
		if err != nil {
			http.Error(w, errors.Wrap(err, "The accept consent request endpoint encountered a network error").Error(), http.StatusInternalServerError)
			return
		}

		http.Redirect(w, r, response.Payload.RedirectTo, http.StatusFound)
		return
	}

	// We received a get request, so let's show the html site where the user may give consent.
	renderTemplate(w, "consent.html", struct {
		Challenge      string
		RequestedScope []string
		User           string
		Client         *models.Client
	}{
		Challenge:      challenge,
		RequestedScope: response.Payload.RequestedScope,
		User:           response.Payload.Subject,
		Client:         response.Payload.Client,
	})
}

func handleConsentPost(w http.ResponseWriter, r *http.Request) {

	// Parse the HTTP form - required by Go.
	if err := r.ParseForm(); err != nil {
		http.Error(w, errors.Wrap(err, "Could not parse form").Error(), http.StatusBadRequest)
		return
	}

	challenge := r.FormValue("challenge")

	if r.FormValue("submit") == "DenyRequest" {
		params := new(admin.RejectLoginRequestParams)
		params = params.WithChallenge(challenge)
		params = params.WithContext(context.Background())
		params = params.WithHTTPClient(&http.Client{
			Timeout: time.Second * 10,
		})
		params = params.WithBody(&models.RequestDeniedError{
			Code:        http.StatusForbidden,
			Name:        "Access denied",
			Description: "The resource owner denied the request",
		})

		// Ok, now we accept the consent request
		response, err := client.Admin.RejectLoginRequest(params)
		if err != nil {
			http.Error(w, errors.Wrap(err, "The accept consent request endpoint encountered a network error").Error(), http.StatusInternalServerError)
			return
		}

		http.Redirect(w, r, response.Payload.RedirectTo, http.StatusFound)

		return
	}

	var grantedScopes []string
	if vs, ok := r.Form["grant_scope"]; ok {
		grantedScopes = vs
	}

	params := new(admin.GetConsentRequestParams)
	params = params.WithChallenge(challenge)
	params = params.WithContext(context.Background())
	params = params.WithHTTPClient(&http.Client{
		Timeout: time.Second * 10,
	})

	// Fetch consent information
	response, err := client.Admin.GetConsentRequest(params)
	if err != nil {
		http.Error(w, errors.Wrap(err, "The consent request endpoint does not respond").Error(), http.StatusBadRequest)
		return
	}

	acceptParams := new(admin.AcceptConsentRequestParams)
	acceptParams = acceptParams.WithChallenge(challenge)
	acceptParams = acceptParams.WithContext(context.Background())
	acceptParams = acceptParams.WithHTTPClient(&http.Client{
		Timeout: time.Second * 10,
	})
	acceptParams = acceptParams.WithBody(&models.HandledConsentRequest{
		GrantedScope:    grantedScopes,
		GrantedAudience: response.Payload.RequestedAudience,
		Remember:        r.FormValue("remember") == "true",
		RememberFor:     3600,
	})

	// Ok, now we accept the consent request
	acceptResponse, err := client.Admin.AcceptConsentRequest(acceptParams)
	if err != nil {
		http.Error(w, errors.Wrap(err, "The accept consent request endpoint encountered a network error").Error(), http.StatusInternalServerError)
		return
	}

	fmt.Println(acceptResponse.Payload.RedirectTo)

	http.Redirect(w, r, acceptResponse.Payload.RedirectTo, http.StatusFound)
}

// The user hits this endpoint if not authenticated. In this example, they can sign in with the credentials
// buzz:lightyear
func handleLogin(w http.ResponseWriter, r *http.Request) {
	if r.Method == "POST" {
		handleLoginPost(w, r)
	} else {
		handleLoginGet(w, r)
	}
	return
}

func handleLoginGet(w http.ResponseWriter, r *http.Request) {

	challenge := r.URL.Query().Get("login_challenge")

	if challenge == "" {
		http.Error(w, errors.New("Consent endpoint was called without a consent challenge").Error(), http.StatusBadRequest)
		return
	}

	params := new(admin.GetLoginRequestParams)
	params = params.WithContext(context.Background())
	params = params.WithHTTPClient(&http.Client{
		Timeout: time.Second * 10,
	})
	params = params.WithChallenge(challenge)

	// Fetch consent information
	response, err := client.Admin.GetLoginRequest(params)
	if err != nil {
		http.Error(w, errors.Wrap(err, "The login request endpoint does not respond").Error(), http.StatusBadRequest)
		return
	}

	if response.Payload.Skip {
		params := new(admin.AcceptLoginRequestParams)
		params = params.WithChallenge(challenge)
		params = params.WithContext(context.Background())
		params = params.WithHTTPClient(&http.Client{
			Timeout: time.Second * 10,
		})
		params = params.WithBody(&models.HandledLoginRequest{
			Subject: &response.Payload.Subject,
		})

		// Ok, now we accept the consent request
		response, err := client.Admin.AcceptLoginRequest(params)
		if err != nil {
			http.Error(w, errors.Wrap(err, "The accept login request endpoint encountered a network error").Error(), http.StatusInternalServerError)
			return
		}

		http.Redirect(w, r, response.Payload.RedirectTo, http.StatusFound)
	}

	// It's a get request, so let's render the template
	renderTemplate(w, "login.html", struct {
		Challenge string
	}{
		challenge,
	})
}

func handleLoginPost(w http.ResponseWriter, r *http.Request) {

	// Parse the HTTP form - required by Go.
	if err := r.ParseForm(); err != nil {
		http.Error(w, errors.Wrap(err, "Could not parse form").Error(), http.StatusBadRequest)
		return
	}

	challenge := r.FormValue("challenge")

	if !(r.FormValue("email") == "email@foobar.com" && r.FormValue("password") == "foobar") {
		renderTemplate(w, "login.html", struct {
			Challenge string
			Error     string
		}{
			challenge,
			"The username / password combination is invalid",
		})

		return
	}

	fmt.Println("Accepting login params")

	email := r.FormValue("email")

	params := new(admin.AcceptLoginRequestParams)
	params = params.WithChallenge(challenge)
	params = params.WithContext(context.Background())
	params = params.WithHTTPClient(&http.Client{
		Timeout: time.Second * 10,
	})
	params = params.WithBody(&models.HandledLoginRequest{
		Subject:     &email,
		Remember:    r.FormValue("remember") == "true",
		RememberFor: 3600,
	})

	// Ok, now we accept the login request
	response, err := client.Admin.AcceptLoginRequest(params)
	if err != nil {
		http.Error(w, errors.Wrap(err, "The accept consent request endpoint encountered a network error").Error(), http.StatusInternalServerError)
		return
	}

	fmt.Println(response.Payload.RedirectTo)

	http.Redirect(w, r, response.Payload.RedirectTo, http.StatusFound)

	return
}

// Once the user has given their consent, we will hit this endpoint. Again,
// this is not something that would be included in a traditional consent app,
// but we added it so you can see the data once the consent flow is done.
func handleCallback(w http.ResponseWriter, r *http.Request) {
	// in the real world you should check the state query parameter, but this is omitted for brevity reasons.

	fmt.Println(r.URL.Query())

	// Exchange the access code for an access (and optionally) a refresh token
	token, err := oauth2Config.Exchange(context.Background(), r.URL.Query().Get("code"))
	if err != nil {
		http.Error(w, errors.Wrap(err, "Could not exhange token").Error(), http.StatusBadRequest)
		return
	}

	// Render the output
	renderTemplate(w, "callback.html", struct {
		*oauth2.Token
		IDToken interface{}
	}{
		Token:   token,
		IDToken: token.Extra("id_token"),
	})
}

// authenticated checks if our cookie store has a user stored and returns the
// user's name, or an empty string if the user is not yet authenticated.
// func authenticated(r *http.Request) string {
// 	session, _ := store.Get(r, sessionName)
// 	if u, ok := session.Values["user"]; !ok {
// 		return ""
// 	} else if user, ok := u.(string); !ok {
// 		return ""
// 	} else {
// 		return user
// 	}
// }

// renderTemplate is a convenience helper for rendering templates.
func renderTemplate(w http.ResponseWriter, id string, d interface{}) bool {
	if t, err := template.New(id).ParseFiles("./discovery/auth/server/templates/" + id); err != nil {
		http.Error(w, errors.Wrap(err, "Could not render template").Error(), http.StatusInternalServerError)
		return false
	} else if err := t.Execute(w, d); err != nil {
		http.Error(w, errors.Wrap(err, "Could not render template").Error(), http.StatusInternalServerError)
		return false
	}
	return true
}
