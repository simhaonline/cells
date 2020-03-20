(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.PydioActivityStreams = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/*
 * Copyright 2007-2017 Charles du Jeu - Abstrium SAS <team (at) pyd.io>
 * This file is part of Pydio.
 *
 * Pydio is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * Pydio is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with Pydio.  If not, see <http://www.gnu.org/licenses/>.
 *
 * The latest code can be found at <https://pydio.com>.
 */

'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactMarkdown = require('react-markdown');

var _reactMarkdown2 = _interopRequireDefault(_reactMarkdown);

var _materialUi = require('material-ui');

var _DocLink = require('./DocLink');

var _DocLink2 = _interopRequireDefault(_DocLink);

var _require$requireLib = require('pydio').requireLib('components');

var UserAvatar = _require$requireLib.UserAvatar;

var _require$requireLib2 = require('pydio').requireLib('boot');

var PydioContextConsumer = _require$requireLib2.PydioContextConsumer;

var _Pydio$requireLib = Pydio.requireLib('boot');

var moment = _Pydio$requireLib.moment;

var Paragraph = (function (_React$Component) {
    _inherits(Paragraph, _React$Component);

    function Paragraph() {
        _classCallCheck(this, Paragraph);

        _get(Object.getPrototypeOf(Paragraph.prototype), 'constructor', this).apply(this, arguments);
    }

    _createClass(Paragraph, [{
        key: 'render',
        value: function render() {
            return _react2['default'].createElement(
                'span',
                null,
                this.props.children
            );
        }
    }]);

    return Paragraph;
})(_react2['default'].Component);

function workspacesLocations(pydio, object) {
    var workspaces = [];
    if (!object.partOf || !object.partOf.items || !object.partOf.items.length) {
        return "No workspace found";
    }

    var _loop = function (i) {
        var ws = object.partOf.items[i];
        // Remove slug part
        //let paths = ws.rel.split('/');
        //paths.shift();
        //let relPath = paths.join('/');
        workspaces.push(_react2['default'].createElement(
            'a',
            { key: ws.id, onClick: function () {
                    return pydio.triggerRepositoryChange(ws.id);
                }, style: { cursor: 'pointer' } },
            ws.name
        ));
        workspaces.push(_react2['default'].createElement(
            'span',
            { key: ws.id + '-sep' },
            ', '
        ));
    };

    for (var i = 0; i < object.partOf.items.length; i++) {
        _loop(i);
    }
    workspaces.pop();
    return _react2['default'].createElement(
        'span',
        null,
        pydio.MessageHash['notification_center.16'],
        ' ',
        _react2['default'].createElement(
            'span',
            null,
            workspaces
        )
    );
}

function LinkWrapper(pydio, activity) {

    return _react2['default'].createClass({

        render: function render() {
            var _props = this.props;
            var href = _props.href;
            var children = _props.children;

            var title = "";
            var onClick = null;
            if (href.startsWith('doc://')) {
                if (activity.type === 'Delete') {
                    return _react2['default'].createElement(
                        'a',
                        { style: { textDecoration: 'line-through' } },
                        children
                    );
                } else {
                    return _react2['default'].createElement(
                        _DocLink2['default'],
                        { pydio: pydio, activity: activity },
                        children
                    );
                }
            } else if (href.startsWith('user://')) {
                var userId = href.replace('user://', '');
                return _react2['default'].createElement(UserAvatar, { userId: userId, displayAvatar: false, richOnClick: true, style: { cursor: 'pointer', display: 'inline-block', color: 'rgb(66, 140, 179)' }, pydio: pydio });
            } else if (href.startsWith('workspaces://')) {
                (function () {
                    var wsId = href.replace('workspaces://', '');
                    if (pydio.user && pydio.user.getRepositoriesList().get(wsId)) {
                        onClick = function () {
                            pydio.triggerRepositoryChange(wsId);
                        };
                    }
                })();
            }
            return _react2['default'].createElement(
                'a',
                { title: title, style: { cursor: 'pointer', color: 'rgb(66, 140, 179)' }, onClick: onClick },
                children
            );
        }
    });
}

var Activity = (function (_React$Component2) {
    _inherits(Activity, _React$Component2);

    function Activity() {
        _classCallCheck(this, Activity);

        _get(Object.getPrototypeOf(Activity.prototype), 'constructor', this).apply(this, arguments);
    }

    _createClass(Activity, [{
        key: 'render',
        value: function render() {
            var _props2 = this.props;
            var pydio = _props2.pydio;
            var activity = _props2.activity;
            var listContext = _props2.listContext;
            var displayContext = _props2.displayContext;
            var oneLiner = _props2.oneLiner;

            var secondary = activity.type + " - " + activity.actor.name;
            if (activity.summary) {
                secondary = _react2['default'].createElement(_reactMarkdown2['default'], { source: activity.summary, renderers: { 'paragraph': Paragraph, 'link': LinkWrapper(pydio, activity) } });
            }

            var avatar = _react2['default'].createElement(UserAvatar, {
                useDefaultAvatar: true,
                userId: activity.actor.id,
                userLabel: activity.actor.name,
                displayLocalLabel: true,
                userType: 'user',
                pydio: pydio,
                style: { display: 'flex', alignItems: 'center', maxWidth: '60%' },
                labelStyle: { fontSize: 14, paddingLeft: 10, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' },
                avatarStyle: { flexShrink: 0 },
                avatarSize: 28,
                richOnHover: true
            });

            var summary = undefined;
            var actionIcon = undefined;
            var blockStyle = {
                margin: '0px 10px 6px'
            };
            var summaryStyle = {
                padding: '6px 22px 12px',
                marginTop: 6,
                borderRadius: 2,
                borderLeft: '2px solid #e0e0e0',
                marginLeft: 13,
                color: 'rgba(0,0,0,0.33)',
                fontWeight: 500,
                fontStyle: 'italic',
                overflow: 'hidden'
            };
            if (displayContext === 'popover') {
                summaryStyle = {
                    fontSize: 13,
                    color: 'rgba(0,0,0,0.33)',
                    fontWeight: 500,
                    margin: '6px 0',
                    padding: 6
                };
            }

            var className = '';
            var title = undefined;
            switch (activity.type) {
                case "Create":
                    if (activity.object.type === 'Document') {
                        className = "file-plus";
                    } else {
                        className = "folder-plus";
                    }
                    title = "Created";
                    break;
                case "Delete":
                    className = "delete";
                    title = "Deleted";
                    break;
                case "Edit":
                case "Update":
                    className = "pencil";
                    title = "Modified";
                    break;
                case "UpdateMeta":
                    className = "tag-multiple";
                    title = "Modified";
                    break;
                case "UpdateComment":
                    className = "message-outline";
                    title = "Commented";
                    break;
                case "Read":
                    className = "eye";
                    title = "Accessed";
                    break;
                case "Move":
                    className = "file-send";
                    title = "Moved";
                    break;
                case "Share":
                    className = "share-variant";
                    if (activity.object.type === "Cell") {
                        className = "icomoon-cells";
                    } else if (activity.object.type === "Workspace") {
                        className = "folder";
                    }
                    title = "Shared";
                    break;
                default:
                    break;
            }
            if (className.indexOf('icomoon-') === -1) {
                className = 'mdi mdi-' + className;
            }
            if (listContext === 'NODE-LEAF') {
                blockStyle = { margin: '16px 10px' };
                actionIcon = _react2['default'].createElement(_materialUi.FontIcon, { className: className, title: title, style: { fontSize: 17, color: 'rgba(0,0,0,0.17)' } });
            } else {
                if (displayContext === 'mainList') {
                    return _react2['default'].createElement(_materialUi.ListItem, {
                        leftIcon: _react2['default'].createElement(_materialUi.FontIcon, { className: className, color: 'rgba(0,0,0,.33)' }),
                        primaryText: secondary,
                        secondaryText: _react2['default'].createElement(
                            'div',
                            { style: { color: 'rgba(0,0,0,.33)' } },
                            workspacesLocations(pydio, activity.object)
                        ),
                        disabled: true
                    });
                } else if (displayContext === 'popover') {
                    var leftIcon = _react2['default'].createElement(_materialUi.FontIcon, { className: className, title: title, style: { padding: '0 8px', fontSize: 20, color: 'rgba(0,0,0,0.17)' } });
                    summary = _react2['default'].createElement(
                        'div',
                        { style: { display: 'flex', alignItems: 'center' } },
                        leftIcon,
                        _react2['default'].createElement(
                            'div',
                            { style: _extends({}, summaryStyle, { flex: 1 }) },
                            secondary
                        )
                    );
                } else {
                    summary = _react2['default'].createElement(
                        'div',
                        { style: summaryStyle },
                        secondary
                    );
                }
            }

            return _react2['default'].createElement(
                'div',
                { style: blockStyle },
                !oneLiner && _react2['default'].createElement(
                    'div',
                    { style: { display: 'flex', alignItems: 'center' } },
                    avatar,
                    _react2['default'].createElement(
                        'span',
                        { style: { fontSize: 13, display: 'inline-block', flex: 1, height: 18, color: 'rgba(0,0,0,0.23)', fontWeight: 500, paddingLeft: 8, whiteSpace: 'nowrap' } },
                        moment(activity.updated).fromNow()
                    ),
                    actionIcon
                ),
                summary
            );
        }
    }]);

    return Activity;
})(_react2['default'].Component);

Activity.PropTypes = {
    activity: _react2['default'].PropTypes.object,
    listContext: _react2['default'].PropTypes.string,
    displayContext: _react2['default'].PropTypes.oneOf(['mainList', 'infoPanel', 'popover'])
};

exports['default'] = Activity = PydioContextConsumer(Activity);
exports['default'] = Activity;
module.exports = exports['default'];

},{"./DocLink":5,"material-ui":"material-ui","pydio":"pydio","react":"react","react-markdown":"react-markdown"}],2:[function(require,module,exports){
/*
 * Copyright 2007-2017 Charles du Jeu - Abstrium SAS <team (at) pyd.io>
 * This file is part of Pydio.
 *
 * Pydio is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * Pydio is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with Pydio.  If not, see <http://www.gnu.org/licenses/>.
 *
 * The latest code can be found at <https://pydio.com>.
 */
'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i]; return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _materialUi = require('material-ui');

var _pydio = require('pydio');

var _pydio2 = _interopRequireDefault(_pydio);

var _Client = require('./Client');

var _Client2 = _interopRequireDefault(_Client);

var _Activity = require('./Activity');

var _Activity2 = _interopRequireDefault(_Activity);

var _Pydio$requireLib = _pydio2['default'].requireLib('boot');

var PydioContextConsumer = _Pydio$requireLib.PydioContextConsumer;
var moment = _Pydio$requireLib.moment;

var _Pydio$requireLib2 = _pydio2['default'].requireLib('components');

var EmptyStateView = _Pydio$requireLib2.EmptyStateView;

var ActivityList = (function (_React$Component) {
    _inherits(ActivityList, _React$Component);

    function ActivityList(props) {
        _classCallCheck(this, ActivityList);

        _get(Object.getPrototypeOf(ActivityList.prototype), 'constructor', this).call(this, props);
        if (props.items) {
            this.state = { data: { items: props.items }, offset: 0, loadMore: false, loading: false };
        } else {
            this.state = { data: [], offset: 0, loadMore: true, loading: false };
        }
    }

    _createClass(ActivityList, [{
        key: 'mergeMoreFeed',
        value: function mergeMoreFeed(currentFeed, newFeed) {
            var currentIds = currentFeed.items.map(function (item) {
                return item.id;
            });
            var filtered = newFeed.items.filter(function (item) {
                return currentIds.indexOf(item.id) === -1;
            });
            if (!filtered.length) {
                this.setState({ loadMore: false });
                return currentFeed;
            }
            var merged = currentFeed;
            merged.items = [].concat(_toConsumableArray(currentFeed.items), _toConsumableArray(filtered));
            merged.totalItems = merged.items.length;
            return merged;
        }
    }, {
        key: 'loadForProps',
        value: function loadForProps(props) {
            var _this = this;

            var context = props.context;
            var pointOfView = props.pointOfView;
            var contextData = props.contextData;
            var limit = props.limit;
            var _state = this.state;
            var offset = _state.offset;
            var data = _state.data;

            if (limit === undefined) {
                limit = -1;
            }
            if (offset > 0) {
                limit = 100;
            }
            this.setState({ loading: true, error: null });
            _Client2['default'].loadActivityStreams(context, contextData, 'outbox', pointOfView, offset, limit).then(function (json) {
                if (offset > 0 && data && data.items) {
                    if (json && json.items) _this.setState({ data: _this.mergeMoreFeed(data, json) });
                } else {
                    _this.setState({ data: json });
                }
                if (!json || !json.items || !json.items.length) {
                    _this.setState({ loadMore: false });
                }
                _this.setState({ loading: false });
            })['catch'](function (msg) {
                _this.setState({ loading: false, error: msg });
            });
        }
    }, {
        key: 'componentWillMount',
        value: function componentWillMount() {
            var _props = this.props;
            var items = _props.items;
            var contextData = _props.contextData;

            if (items) {
                return;
            }
            if (contextData) {
                this.loadForProps(this.props);
            }
        }
    }, {
        key: 'componentWillReceiveProps',
        value: function componentWillReceiveProps(nextProps) {
            var _this2 = this;

            if (nextProps.items) {
                this.setState({ data: { items: nextProps.items }, offset: 0, loadMore: false });
                return;
            }
            if (nextProps.contextData !== this.props.contextData || nextProps.context !== this.props.context) {
                this.setState({ offset: 0, loadMore: true }, function () {
                    _this2.loadForProps(nextProps);
                });
            }
        }
    }, {
        key: 'render',
        value: function render() {
            var _this3 = this;

            var content = [];
            var _state2 = this.state;
            var data = _state2.data;
            var loadMore = _state2.loadMore;
            var loading = _state2.loading;
            var error = _state2.error;
            var _props2 = this.props;
            var listContext = _props2.listContext;
            var groupByDate = _props2.groupByDate;
            var displayContext = _props2.displayContext;
            var pydio = _props2.pydio;

            var previousFrom = undefined;
            var emptyStateIcon = "mdi mdi-pulse";
            var emptyStateString = loading ? pydio.MessageHash['notification_center.17'] : pydio.MessageHash['notification_center.18'];
            if (error) {
                emptyStateString = error.Detail || error.msg || error;
                emptyStateIcon = "mdi mdi-alert-circle-outline";
            }
            if (data !== null && data.items) {
                data.items.forEach(function (ac) {

                    var fromNow = moment(ac.updated).fromNow();
                    if (groupByDate && fromNow !== previousFrom) {
                        content.push(_react2['default'].createElement(
                            'div',
                            { style: { padding: '0 16px', fontSize: 13, color: 'rgba(147, 168, 178, 0.67)', fontWeight: 500 } },
                            fromNow
                        ));
                    }
                    content.push(_react2['default'].createElement(_Activity2['default'], { key: ac.id, activity: ac, listContext: listContext, oneLiner: groupByDate, displayContext: displayContext }));
                    if (groupByDate) {
                        previousFrom = fromNow;
                    }
                });
            }
            if (content.length && loadMore) {
                var loadAction = function loadAction() {
                    _this3.setState({ offset: data.items.length + 1 }, function () {
                        _this3.loadForProps(_this3.props);
                    });
                };
                content.push(_react2['default'].createElement(
                    'div',
                    { style: { paddingLeft: 16 } },
                    _react2['default'].createElement(_materialUi.FlatButton, { primary: true, label: loading ? pydio.MessageHash['notification_center.20'] : pydio.MessageHash['notification_center.19'], disabled: loading, onTouchTap: loadAction })
                ));
            }
            if (content.length) {
                return _react2['default'].createElement(
                    _materialUi.List,
                    { style: this.props.style },
                    content
                );
            } else {
                var style = { backgroundColor: 'transparent' };
                var iconStyle = undefined,
                    legendStyle = undefined;
                if (displayContext === 'popover') {
                    style = _extends({}, style, { minHeight: 250 });
                } else if (displayContext === 'infoPanel') {
                    style = _extends({}, style, { paddingBottom: 20 });
                    iconStyle = { fontSize: 40 };
                    legendStyle = { fontSize: 13, fontWeight: 400 };
                }
                return _react2['default'].createElement(EmptyStateView, {
                    pydio: this.props.pydio,
                    iconClassName: emptyStateIcon,
                    primaryTextId: emptyStateString,
                    style: style,
                    iconStyle: iconStyle,
                    legendStyle: legendStyle
                });
            }
        }
    }]);

    return ActivityList;
})(_react2['default'].Component);

ActivityList.PropTypes = {
    context: _react2['default'].PropTypes.string,
    contextData: _react2['default'].PropTypes.string,
    boxName: _react2['default'].PropTypes.string,
    pointOfView: _react2['default'].PropTypes.oneOf(['GENERIC', 'ACTOR', 'SUBJECT']),
    displayContext: _react2['default'].PropTypes.oneOf(['mainList', 'infoPanel', 'popover'])
};

exports['default'] = ActivityList = PydioContextConsumer(ActivityList);
exports['default'] = ActivityList;
module.exports = exports['default'];

},{"./Activity":1,"./Client":4,"material-ui":"material-ui","pydio":"pydio","react":"react"}],3:[function(require,module,exports){
/*
 * Copyright 2007-2018 Charles du Jeu - Abstrium SAS <team (at) pyd.io>
 * This file is part of Pydio.
 *
 * Pydio is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * Pydio is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with Pydio.  If not, see <http://www.gnu.org/licenses/>.
 *
 * The latest code can be found at <https://pydio.com>.
 */
'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _pydioHttpApi = require('pydio/http/api');

var _pydioHttpApi2 = _interopRequireDefault(_pydioHttpApi);

var _pydioHttpRestApi = require('pydio/http/rest-api');

var Callbacks = (function () {
    function Callbacks() {
        _classCallCheck(this, Callbacks);
    }

    _createClass(Callbacks, null, [{
        key: 'toggleWatch',
        value: function toggleWatch(manager, args) {

            if (args) {
                (function () {

                    var node = pydio.getUserSelection().getUniqueNode();
                    var nodeUuid = node.getMetadata().get('uuid');
                    var userId = pydio.user.id;
                    var subscription = new _pydioHttpRestApi.ActivitySubscription();
                    var type = new _pydioHttpRestApi.ActivityOwnerType();
                    subscription.UserId = userId;
                    subscription.ObjectId = nodeUuid;
                    subscription.ObjectType = type.NODE;
                    var events = [];
                    if (args === 'watch_change' || args === 'watch_both') {
                        events.push('change');
                    }
                    if (args === 'watch_read' || args === 'watch_both') {
                        events.push('read');
                    }
                    subscription.Events = events;
                    var api = new _pydioHttpRestApi.ActivityServiceApi(_pydioHttpApi2['default'].getRestClient());
                    api.subscribe(subscription).then(function (outSub) {
                        var overlay = node.getMetadata().get('overlay_class') || '';
                        if (args === 'watch_stop') {
                            node.getMetadata()['delete']('meta_watched');
                            node.getMetadata().set('overlay_class', overlay.replace('mdi mdi-bell', ''));
                        } else {
                            node.getMetadata().set('meta_watched', 'META_' + args.toUpperCase());
                            var overlays = overlay.replace('mdi mdi-bell', '').split(',');
                            overlays.push('mdi mdi-bell');
                            node.getMetadata().set('overlay_class', overlays.join(','));
                        }
                        node.notify('node_replaced');
                    });
                })();
            }
        }
    }]);

    return Callbacks;
})();

exports['default'] = Callbacks;
module.exports = exports['default'];

},{"pydio/http/api":"pydio/http/api","pydio/http/rest-api":"pydio/http/rest-api"}],4:[function(require,module,exports){
/*
 * Copyright 2007-2017 Charles du Jeu - Abstrium SAS <team (at) pyd.io>
 * This file is part of Pydio.
 *
 * Pydio is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * Pydio is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with Pydio.  If not, see <http://www.gnu.org/licenses/>.
 *
 * The latest code can be found at <https://pydio.com>.
 */

'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _pydio = require('pydio');

var _pydio2 = _interopRequireDefault(_pydio);

var _pydioHttpApi = require('pydio/http/api');

var _pydioHttpApi2 = _interopRequireDefault(_pydioHttpApi);

var _pydioHttpRestApi = require('pydio/http/rest-api');

var AS2Client = (function () {
    function AS2Client() {
        _classCallCheck(this, AS2Client);
    }

    _createClass(AS2Client, null, [{
        key: 'loadActivityStreams',
        value: function loadActivityStreams() {
            var context = arguments.length <= 0 || arguments[0] === undefined ? 'USER_ID' : arguments[0];
            var contextData = arguments.length <= 1 || arguments[1] === undefined ? '' : arguments[1];
            var boxName = arguments.length <= 2 || arguments[2] === undefined ? 'outbox' : arguments[2];
            var pointOfView = arguments.length <= 3 || arguments[3] === undefined ? '' : arguments[3];
            var offset = arguments.length <= 4 || arguments[4] === undefined ? -1 : arguments[4];
            var limit = arguments.length <= 5 || arguments[5] === undefined ? -1 : arguments[5];

            if (!contextData) {
                return Promise.resolve([]);
            }
            var api = new _pydioHttpRestApi.ActivityServiceApi(_pydioHttpApi2['default'].getRestClient());
            var req = new _pydioHttpRestApi.ActivityStreamActivitiesRequest();
            req.Context = context;
            req.ContextData = contextData;
            req.BoxName = boxName;
            if (offset > -1) {
                req.Offset = offset;
            }
            if (limit > -1) {
                req.Limit = limit;
            }
            req.Language = _pydio2['default'].getInstance().user.getPreference("lang") || '';
            if (pointOfView) {
                req.PointOfView = pointOfView;
            }
            return api.stream(req);
        }
    }, {
        key: 'UnreadInbox',
        value: function UnreadInbox(userId) {
            var callback = arguments.length <= 1 || arguments[1] === undefined ? function (count) {} : arguments[1];

            var api = new _pydioHttpRestApi.ActivityServiceApi(_pydioHttpApi2['default'].getRestClient());
            var req = new _pydioHttpRestApi.ActivityStreamActivitiesRequest();
            req.Context = 'USER_ID';
            req.ContextData = userId;
            req.BoxName = 'inbox';
            req.UnreadCountOnly = true;
            return api.stream(req).then(function (data) {
                return data.totalItems || 0;
            });
        }
    }]);

    return AS2Client;
})();

exports['default'] = AS2Client;
module.exports = exports['default'];

},{"pydio":"pydio","pydio/http/api":"pydio/http/api","pydio/http/rest-api":"pydio/http/rest-api"}],5:[function(require,module,exports){
/*
 * Copyright 2007-2017 Charles du Jeu - Abstrium SAS <team (at) pyd.io>
 * This file is part of Pydio.
 *
 * Pydio is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * Pydio is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with Pydio.  If not, see <http://www.gnu.org/licenses/>.
 *
 * The latest code can be found at <https://pydio.com>.
 */

'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _require = require('material-ui');

var Popover = _require.Popover;
var Paper = _require.Paper;
var IconButton = _require.IconButton;
var FlatButton = _require.FlatButton;
var Divider = _require.Divider;

var Pydio = require('pydio');
var debounce = require('lodash.debounce');
var MetaNodeProvider = require('pydio/model/meta-node-provider');

var _Pydio$requireLib = Pydio.requireLib('boot');

var PydioContextConsumer = _Pydio$requireLib.PydioContextConsumer;

var _Pydio$requireLib2 = Pydio.requireLib('workspaces');

var FilePreview = _Pydio$requireLib2.FilePreview;

function nodesFromObject(object, pydio) {
    var nodes = [];
    var currentRepository = pydio.user.getActiveRepository();
    if (!object.partOf || !object.partOf.items || !object.partOf.items.length) {
        return nodes;
    }
    for (var i = 0; i < object.partOf.items.length; i++) {
        var ws = object.partOf.items[i];
        // Remove slug part
        var paths = ws.rel.split('/');
        paths.shift();
        var relPath = paths.join('/');
        var node = new AjxpNode(relPath, object.type === 'Document');
        node.getMetadata().set('repository_id', ws.id);
        node.getMetadata().set('repository_label', ws.name);
        if (ws.id === currentRepository) {
            return [node];
        }
        nodes.push(node);
    }
    return nodes;
}

var DocPreview = (function (_React$Component) {
    _inherits(DocPreview, _React$Component);

    function DocPreview(props) {
        _classCallCheck(this, DocPreview);

        _get(Object.getPrototypeOf(DocPreview.prototype), 'constructor', this).call(this, props);
        var nodes = nodesFromObject(props.activity.object, props.pydio);
        if (nodes.length && !nodes[0].isLeaf()) {
            this.state = {
                previewLoaded: true,
                previewFailed: false,
                nodes: nodes
            };
        } else {
            this.state = {
                previewLoaded: false,
                previewFailed: false,
                nodes: nodes
            };
        }
    }

    _createClass(DocPreview, [{
        key: 'render',
        value: function render() {
            var _this = this;

            var pydio = this.props.pydio;
            var _state = this.state;
            var previewLoaded = _state.previewLoaded;
            var nodes = _state.nodes;
            var previewFailed = _state.previewFailed;

            var previewNode = nodes.length ? nodes[0] : null;
            var fPreview = undefined;
            var fPreviewLoading = undefined;
            var fPreviewStyle = {
                height: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 70
            };
            if (previewNode && previewNode.isLeaf()) {
                if (previewLoaded && !previewFailed) {
                    fPreview = _react2['default'].createElement(FilePreview, { style: fPreviewStyle,
                        node: previewNode, pydio: pydio, loadThumbnail: true,
                        richPreview: true, processing: !previewLoaded });
                } else if (previewLoaded && previewFailed) {

                    fPreview = _react2['default'].createElement(
                        'div',
                        { style: _extends({}, fPreviewStyle, { flexDirection: 'column' }), className: 'mimefont-container' },
                        _react2['default'].createElement('div', { className: 'mimefont mdi mdi-delete' }),
                        _react2['default'].createElement(
                            'span',
                            { style: { fontSize: 13 } },
                            'File deleted'
                        )
                    );
                } else {
                    (function () {
                        var nodeRepoId = previewNode.getMetadata().get('repository_id');
                        var nodeRepoLabel = previewNode.getMetadata().get('repository_label');
                        var provider = new MetaNodeProvider();
                        previewNode.observeOnce('error', function () {
                            _this.setState({ previewLoaded: true, previewFailed: true });
                        });
                        provider.loadLeafNodeSync(previewNode, function (loadedNode) {
                            loadedNode.getMetadata().set('repository_id', nodeRepoId);
                            loadedNode.getMetadata().set('repository_label', nodeRepoLabel);
                            nodes[0] = loadedNode;
                            _this.setState({ previewLoaded: true, nodes: nodes });
                        }, true, { tmp_repository_id: nodeRepoId });

                        fPreviewLoading = _react2['default'].createElement(FilePreview, { style: fPreviewStyle,
                            node: previewNode, pydio: pydio, loadThumbnail: false,
                            richPreview: false, processing: true });
                    })();
                }
            }

            var buttons = [];
            var currentRepoButton = undefined;
            var currentRepository = pydio.user.getActiveRepository();

            var _loop = function (i) {
                var node = nodes[i];
                var button = _react2['default'].createElement(
                    'div',
                    { style: { display: 'flex', alignItems: 'center', paddingLeft: 10 } },
                    _react2['default'].createElement(
                        'div',
                        { style: { flex: 1, fontSize: 13, fontWeight: 500, color: 'rgba(0,0,0,0.33)' } },
                        pydio.MessageHash['notification_center.16'],
                        ' ',
                        node.getMetadata().get('repository_label')
                    ),
                    _react2['default'].createElement(IconButton, { iconClassName: "mdi mdi-open-in-new", tooltip: pydio.MessageHash['notification_center.6'], tooltipPosition: "top-center", onClick: function () {
                            pydio.goTo(node);
                        } })
                );
                if (node.getMetadata().get('repository_id') === currentRepository) {
                    currentRepoButton = _react2['default'].createElement(
                        'div',
                        { style: { display: 'flex', alignItems: 'center' } },
                        _react2['default'].createElement('span', { style: { flex: 1 } }),
                        ' ',
                        _react2['default'].createElement(FlatButton, { label: pydio.MessageHash['notification_center.6'], iconClassName: "mdi mdi-open-in-new", tooltip: 'Open', tooltipPosition: "top-right", onClick: function () {
                                pydio.goTo(node);
                            } })
                    );
                    return 'break';
                }
                buttons.push(button);
                if (i < nodes.length - 1) {
                    buttons.push(_react2['default'].createElement(Divider, null));
                }
            };

            for (var i = 0; i < nodes.length; i++) {
                var _ret2 = _loop(i);

                if (_ret2 === 'break') break;
            }
            if (currentRepoButton) {
                buttons = [currentRepoButton];
            }

            return _react2['default'].createElement(
                'div',
                null,
                !previewFailed && _react2['default'].createElement(
                    'div',
                    { style: { padding: 6 } },
                    buttons
                )
            );
        }
    }]);

    return DocPreview;
})(_react2['default'].Component);

var DocLink = (function (_React$Component2) {
    _inherits(DocLink, _React$Component2);

    function DocLink(props) {
        _classCallCheck(this, DocLink);

        _get(Object.getPrototypeOf(DocLink.prototype), 'constructor', this).call(this, props);
        this.state = {
            showPopover: false,
            popoverAnchor: null
        };
    }

    _createClass(DocLink, [{
        key: 'render',
        value: function render() {
            var _this2 = this;

            var _props = this.props;
            var pydio = _props.pydio;
            var activity = _props.activity;
            var children = _props.children;

            if (!activity.object.name) {
                activity.object.name = '';
            }
            var nodes = nodesFromObject(activity.object, pydio);

            var onClick = undefined,
                onMouseOver = undefined,
                onMouseOut = undefined,
                popover = undefined;

            var pathParts = activity.object.name.replace('doc://', '').split('/');
            pathParts.shift();
            var title = '/' + pathParts.join('/');

            if (nodes.length > 1) {

                onClick = function () {
                    pydio.goTo(nodes[0]);
                };
                onMouseOut = debounce(function () {
                    _this2.setState({ showPopover: false });
                }, 350);
                onMouseOver = function (e) {
                    _this2.setState({ showPopover: true, popoverAnchor: e.currentTarget });
                    onMouseOut.cancel();
                };
                var onMouseOverInner = function onMouseOverInner(e) {
                    _this2.setState({ showPopover: true });
                    onMouseOut.cancel();
                };

                popover = _react2['default'].createElement(
                    Popover,
                    {
                        open: this.state.showPopover,
                        anchorEl: this.state.popoverAnchor,
                        onRequestClose: function (reason) {
                            if (reason !== 'clickAway') {
                                _this2.setState({ showPopover: false });
                            }
                        },
                        anchorOrigin: { horizontal: "left", vertical: "bottom" },
                        targetOrigin: { horizontal: "left", vertical: "top" },
                        useLayerForClickAway: false
                    },
                    _react2['default'].createElement(
                        Paper,
                        { zDepth: 2, style: { width: 200, height: 'auto', overflowY: 'auto' }, onMouseOver: onMouseOverInner, onMouseOut: onMouseOut },
                        _react2['default'].createElement(DocPreview, { pydio: pydio, activity: activity })
                    )
                );
            } else if (nodes.length === 1) {
                onClick = function () {
                    pydio.goTo(nodes[0]);
                };
            }

            return _react2['default'].createElement(
                'span',
                null,
                _react2['default'].createElement(
                    'a',
                    { title: title, style: { cursor: 'pointer', color: 'rgb(66, 140, 179)' },
                        onMouseOver: onMouseOver,
                        onMouseOut: onMouseOut,
                        onClick: onClick },
                    children
                ),
                popover
            );
        }
    }]);

    return DocLink;
})(_react2['default'].Component);

DocLink.PropTypes = {
    activity: _react2['default'].PropTypes.object,
    pydio: _react2['default'].PropTypes.instanceOf(Pydio)
};

exports['default'] = DocLink = PydioContextConsumer(DocLink);
exports['default'] = DocLink;
module.exports = exports['default'];

},{"lodash.debounce":"lodash.debounce","material-ui":"material-ui","pydio":"pydio","pydio/model/meta-node-provider":"pydio/model/meta-node-provider","react":"react"}],6:[function(require,module,exports){
/*
 * Copyright 2007-2017 Charles du Jeu - Abstrium SAS <team (at) pyd.io>
 * This file is part of Pydio.
 *
 * Pydio is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * Pydio is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with Pydio.  If not, see <http://www.gnu.org/licenses/>.
 *
 * The latest code can be found at <https://pydio.com>.
 */
'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _materialUi = require('material-ui');

var _ActivityList = require('./ActivityList');

var _ActivityList2 = _interopRequireDefault(_ActivityList);

var _Pydio$requireLib = Pydio.requireLib('boot');

var PydioContextConsumer = _Pydio$requireLib.PydioContextConsumer;

var _Pydio$requireLib2 = Pydio.requireLib('workspaces');

var InfoPanelCard = _Pydio$requireLib2.InfoPanelCard;

var InfoPanel = (function (_React$Component) {
    _inherits(InfoPanel, _React$Component);

    function InfoPanel() {
        _classCallCheck(this, InfoPanel);

        _get(Object.getPrototypeOf(InfoPanel.prototype), 'constructor', this).apply(this, arguments);
    }

    _createClass(InfoPanel, [{
        key: 'render',
        value: function render() {
            var _props = this.props;
            var node = _props.node;
            var pydio = _props.pydio;

            if (pydio.getPluginConfigs("core.activitystreams").get("ACTIVITY_SHOW_ACTIVITIES") === false) {
                return null;
            }

            return _react2['default'].createElement(
                InfoPanelCard,
                { identifier: "activity", title: node.isLeaf() ? pydio.MessageHash['notification_center.11'] : pydio.MessageHash['notification_center.10'] },
                _react2['default'].createElement(_ActivityList2['default'], {
                    context: 'NODE_ID',
                    contextData: node.getMetadata().get('uuid'),
                    boxName: 'outbox',
                    style: { overflowY: 'scroll', maxHeight: 380 },
                    listContext: "NODE-" + (node.isLeaf() ? "LEAF" : "COLLECTION"),
                    pointOfView: "ACTOR",
                    displayContext: 'infoPanel'
                })
            );
        }
    }]);

    return InfoPanel;
})(_react2['default'].Component);

exports['default'] = InfoPanel = PydioContextConsumer(InfoPanel);
exports['default'] = InfoPanel;
module.exports = exports['default'];

},{"./ActivityList":2,"material-ui":"material-ui","react":"react"}],7:[function(require,module,exports){
(function (global){
/*
 * Copyright 2007-2018 Charles du Jeu - Abstrium SAS <team (at) pyd.io>
 * This file is part of Pydio.
 *
 * Pydio is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * Pydio is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with Pydio.  If not, see <http://www.gnu.org/licenses/>.
 *
 * The latest code can be found at <https://pydio.com>.
 */
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Listeners = (function () {
    function Listeners() {
        _classCallCheck(this, Listeners);
    }

    _createClass(Listeners, null, [{
        key: "dynamicBuilder",
        value: function dynamicBuilder(controller) {
            var pydio = global.pydio;
            var MessageHash = pydio.MessageHash;

            var n = pydio.getUserSelection().getUniqueNode();
            if (!n) {
                return [];
            }

            var builderMenuItems = [];
            var metaValue = undefined;
            if (n.getMetadata().get("meta_watched")) {
                metaValue = n.getMetadata().get("meta_watched");
            }
            builderMenuItems.push({
                name: MessageHash["meta.watch.11"],
                alt: MessageHash["meta.watch." + (n.isLeaf() ? "12" : "12b")],
                icon_class: metaValue && metaValue === "META_WATCH_CHANGE" ? 'mdi mdi-checkbox-marked-circle-outline' : 'mdi mdi-checkbox-blank-circle-outline',
                callback: (function (e) {
                    this.apply('watch_change');
                }).bind(this)
            });
            builderMenuItems.push({
                name: MessageHash["meta.watch.9"],
                alt: MessageHash["meta.watch." + (n.isLeaf() ? "10" : "10b")],
                icon_class: metaValue && metaValue === "META_WATCH_READ" ? 'mdi mdi-checkbox-marked-circle-outline' : 'mdi mdi-checkbox-blank-circle-outline',
                callback: (function (e) {
                    this.apply('watch_read');
                }).bind(this)
            });
            builderMenuItems.push({
                name: MessageHash["meta.watch.13"],
                alt: MessageHash["meta.watch." + (n.isLeaf() ? "14" : "14b")],
                icon_class: metaValue && metaValue === "META_WATCH_BOTH" ? 'mdi mdi-checkbox-marked-circle-outline' : 'mdi mdi-checkbox-blank-circle-outline',
                callback: (function (e) {
                    this.apply('watch_both');
                }).bind(this)
            });
            if (metaValue) {
                builderMenuItems.push({
                    separator: true
                });
                builderMenuItems.push({
                    name: MessageHash['meta.watch.3'],
                    alt: MessageHash["meta.watch." + (n.isLeaf() ? "8" : "4")],
                    icon_class: 'mdi mdi-close-circle-outline',
                    callback: (function (e) {
                        this.apply('watch_stop');
                    }).bind(this)
                });
            }

            return builderMenuItems;
        }
    }]);

    return Listeners;
})();

exports["default"] = Listeners;
module.exports = exports["default"];

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{}],8:[function(require,module,exports){
/*
 * Copyright 2007-2019 Charles du Jeu - Abstrium SAS <team (at) pyd.io>
 * This file is part of Pydio.
 *
 * Pydio is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * Pydio is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with Pydio.  If not, see <http://www.gnu.org/licenses/>.
 *
 * The latest code can be found at <https://pydio.com>.
 */
'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _materialUi = require('material-ui');

var _materialUiStyles = require('material-ui/styles');

var _Client = require('./Client');

var _Client2 = _interopRequireDefault(_Client);

var _ActivityList = require('./ActivityList');

var _ActivityList2 = _interopRequireDefault(_ActivityList);

var _lodashDebounce = require('lodash.debounce');

var _lodashDebounce2 = _interopRequireDefault(_lodashDebounce);

var _color = require('color');

var _color2 = _interopRequireDefault(_color);

var UserPanel = (function (_React$Component) {
    _inherits(UserPanel, _React$Component);

    function UserPanel(props) {
        _classCallCheck(this, UserPanel);

        _get(Object.getPrototypeOf(UserPanel.prototype), 'constructor', this).call(this, props);
        this.state = {
            unreadStatus: 0,
            open: false,
            data: []
        };
        this.reloadData = (0, _lodashDebounce2['default'])(this.reloadData.bind(this), 500);
        this.reloadUnread = (0, _lodashDebounce2['default'])(this.reloadUnread.bind(this), 500);
    }

    _createClass(UserPanel, [{
        key: 'reloadData',
        value: function reloadData() {
            var _this = this;

            _Client2['default'].loadActivityStreams('USER_ID', this.props.pydio.user.id, 'inbox').then(function (json) {
                _this.setState({ data: json });
            })['catch'](function (msg) {
                _this.setState({ error: msg });
            });
        }
    }, {
        key: 'reloadUnread',
        value: function reloadUnread() {
            var _this2 = this;

            _Client2['default'].UnreadInbox(this.props.pydio.user.id).then(function (count) {
                _this2.setState({ unreadStatus: count });
            })['catch'](function (msg) {});
        }
    }, {
        key: 'onStatusChange',
        value: function onStatusChange() {
            if (this.props.onUnreadStatusChange) {
                this.props.onUnreadStatusChange(this.state.unreadStatus);
            }
        }
    }, {
        key: 'handleTouchTap',
        value: function handleTouchTap(event) {
            // This prevents ghost click.
            event.preventDefault();
            //if(this.state.unreadStatus){
            //this.updateAlertsLastRead();
            //}
            this.reloadData();
            this.setState({
                open: true,
                anchorEl: event.currentTarget,
                unreadStatus: 0
            }, this.onStatusChange.bind(this));
        }
    }, {
        key: 'handleRequestClose',
        value: function handleRequestClose() {
            this.setState({
                open: false
            });
        }
    }, {
        key: 'componentWillMount',
        value: function componentWillMount() {
            var _this3 = this;

            this.reloadUnread();
            this.props.pydio.observe('websocket_event:activity', function (event) {
                if (_this3.state.open) {
                    _this3.reloadData();
                } else {
                    _this3.reloadUnread();
                }
            });
        }
    }, {
        key: 'render',
        value: function render() {
            var _props = this.props;
            var pydio = _props.pydio;
            var iconStyle = _props.iconStyle;
            var muiTheme = _props.muiTheme;
            var _state = this.state;
            var open = _state.open;
            var anchorEl = _state.anchorEl;
            var unreadStatus = _state.unreadStatus;

            var buttonStyle = { borderRadius: '50%' };
            if (open && iconStyle && iconStyle.color) {
                buttonStyle = _extends({}, buttonStyle, { backgroundColor: (0, _color2['default'])(iconStyle.color).fade(0.9).toString() });
            }
            return _react2['default'].createElement(
                'span',
                null,
                _react2['default'].createElement(
                    'div',
                    {
                        style: { position: 'relative', display: 'inline-block' },

                        badgeContent: this.state.unreadStatus,
                        secondary: true,
                        badgeStyle: this.state.unreadStatus ? null : { display: 'none' }
                    },
                    _react2['default'].createElement(_materialUi.IconButton, {
                        onTouchTap: this.handleTouchTap.bind(this),
                        iconClassName: this.props.iconClassName || "icon-bell",
                        tooltip: (unreadStatus ? unreadStatus + ' ' : '') + this.props.pydio.MessageHash['notification_center.4'],
                        className: 'userActionButton alertsButton',
                        iconStyle: iconStyle,
                        style: buttonStyle
                    }),
                    unreadStatus > 0 && _react2['default'].createElement('div', { style: { width: 6, height: 6, borderRadius: '50%', top: 9, right: 6, position: 'absolute', backgroundColor: muiTheme.palette.accent1Color } })
                ),
                _react2['default'].createElement(
                    _materialUi.Popover,
                    {
                        open: open,
                        anchorEl: anchorEl,
                        anchorOrigin: { horizontal: 'left', vertical: 'bottom' },
                        targetOrigin: { horizontal: 'left', vertical: 'top' },
                        onRequestClose: this.handleRequestClose.bind(this),
                        style: { width: 320 },
                        zDepth: 2

                    },
                    _react2['default'].createElement(
                        'div',
                        { style: { display: 'flex', alignItems: 'center', borderRadius: '2px 2px 0 0', padding: '12px 16px', width: '100%',
                                backgroundColor: 'rgb(238, 238, 238)', borderBottom: '1px solid rgb(224, 224, 224)' } },
                        pydio.MessageHash['notification_center.1']
                    ),
                    this.state.data && _react2['default'].createElement(_ActivityList2['default'], {
                        items: this.state.data.items,
                        style: { overflowY: 'scroll', maxHeight: 330, paddingTop: 20 },
                        groupByDate: true,
                        displayContext: "popover"
                    })
                )
            );
        }
    }]);

    return UserPanel;
})(_react2['default'].Component);

exports['default'] = UserPanel = (0, _materialUiStyles.muiThemeable)()(UserPanel);

exports['default'] = UserPanel;
module.exports = exports['default'];

},{"./ActivityList":2,"./Client":4,"color":"color","lodash.debounce":"lodash.debounce","material-ui":"material-ui","material-ui/styles":"material-ui/styles","react":"react"}],9:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x2, _x3, _x4) { var _again = true; _function: while (_again) { var object = _x2, property = _x3, receiver = _x4; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x2 = parent; _x3 = property; _x4 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _pydio = require('pydio');

var _pydio2 = _interopRequireDefault(_pydio);

var _materialUi = require('material-ui');

var _pydioHttpApi = require('pydio/http/api');

var _pydioHttpApi2 = _interopRequireDefault(_pydioHttpApi);

var _pydioHttpRestApi = require('pydio/http/rest-api');

var _Pydio$requireLib = _pydio2['default'].requireLib('hoc');

var ModernSelectField = _Pydio$requireLib.ModernSelectField;

var WatchSelector = (function (_React$Component) {
    _inherits(WatchSelector, _React$Component);

    function WatchSelector(props) {
        _classCallCheck(this, WatchSelector);

        _get(Object.getPrototypeOf(WatchSelector.prototype), 'constructor', this).call(this, props);
        var nodes = this.props.nodes;

        this.state = this.valueFromNodes(nodes);
    }

    _createClass(WatchSelector, [{
        key: 'valueFromNodes',
        value: function valueFromNodes() {
            var nodes = arguments.length <= 0 || arguments[0] === undefined ? [] : arguments[0];

            var mixed = false,
                value = undefined;
            nodes.forEach(function (n) {
                var nVal = n.getMetadata().get('meta_watched') || '';
                if (value !== undefined && nVal !== value) {
                    mixed = true;
                }
                value = nVal;
            });
            return { value: value, mixed: mixed };
        }
    }, {
        key: 'onSelectorChange',
        value: function onSelectorChange(value) {
            var _this = this;

            if (value === 'mixed') {
                return;
            }

            var _props = this.props;
            var pydio = _props.pydio;
            var nodes = _props.nodes;

            this.setState({ saving: true });

            var proms = nodes.map(function (node) {
                var nodeUuid = node.getMetadata().get('uuid');
                var userId = pydio.user.id;
                var subscription = new _pydioHttpRestApi.ActivitySubscription();
                var type = new _pydioHttpRestApi.ActivityOwnerType();
                subscription.UserId = userId;
                subscription.ObjectId = nodeUuid;
                subscription.ObjectType = type.NODE;
                var events = [];
                if (value === 'META_WATCH_CHANGE' || value === 'META_WATCH_BOTH') {
                    events.push('change');
                }
                if (value === 'META_WATCH_READ' || value === 'META_WATCH_BOTH') {
                    events.push('read');
                }
                subscription.Events = events;
                var api = new _pydioHttpRestApi.ActivityServiceApi(_pydioHttpApi2['default'].getRestClient());
                return api.subscribe(subscription).then(function (outSub) {
                    var overlay = node.getMetadata().get('overlay_class') || '';
                    if (value === '') {
                        node.getMetadata()['delete']('meta_watched');
                        node.getMetadata().set('overlay_class', overlay.replace('mdi mdi-bell', ''));
                    } else {
                        node.getMetadata().set('meta_watched', value);
                        var overlays = overlay.replace('mdi mdi-bell', '').split(',');
                        overlays.push('mdi mdi-bell');
                        node.getMetadata().set('overlay_class', overlays.join(','));
                    }
                    node.notify('node_replaced');
                });
            });
            Promise.all(proms).then(function () {
                _this.setState({ value: value, mixed: false });
                window.setTimeout(function () {
                    _this.setState({ saving: false });
                }, 250);
            })['catch'](function () {
                _this.setState({ saving: false });
            });
        }
    }, {
        key: 'render',
        value: function render() {
            var _this2 = this;

            var _state = this.state;
            var value = _state.value;
            var mixed = _state.mixed;
            var saving = _state.saving;

            if (saving) {
                return _react2['default'].createElement(
                    ModernSelectField,
                    { value: "saving", onChange: function (e, i, v) {}, disabled: true },
                    _react2['default'].createElement(_materialUi.MenuItem, { value: "saving", primaryText: "Saving status..." })
                );
            }

            return _react2['default'].createElement(
                ModernSelectField,
                { value: mixed ? 'mixed' : value, onChange: function (e, i, v) {
                        _this2.onSelectorChange(v);
                    } },
                mixed && _react2['default'].createElement(_materialUi.MenuItem, { value: "mixed", primaryText: "Mixed values..." }),
                _react2['default'].createElement(_materialUi.MenuItem, { value: "", primaryText: "Ignore" }),
                _react2['default'].createElement(_materialUi.MenuItem, { value: "META_WATCH_READ", primaryText: "On consultation" }),
                _react2['default'].createElement(_materialUi.MenuItem, { value: "META_WATCH_CHANGE", primaryText: "On modification" }),
                _react2['default'].createElement(_materialUi.MenuItem, { value: "META_WATCH_BOTH", primaryText: "On consultation or modification" })
            );
        }
    }]);

    return WatchSelector;
})(_react2['default'].Component);

exports['default'] = WatchSelector;
module.exports = exports['default'];

},{"material-ui":"material-ui","pydio":"pydio","pydio/http/api":"pydio/http/api","pydio/http/rest-api":"pydio/http/rest-api","react":"react"}],10:[function(require,module,exports){
/*
 * Copyright 2007-2017 Charles du Jeu - Abstrium SAS <team (at) pyd.io>
 * This file is part of Pydio.
 *
 * Pydio is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * Pydio is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with Pydio.  If not, see <http://www.gnu.org/licenses/>.
 *
 * The latest code can be found at <https://pydio.com>.
 */

"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

function _interopRequire(obj) { return obj && obj.__esModule ? obj["default"] : obj; }

var _InfoPanel = require("./InfoPanel");

exports.InfoPanel = _interopRequire(_InfoPanel);

var _UserPanel = require("./UserPanel");

exports.UserPanel = _interopRequire(_UserPanel);

var _Client = require("./Client");

exports.ASClient = _interopRequire(_Client);

var _Activity = require("./Activity");

exports.Activity = _interopRequire(_Activity);

var _ActivityList = require("./ActivityList");

exports.ActivityList = _interopRequire(_ActivityList);

var _Listener = require('./Listener');

exports.Listener = _interopRequire(_Listener);

var _Callbacks = require('./Callbacks');

exports.Callbacks = _interopRequire(_Callbacks);

var _WatchSelector = require('./WatchSelector');

exports.WatchSelector = _interopRequire(_WatchSelector);

},{"./Activity":1,"./ActivityList":2,"./Callbacks":3,"./Client":4,"./InfoPanel":6,"./Listener":7,"./UserPanel":8,"./WatchSelector":9}]},{},[10])(10)
});

//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJyZXMvYnVpbGQvUHlkaW9BY3Rpdml0eVN0cmVhbXMvQWN0aXZpdHkuanMiLCJyZXMvYnVpbGQvUHlkaW9BY3Rpdml0eVN0cmVhbXMvQWN0aXZpdHlMaXN0LmpzIiwicmVzL2J1aWxkL1B5ZGlvQWN0aXZpdHlTdHJlYW1zL0NhbGxiYWNrcy5qcyIsInJlcy9idWlsZC9QeWRpb0FjdGl2aXR5U3RyZWFtcy9DbGllbnQuanMiLCJyZXMvYnVpbGQvUHlkaW9BY3Rpdml0eVN0cmVhbXMvRG9jTGluay5qcyIsInJlcy9idWlsZC9QeWRpb0FjdGl2aXR5U3RyZWFtcy9JbmZvUGFuZWwuanMiLCJyZXMvYnVpbGQvUHlkaW9BY3Rpdml0eVN0cmVhbXMvTGlzdGVuZXIuanMiLCJyZXMvYnVpbGQvUHlkaW9BY3Rpdml0eVN0cmVhbXMvVXNlclBhbmVsLmpzIiwicmVzL2J1aWxkL1B5ZGlvQWN0aXZpdHlTdHJlYW1zL1dhdGNoU2VsZWN0b3IuanMiLCJyZXMvYnVpbGQvUHlkaW9BY3Rpdml0eVN0cmVhbXMvaW5kZXguanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdldBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqUUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3pGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNuR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDN1VBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FDL0ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7QUNqR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN0TkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDNUpBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCIvKlxuICogQ29weXJpZ2h0IDIwMDctMjAxNyBDaGFybGVzIGR1IEpldSAtIEFic3RyaXVtIFNBUyA8dGVhbSAoYXQpIHB5ZC5pbz5cbiAqIFRoaXMgZmlsZSBpcyBwYXJ0IG9mIFB5ZGlvLlxuICpcbiAqIFB5ZGlvIGlzIGZyZWUgc29mdHdhcmU6IHlvdSBjYW4gcmVkaXN0cmlidXRlIGl0IGFuZC9vciBtb2RpZnlcbiAqIGl0IHVuZGVyIHRoZSB0ZXJtcyBvZiB0aGUgR05VIEFmZmVybyBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlIGFzIHB1Ymxpc2hlZCBieVxuICogdGhlIEZyZWUgU29mdHdhcmUgRm91bmRhdGlvbiwgZWl0aGVyIHZlcnNpb24gMyBvZiB0aGUgTGljZW5zZSwgb3JcbiAqIChhdCB5b3VyIG9wdGlvbikgYW55IGxhdGVyIHZlcnNpb24uXG4gKlxuICogUHlkaW8gaXMgZGlzdHJpYnV0ZWQgaW4gdGhlIGhvcGUgdGhhdCBpdCB3aWxsIGJlIHVzZWZ1bCxcbiAqIGJ1dCBXSVRIT1VUIEFOWSBXQVJSQU5UWTsgd2l0aG91dCBldmVuIHRoZSBpbXBsaWVkIHdhcnJhbnR5IG9mXG4gKiBNRVJDSEFOVEFCSUxJVFkgb3IgRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UuICBTZWUgdGhlXG4gKiBHTlUgQWZmZXJvIEdlbmVyYWwgUHVibGljIExpY2Vuc2UgZm9yIG1vcmUgZGV0YWlscy5cbiAqXG4gKiBZb3Ugc2hvdWxkIGhhdmUgcmVjZWl2ZWQgYSBjb3B5IG9mIHRoZSBHTlUgQWZmZXJvIEdlbmVyYWwgUHVibGljIExpY2Vuc2VcbiAqIGFsb25nIHdpdGggUHlkaW8uICBJZiBub3QsIHNlZSA8aHR0cDovL3d3dy5nbnUub3JnL2xpY2Vuc2VzLz4uXG4gKlxuICogVGhlIGxhdGVzdCBjb2RlIGNhbiBiZSBmb3VuZCBhdCA8aHR0cHM6Ly9weWRpby5jb20+LlxuICovXG5cbid1c2Ugc3RyaWN0JztcblxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywge1xuICAgIHZhbHVlOiB0cnVlXG59KTtcblxudmFyIF9leHRlbmRzID0gT2JqZWN0LmFzc2lnbiB8fCBmdW5jdGlvbiAodGFyZ2V0KSB7IGZvciAodmFyIGkgPSAxOyBpIDwgYXJndW1lbnRzLmxlbmd0aDsgaSsrKSB7IHZhciBzb3VyY2UgPSBhcmd1bWVudHNbaV07IGZvciAodmFyIGtleSBpbiBzb3VyY2UpIHsgaWYgKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChzb3VyY2UsIGtleSkpIHsgdGFyZ2V0W2tleV0gPSBzb3VyY2Vba2V5XTsgfSB9IH0gcmV0dXJuIHRhcmdldDsgfTtcblxudmFyIF9jcmVhdGVDbGFzcyA9IChmdW5jdGlvbiAoKSB7IGZ1bmN0aW9uIGRlZmluZVByb3BlcnRpZXModGFyZ2V0LCBwcm9wcykgeyBmb3IgKHZhciBpID0gMDsgaSA8IHByb3BzLmxlbmd0aDsgaSsrKSB7IHZhciBkZXNjcmlwdG9yID0gcHJvcHNbaV07IGRlc2NyaXB0b3IuZW51bWVyYWJsZSA9IGRlc2NyaXB0b3IuZW51bWVyYWJsZSB8fCBmYWxzZTsgZGVzY3JpcHRvci5jb25maWd1cmFibGUgPSB0cnVlOyBpZiAoJ3ZhbHVlJyBpbiBkZXNjcmlwdG9yKSBkZXNjcmlwdG9yLndyaXRhYmxlID0gdHJ1ZTsgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRhcmdldCwgZGVzY3JpcHRvci5rZXksIGRlc2NyaXB0b3IpOyB9IH0gcmV0dXJuIGZ1bmN0aW9uIChDb25zdHJ1Y3RvciwgcHJvdG9Qcm9wcywgc3RhdGljUHJvcHMpIHsgaWYgKHByb3RvUHJvcHMpIGRlZmluZVByb3BlcnRpZXMoQ29uc3RydWN0b3IucHJvdG90eXBlLCBwcm90b1Byb3BzKTsgaWYgKHN0YXRpY1Byb3BzKSBkZWZpbmVQcm9wZXJ0aWVzKENvbnN0cnVjdG9yLCBzdGF0aWNQcm9wcyk7IHJldHVybiBDb25zdHJ1Y3RvcjsgfTsgfSkoKTtcblxudmFyIF9nZXQgPSBmdW5jdGlvbiBnZXQoX3gsIF94MiwgX3gzKSB7IHZhciBfYWdhaW4gPSB0cnVlOyBfZnVuY3Rpb246IHdoaWxlIChfYWdhaW4pIHsgdmFyIG9iamVjdCA9IF94LCBwcm9wZXJ0eSA9IF94MiwgcmVjZWl2ZXIgPSBfeDM7IF9hZ2FpbiA9IGZhbHNlOyBpZiAob2JqZWN0ID09PSBudWxsKSBvYmplY3QgPSBGdW5jdGlvbi5wcm90b3R5cGU7IHZhciBkZXNjID0gT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcihvYmplY3QsIHByb3BlcnR5KTsgaWYgKGRlc2MgPT09IHVuZGVmaW5lZCkgeyB2YXIgcGFyZW50ID0gT2JqZWN0LmdldFByb3RvdHlwZU9mKG9iamVjdCk7IGlmIChwYXJlbnQgPT09IG51bGwpIHsgcmV0dXJuIHVuZGVmaW5lZDsgfSBlbHNlIHsgX3ggPSBwYXJlbnQ7IF94MiA9IHByb3BlcnR5OyBfeDMgPSByZWNlaXZlcjsgX2FnYWluID0gdHJ1ZTsgZGVzYyA9IHBhcmVudCA9IHVuZGVmaW5lZDsgY29udGludWUgX2Z1bmN0aW9uOyB9IH0gZWxzZSBpZiAoJ3ZhbHVlJyBpbiBkZXNjKSB7IHJldHVybiBkZXNjLnZhbHVlOyB9IGVsc2UgeyB2YXIgZ2V0dGVyID0gZGVzYy5nZXQ7IGlmIChnZXR0ZXIgPT09IHVuZGVmaW5lZCkgeyByZXR1cm4gdW5kZWZpbmVkOyB9IHJldHVybiBnZXR0ZXIuY2FsbChyZWNlaXZlcik7IH0gfSB9O1xuXG5mdW5jdGlvbiBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KG9iaikgeyByZXR1cm4gb2JqICYmIG9iai5fX2VzTW9kdWxlID8gb2JqIDogeyAnZGVmYXVsdCc6IG9iaiB9OyB9XG5cbmZ1bmN0aW9uIF9jbGFzc0NhbGxDaGVjayhpbnN0YW5jZSwgQ29uc3RydWN0b3IpIHsgaWYgKCEoaW5zdGFuY2UgaW5zdGFuY2VvZiBDb25zdHJ1Y3RvcikpIHsgdGhyb3cgbmV3IFR5cGVFcnJvcignQ2Fubm90IGNhbGwgYSBjbGFzcyBhcyBhIGZ1bmN0aW9uJyk7IH0gfVxuXG5mdW5jdGlvbiBfaW5oZXJpdHMoc3ViQ2xhc3MsIHN1cGVyQ2xhc3MpIHsgaWYgKHR5cGVvZiBzdXBlckNsYXNzICE9PSAnZnVuY3Rpb24nICYmIHN1cGVyQ2xhc3MgIT09IG51bGwpIHsgdGhyb3cgbmV3IFR5cGVFcnJvcignU3VwZXIgZXhwcmVzc2lvbiBtdXN0IGVpdGhlciBiZSBudWxsIG9yIGEgZnVuY3Rpb24sIG5vdCAnICsgdHlwZW9mIHN1cGVyQ2xhc3MpOyB9IHN1YkNsYXNzLnByb3RvdHlwZSA9IE9iamVjdC5jcmVhdGUoc3VwZXJDbGFzcyAmJiBzdXBlckNsYXNzLnByb3RvdHlwZSwgeyBjb25zdHJ1Y3RvcjogeyB2YWx1ZTogc3ViQ2xhc3MsIGVudW1lcmFibGU6IGZhbHNlLCB3cml0YWJsZTogdHJ1ZSwgY29uZmlndXJhYmxlOiB0cnVlIH0gfSk7IGlmIChzdXBlckNsYXNzKSBPYmplY3Quc2V0UHJvdG90eXBlT2YgPyBPYmplY3Quc2V0UHJvdG90eXBlT2Yoc3ViQ2xhc3MsIHN1cGVyQ2xhc3MpIDogc3ViQ2xhc3MuX19wcm90b19fID0gc3VwZXJDbGFzczsgfVxuXG52YXIgX3JlYWN0ID0gcmVxdWlyZSgncmVhY3QnKTtcblxudmFyIF9yZWFjdDIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9yZWFjdCk7XG5cbnZhciBfcmVhY3RNYXJrZG93biA9IHJlcXVpcmUoJ3JlYWN0LW1hcmtkb3duJyk7XG5cbnZhciBfcmVhY3RNYXJrZG93bjIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9yZWFjdE1hcmtkb3duKTtcblxudmFyIF9tYXRlcmlhbFVpID0gcmVxdWlyZSgnbWF0ZXJpYWwtdWknKTtcblxudmFyIF9Eb2NMaW5rID0gcmVxdWlyZSgnLi9Eb2NMaW5rJyk7XG5cbnZhciBfRG9jTGluazIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9Eb2NMaW5rKTtcblxudmFyIF9yZXF1aXJlJHJlcXVpcmVMaWIgPSByZXF1aXJlKCdweWRpbycpLnJlcXVpcmVMaWIoJ2NvbXBvbmVudHMnKTtcblxudmFyIFVzZXJBdmF0YXIgPSBfcmVxdWlyZSRyZXF1aXJlTGliLlVzZXJBdmF0YXI7XG5cbnZhciBfcmVxdWlyZSRyZXF1aXJlTGliMiA9IHJlcXVpcmUoJ3B5ZGlvJykucmVxdWlyZUxpYignYm9vdCcpO1xuXG52YXIgUHlkaW9Db250ZXh0Q29uc3VtZXIgPSBfcmVxdWlyZSRyZXF1aXJlTGliMi5QeWRpb0NvbnRleHRDb25zdW1lcjtcblxudmFyIF9QeWRpbyRyZXF1aXJlTGliID0gUHlkaW8ucmVxdWlyZUxpYignYm9vdCcpO1xuXG52YXIgbW9tZW50ID0gX1B5ZGlvJHJlcXVpcmVMaWIubW9tZW50O1xuXG52YXIgUGFyYWdyYXBoID0gKGZ1bmN0aW9uIChfUmVhY3QkQ29tcG9uZW50KSB7XG4gICAgX2luaGVyaXRzKFBhcmFncmFwaCwgX1JlYWN0JENvbXBvbmVudCk7XG5cbiAgICBmdW5jdGlvbiBQYXJhZ3JhcGgoKSB7XG4gICAgICAgIF9jbGFzc0NhbGxDaGVjayh0aGlzLCBQYXJhZ3JhcGgpO1xuXG4gICAgICAgIF9nZXQoT2JqZWN0LmdldFByb3RvdHlwZU9mKFBhcmFncmFwaC5wcm90b3R5cGUpLCAnY29uc3RydWN0b3InLCB0aGlzKS5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgIH1cblxuICAgIF9jcmVhdGVDbGFzcyhQYXJhZ3JhcGgsIFt7XG4gICAgICAgIGtleTogJ3JlbmRlcicsXG4gICAgICAgIHZhbHVlOiBmdW5jdGlvbiByZW5kZXIoKSB7XG4gICAgICAgICAgICByZXR1cm4gX3JlYWN0MlsnZGVmYXVsdCddLmNyZWF0ZUVsZW1lbnQoXG4gICAgICAgICAgICAgICAgJ3NwYW4nLFxuICAgICAgICAgICAgICAgIG51bGwsXG4gICAgICAgICAgICAgICAgdGhpcy5wcm9wcy5jaGlsZHJlblxuICAgICAgICAgICAgKTtcbiAgICAgICAgfVxuICAgIH1dKTtcblxuICAgIHJldHVybiBQYXJhZ3JhcGg7XG59KShfcmVhY3QyWydkZWZhdWx0J10uQ29tcG9uZW50KTtcblxuZnVuY3Rpb24gd29ya3NwYWNlc0xvY2F0aW9ucyhweWRpbywgb2JqZWN0KSB7XG4gICAgdmFyIHdvcmtzcGFjZXMgPSBbXTtcbiAgICBpZiAoIW9iamVjdC5wYXJ0T2YgfHwgIW9iamVjdC5wYXJ0T2YuaXRlbXMgfHwgIW9iamVjdC5wYXJ0T2YuaXRlbXMubGVuZ3RoKSB7XG4gICAgICAgIHJldHVybiBcIk5vIHdvcmtzcGFjZSBmb3VuZFwiO1xuICAgIH1cblxuICAgIHZhciBfbG9vcCA9IGZ1bmN0aW9uIChpKSB7XG4gICAgICAgIHZhciB3cyA9IG9iamVjdC5wYXJ0T2YuaXRlbXNbaV07XG4gICAgICAgIC8vIFJlbW92ZSBzbHVnIHBhcnRcbiAgICAgICAgLy9sZXQgcGF0aHMgPSB3cy5yZWwuc3BsaXQoJy8nKTtcbiAgICAgICAgLy9wYXRocy5zaGlmdCgpO1xuICAgICAgICAvL2xldCByZWxQYXRoID0gcGF0aHMuam9pbignLycpO1xuICAgICAgICB3b3Jrc3BhY2VzLnB1c2goX3JlYWN0MlsnZGVmYXVsdCddLmNyZWF0ZUVsZW1lbnQoXG4gICAgICAgICAgICAnYScsXG4gICAgICAgICAgICB7IGtleTogd3MuaWQsIG9uQ2xpY2s6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHB5ZGlvLnRyaWdnZXJSZXBvc2l0b3J5Q2hhbmdlKHdzLmlkKTtcbiAgICAgICAgICAgICAgICB9LCBzdHlsZTogeyBjdXJzb3I6ICdwb2ludGVyJyB9IH0sXG4gICAgICAgICAgICB3cy5uYW1lXG4gICAgICAgICkpO1xuICAgICAgICB3b3Jrc3BhY2VzLnB1c2goX3JlYWN0MlsnZGVmYXVsdCddLmNyZWF0ZUVsZW1lbnQoXG4gICAgICAgICAgICAnc3BhbicsXG4gICAgICAgICAgICB7IGtleTogd3MuaWQgKyAnLXNlcCcgfSxcbiAgICAgICAgICAgICcsICdcbiAgICAgICAgKSk7XG4gICAgfTtcblxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgb2JqZWN0LnBhcnRPZi5pdGVtcy5sZW5ndGg7IGkrKykge1xuICAgICAgICBfbG9vcChpKTtcbiAgICB9XG4gICAgd29ya3NwYWNlcy5wb3AoKTtcbiAgICByZXR1cm4gX3JlYWN0MlsnZGVmYXVsdCddLmNyZWF0ZUVsZW1lbnQoXG4gICAgICAgICdzcGFuJyxcbiAgICAgICAgbnVsbCxcbiAgICAgICAgcHlkaW8uTWVzc2FnZUhhc2hbJ25vdGlmaWNhdGlvbl9jZW50ZXIuMTYnXSxcbiAgICAgICAgJyAnLFxuICAgICAgICBfcmVhY3QyWydkZWZhdWx0J10uY3JlYXRlRWxlbWVudChcbiAgICAgICAgICAgICdzcGFuJyxcbiAgICAgICAgICAgIG51bGwsXG4gICAgICAgICAgICB3b3Jrc3BhY2VzXG4gICAgICAgIClcbiAgICApO1xufVxuXG5mdW5jdGlvbiBMaW5rV3JhcHBlcihweWRpbywgYWN0aXZpdHkpIHtcblxuICAgIHJldHVybiBfcmVhY3QyWydkZWZhdWx0J10uY3JlYXRlQ2xhc3Moe1xuXG4gICAgICAgIHJlbmRlcjogZnVuY3Rpb24gcmVuZGVyKCkge1xuICAgICAgICAgICAgdmFyIF9wcm9wcyA9IHRoaXMucHJvcHM7XG4gICAgICAgICAgICB2YXIgaHJlZiA9IF9wcm9wcy5ocmVmO1xuICAgICAgICAgICAgdmFyIGNoaWxkcmVuID0gX3Byb3BzLmNoaWxkcmVuO1xuXG4gICAgICAgICAgICB2YXIgdGl0bGUgPSBcIlwiO1xuICAgICAgICAgICAgdmFyIG9uQ2xpY2sgPSBudWxsO1xuICAgICAgICAgICAgaWYgKGhyZWYuc3RhcnRzV2l0aCgnZG9jOi8vJykpIHtcbiAgICAgICAgICAgICAgICBpZiAoYWN0aXZpdHkudHlwZSA9PT0gJ0RlbGV0ZScpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIF9yZWFjdDJbJ2RlZmF1bHQnXS5jcmVhdGVFbGVtZW50KFxuICAgICAgICAgICAgICAgICAgICAgICAgJ2EnLFxuICAgICAgICAgICAgICAgICAgICAgICAgeyBzdHlsZTogeyB0ZXh0RGVjb3JhdGlvbjogJ2xpbmUtdGhyb3VnaCcgfSB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgY2hpbGRyZW5cbiAgICAgICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gX3JlYWN0MlsnZGVmYXVsdCddLmNyZWF0ZUVsZW1lbnQoXG4gICAgICAgICAgICAgICAgICAgICAgICBfRG9jTGluazJbJ2RlZmF1bHQnXSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHsgcHlkaW86IHB5ZGlvLCBhY3Rpdml0eTogYWN0aXZpdHkgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGNoaWxkcmVuXG4gICAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIGlmIChocmVmLnN0YXJ0c1dpdGgoJ3VzZXI6Ly8nKSkge1xuICAgICAgICAgICAgICAgIHZhciB1c2VySWQgPSBocmVmLnJlcGxhY2UoJ3VzZXI6Ly8nLCAnJyk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIF9yZWFjdDJbJ2RlZmF1bHQnXS5jcmVhdGVFbGVtZW50KFVzZXJBdmF0YXIsIHsgdXNlcklkOiB1c2VySWQsIGRpc3BsYXlBdmF0YXI6IGZhbHNlLCByaWNoT25DbGljazogdHJ1ZSwgc3R5bGU6IHsgY3Vyc29yOiAncG9pbnRlcicsIGRpc3BsYXk6ICdpbmxpbmUtYmxvY2snLCBjb2xvcjogJ3JnYig2NiwgMTQwLCAxNzkpJyB9LCBweWRpbzogcHlkaW8gfSk7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKGhyZWYuc3RhcnRzV2l0aCgnd29ya3NwYWNlczovLycpKSB7XG4gICAgICAgICAgICAgICAgKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIHdzSWQgPSBocmVmLnJlcGxhY2UoJ3dvcmtzcGFjZXM6Ly8nLCAnJyk7XG4gICAgICAgICAgICAgICAgICAgIGlmIChweWRpby51c2VyICYmIHB5ZGlvLnVzZXIuZ2V0UmVwb3NpdG9yaWVzTGlzdCgpLmdldCh3c0lkKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgb25DbGljayA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBweWRpby50cmlnZ2VyUmVwb3NpdG9yeUNoYW5nZSh3c0lkKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KSgpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIF9yZWFjdDJbJ2RlZmF1bHQnXS5jcmVhdGVFbGVtZW50KFxuICAgICAgICAgICAgICAgICdhJyxcbiAgICAgICAgICAgICAgICB7IHRpdGxlOiB0aXRsZSwgc3R5bGU6IHsgY3Vyc29yOiAncG9pbnRlcicsIGNvbG9yOiAncmdiKDY2LCAxNDAsIDE3OSknIH0sIG9uQ2xpY2s6IG9uQ2xpY2sgfSxcbiAgICAgICAgICAgICAgICBjaGlsZHJlblxuICAgICAgICAgICAgKTtcbiAgICAgICAgfVxuICAgIH0pO1xufVxuXG52YXIgQWN0aXZpdHkgPSAoZnVuY3Rpb24gKF9SZWFjdCRDb21wb25lbnQyKSB7XG4gICAgX2luaGVyaXRzKEFjdGl2aXR5LCBfUmVhY3QkQ29tcG9uZW50Mik7XG5cbiAgICBmdW5jdGlvbiBBY3Rpdml0eSgpIHtcbiAgICAgICAgX2NsYXNzQ2FsbENoZWNrKHRoaXMsIEFjdGl2aXR5KTtcblxuICAgICAgICBfZ2V0KE9iamVjdC5nZXRQcm90b3R5cGVPZihBY3Rpdml0eS5wcm90b3R5cGUpLCAnY29uc3RydWN0b3InLCB0aGlzKS5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgIH1cblxuICAgIF9jcmVhdGVDbGFzcyhBY3Rpdml0eSwgW3tcbiAgICAgICAga2V5OiAncmVuZGVyJyxcbiAgICAgICAgdmFsdWU6IGZ1bmN0aW9uIHJlbmRlcigpIHtcbiAgICAgICAgICAgIHZhciBfcHJvcHMyID0gdGhpcy5wcm9wcztcbiAgICAgICAgICAgIHZhciBweWRpbyA9IF9wcm9wczIucHlkaW87XG4gICAgICAgICAgICB2YXIgYWN0aXZpdHkgPSBfcHJvcHMyLmFjdGl2aXR5O1xuICAgICAgICAgICAgdmFyIGxpc3RDb250ZXh0ID0gX3Byb3BzMi5saXN0Q29udGV4dDtcbiAgICAgICAgICAgIHZhciBkaXNwbGF5Q29udGV4dCA9IF9wcm9wczIuZGlzcGxheUNvbnRleHQ7XG4gICAgICAgICAgICB2YXIgb25lTGluZXIgPSBfcHJvcHMyLm9uZUxpbmVyO1xuXG4gICAgICAgICAgICB2YXIgc2Vjb25kYXJ5ID0gYWN0aXZpdHkudHlwZSArIFwiIC0gXCIgKyBhY3Rpdml0eS5hY3Rvci5uYW1lO1xuICAgICAgICAgICAgaWYgKGFjdGl2aXR5LnN1bW1hcnkpIHtcbiAgICAgICAgICAgICAgICBzZWNvbmRhcnkgPSBfcmVhY3QyWydkZWZhdWx0J10uY3JlYXRlRWxlbWVudChfcmVhY3RNYXJrZG93bjJbJ2RlZmF1bHQnXSwgeyBzb3VyY2U6IGFjdGl2aXR5LnN1bW1hcnksIHJlbmRlcmVyczogeyAncGFyYWdyYXBoJzogUGFyYWdyYXBoLCAnbGluayc6IExpbmtXcmFwcGVyKHB5ZGlvLCBhY3Rpdml0eSkgfSB9KTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdmFyIGF2YXRhciA9IF9yZWFjdDJbJ2RlZmF1bHQnXS5jcmVhdGVFbGVtZW50KFVzZXJBdmF0YXIsIHtcbiAgICAgICAgICAgICAgICB1c2VEZWZhdWx0QXZhdGFyOiB0cnVlLFxuICAgICAgICAgICAgICAgIHVzZXJJZDogYWN0aXZpdHkuYWN0b3IuaWQsXG4gICAgICAgICAgICAgICAgdXNlckxhYmVsOiBhY3Rpdml0eS5hY3Rvci5uYW1lLFxuICAgICAgICAgICAgICAgIGRpc3BsYXlMb2NhbExhYmVsOiB0cnVlLFxuICAgICAgICAgICAgICAgIHVzZXJUeXBlOiAndXNlcicsXG4gICAgICAgICAgICAgICAgcHlkaW86IHB5ZGlvLFxuICAgICAgICAgICAgICAgIHN0eWxlOiB7IGRpc3BsYXk6ICdmbGV4JywgYWxpZ25JdGVtczogJ2NlbnRlcicsIG1heFdpZHRoOiAnNjAlJyB9LFxuICAgICAgICAgICAgICAgIGxhYmVsU3R5bGU6IHsgZm9udFNpemU6IDE0LCBwYWRkaW5nTGVmdDogMTAsIG92ZXJmbG93OiAnaGlkZGVuJywgdGV4dE92ZXJmbG93OiAnZWxsaXBzaXMnLCB3aGl0ZVNwYWNlOiAnbm93cmFwJyB9LFxuICAgICAgICAgICAgICAgIGF2YXRhclN0eWxlOiB7IGZsZXhTaHJpbms6IDAgfSxcbiAgICAgICAgICAgICAgICBhdmF0YXJTaXplOiAyOCxcbiAgICAgICAgICAgICAgICByaWNoT25Ib3ZlcjogdHJ1ZVxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIHZhciBzdW1tYXJ5ID0gdW5kZWZpbmVkO1xuICAgICAgICAgICAgdmFyIGFjdGlvbkljb24gPSB1bmRlZmluZWQ7XG4gICAgICAgICAgICB2YXIgYmxvY2tTdHlsZSA9IHtcbiAgICAgICAgICAgICAgICBtYXJnaW46ICcwcHggMTBweCA2cHgnXG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgdmFyIHN1bW1hcnlTdHlsZSA9IHtcbiAgICAgICAgICAgICAgICBwYWRkaW5nOiAnNnB4IDIycHggMTJweCcsXG4gICAgICAgICAgICAgICAgbWFyZ2luVG9wOiA2LFxuICAgICAgICAgICAgICAgIGJvcmRlclJhZGl1czogMixcbiAgICAgICAgICAgICAgICBib3JkZXJMZWZ0OiAnMnB4IHNvbGlkICNlMGUwZTAnLFxuICAgICAgICAgICAgICAgIG1hcmdpbkxlZnQ6IDEzLFxuICAgICAgICAgICAgICAgIGNvbG9yOiAncmdiYSgwLDAsMCwwLjMzKScsXG4gICAgICAgICAgICAgICAgZm9udFdlaWdodDogNTAwLFxuICAgICAgICAgICAgICAgIGZvbnRTdHlsZTogJ2l0YWxpYycsXG4gICAgICAgICAgICAgICAgb3ZlcmZsb3c6ICdoaWRkZW4nXG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgaWYgKGRpc3BsYXlDb250ZXh0ID09PSAncG9wb3ZlcicpIHtcbiAgICAgICAgICAgICAgICBzdW1tYXJ5U3R5bGUgPSB7XG4gICAgICAgICAgICAgICAgICAgIGZvbnRTaXplOiAxMyxcbiAgICAgICAgICAgICAgICAgICAgY29sb3I6ICdyZ2JhKDAsMCwwLDAuMzMpJyxcbiAgICAgICAgICAgICAgICAgICAgZm9udFdlaWdodDogNTAwLFxuICAgICAgICAgICAgICAgICAgICBtYXJnaW46ICc2cHggMCcsXG4gICAgICAgICAgICAgICAgICAgIHBhZGRpbmc6IDZcbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB2YXIgY2xhc3NOYW1lID0gJyc7XG4gICAgICAgICAgICB2YXIgdGl0bGUgPSB1bmRlZmluZWQ7XG4gICAgICAgICAgICBzd2l0Y2ggKGFjdGl2aXR5LnR5cGUpIHtcbiAgICAgICAgICAgICAgICBjYXNlIFwiQ3JlYXRlXCI6XG4gICAgICAgICAgICAgICAgICAgIGlmIChhY3Rpdml0eS5vYmplY3QudHlwZSA9PT0gJ0RvY3VtZW50Jykge1xuICAgICAgICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lID0gXCJmaWxlLXBsdXNcIjtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZSA9IFwiZm9sZGVyLXBsdXNcIjtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB0aXRsZSA9IFwiQ3JlYXRlZFwiO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBjYXNlIFwiRGVsZXRlXCI6XG4gICAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZSA9IFwiZGVsZXRlXCI7XG4gICAgICAgICAgICAgICAgICAgIHRpdGxlID0gXCJEZWxldGVkXCI7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGNhc2UgXCJFZGl0XCI6XG4gICAgICAgICAgICAgICAgY2FzZSBcIlVwZGF0ZVwiOlxuICAgICAgICAgICAgICAgICAgICBjbGFzc05hbWUgPSBcInBlbmNpbFwiO1xuICAgICAgICAgICAgICAgICAgICB0aXRsZSA9IFwiTW9kaWZpZWRcIjtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgY2FzZSBcIlVwZGF0ZU1ldGFcIjpcbiAgICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lID0gXCJ0YWctbXVsdGlwbGVcIjtcbiAgICAgICAgICAgICAgICAgICAgdGl0bGUgPSBcIk1vZGlmaWVkXCI7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGNhc2UgXCJVcGRhdGVDb21tZW50XCI6XG4gICAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZSA9IFwibWVzc2FnZS1vdXRsaW5lXCI7XG4gICAgICAgICAgICAgICAgICAgIHRpdGxlID0gXCJDb21tZW50ZWRcIjtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgY2FzZSBcIlJlYWRcIjpcbiAgICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lID0gXCJleWVcIjtcbiAgICAgICAgICAgICAgICAgICAgdGl0bGUgPSBcIkFjY2Vzc2VkXCI7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGNhc2UgXCJNb3ZlXCI6XG4gICAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZSA9IFwiZmlsZS1zZW5kXCI7XG4gICAgICAgICAgICAgICAgICAgIHRpdGxlID0gXCJNb3ZlZFwiO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBjYXNlIFwiU2hhcmVcIjpcbiAgICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lID0gXCJzaGFyZS12YXJpYW50XCI7XG4gICAgICAgICAgICAgICAgICAgIGlmIChhY3Rpdml0eS5vYmplY3QudHlwZSA9PT0gXCJDZWxsXCIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZSA9IFwiaWNvbW9vbi1jZWxsc1wiO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKGFjdGl2aXR5Lm9iamVjdC50eXBlID09PSBcIldvcmtzcGFjZVwiKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjbGFzc05hbWUgPSBcImZvbGRlclwiO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIHRpdGxlID0gXCJTaGFyZWRcIjtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoY2xhc3NOYW1lLmluZGV4T2YoJ2ljb21vb24tJykgPT09IC0xKSB7XG4gICAgICAgICAgICAgICAgY2xhc3NOYW1lID0gJ21kaSBtZGktJyArIGNsYXNzTmFtZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChsaXN0Q29udGV4dCA9PT0gJ05PREUtTEVBRicpIHtcbiAgICAgICAgICAgICAgICBibG9ja1N0eWxlID0geyBtYXJnaW46ICcxNnB4IDEwcHgnIH07XG4gICAgICAgICAgICAgICAgYWN0aW9uSWNvbiA9IF9yZWFjdDJbJ2RlZmF1bHQnXS5jcmVhdGVFbGVtZW50KF9tYXRlcmlhbFVpLkZvbnRJY29uLCB7IGNsYXNzTmFtZTogY2xhc3NOYW1lLCB0aXRsZTogdGl0bGUsIHN0eWxlOiB7IGZvbnRTaXplOiAxNywgY29sb3I6ICdyZ2JhKDAsMCwwLDAuMTcpJyB9IH0pO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBpZiAoZGlzcGxheUNvbnRleHQgPT09ICdtYWluTGlzdCcpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIF9yZWFjdDJbJ2RlZmF1bHQnXS5jcmVhdGVFbGVtZW50KF9tYXRlcmlhbFVpLkxpc3RJdGVtLCB7XG4gICAgICAgICAgICAgICAgICAgICAgICBsZWZ0SWNvbjogX3JlYWN0MlsnZGVmYXVsdCddLmNyZWF0ZUVsZW1lbnQoX21hdGVyaWFsVWkuRm9udEljb24sIHsgY2xhc3NOYW1lOiBjbGFzc05hbWUsIGNvbG9yOiAncmdiYSgwLDAsMCwuMzMpJyB9KSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHByaW1hcnlUZXh0OiBzZWNvbmRhcnksXG4gICAgICAgICAgICAgICAgICAgICAgICBzZWNvbmRhcnlUZXh0OiBfcmVhY3QyWydkZWZhdWx0J10uY3JlYXRlRWxlbWVudChcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAnZGl2JyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7IHN0eWxlOiB7IGNvbG9yOiAncmdiYSgwLDAsMCwuMzMpJyB9IH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgd29ya3NwYWNlc0xvY2F0aW9ucyhweWRpbywgYWN0aXZpdHkub2JqZWN0KVxuICAgICAgICAgICAgICAgICAgICAgICAgKSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGRpc2FibGVkOiB0cnVlXG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoZGlzcGxheUNvbnRleHQgPT09ICdwb3BvdmVyJykge1xuICAgICAgICAgICAgICAgICAgICB2YXIgbGVmdEljb24gPSBfcmVhY3QyWydkZWZhdWx0J10uY3JlYXRlRWxlbWVudChfbWF0ZXJpYWxVaS5Gb250SWNvbiwgeyBjbGFzc05hbWU6IGNsYXNzTmFtZSwgdGl0bGU6IHRpdGxlLCBzdHlsZTogeyBwYWRkaW5nOiAnMCA4cHgnLCBmb250U2l6ZTogMjAsIGNvbG9yOiAncmdiYSgwLDAsMCwwLjE3KScgfSB9KTtcbiAgICAgICAgICAgICAgICAgICAgc3VtbWFyeSA9IF9yZWFjdDJbJ2RlZmF1bHQnXS5jcmVhdGVFbGVtZW50KFxuICAgICAgICAgICAgICAgICAgICAgICAgJ2RpdicsXG4gICAgICAgICAgICAgICAgICAgICAgICB7IHN0eWxlOiB7IGRpc3BsYXk6ICdmbGV4JywgYWxpZ25JdGVtczogJ2NlbnRlcicgfSB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgbGVmdEljb24sXG4gICAgICAgICAgICAgICAgICAgICAgICBfcmVhY3QyWydkZWZhdWx0J10uY3JlYXRlRWxlbWVudChcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAnZGl2JyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7IHN0eWxlOiBfZXh0ZW5kcyh7fSwgc3VtbWFyeVN0eWxlLCB7IGZsZXg6IDEgfSkgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzZWNvbmRhcnlcbiAgICAgICAgICAgICAgICAgICAgICAgIClcbiAgICAgICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBzdW1tYXJ5ID0gX3JlYWN0MlsnZGVmYXVsdCddLmNyZWF0ZUVsZW1lbnQoXG4gICAgICAgICAgICAgICAgICAgICAgICAnZGl2JyxcbiAgICAgICAgICAgICAgICAgICAgICAgIHsgc3R5bGU6IHN1bW1hcnlTdHlsZSB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgc2Vjb25kYXJ5XG4gICAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4gX3JlYWN0MlsnZGVmYXVsdCddLmNyZWF0ZUVsZW1lbnQoXG4gICAgICAgICAgICAgICAgJ2RpdicsXG4gICAgICAgICAgICAgICAgeyBzdHlsZTogYmxvY2tTdHlsZSB9LFxuICAgICAgICAgICAgICAgICFvbmVMaW5lciAmJiBfcmVhY3QyWydkZWZhdWx0J10uY3JlYXRlRWxlbWVudChcbiAgICAgICAgICAgICAgICAgICAgJ2RpdicsXG4gICAgICAgICAgICAgICAgICAgIHsgc3R5bGU6IHsgZGlzcGxheTogJ2ZsZXgnLCBhbGlnbkl0ZW1zOiAnY2VudGVyJyB9IH0sXG4gICAgICAgICAgICAgICAgICAgIGF2YXRhcixcbiAgICAgICAgICAgICAgICAgICAgX3JlYWN0MlsnZGVmYXVsdCddLmNyZWF0ZUVsZW1lbnQoXG4gICAgICAgICAgICAgICAgICAgICAgICAnc3BhbicsXG4gICAgICAgICAgICAgICAgICAgICAgICB7IHN0eWxlOiB7IGZvbnRTaXplOiAxMywgZGlzcGxheTogJ2lubGluZS1ibG9jaycsIGZsZXg6IDEsIGhlaWdodDogMTgsIGNvbG9yOiAncmdiYSgwLDAsMCwwLjIzKScsIGZvbnRXZWlnaHQ6IDUwMCwgcGFkZGluZ0xlZnQ6IDgsIHdoaXRlU3BhY2U6ICdub3dyYXAnIH0gfSxcbiAgICAgICAgICAgICAgICAgICAgICAgIG1vbWVudChhY3Rpdml0eS51cGRhdGVkKS5mcm9tTm93KClcbiAgICAgICAgICAgICAgICAgICAgKSxcbiAgICAgICAgICAgICAgICAgICAgYWN0aW9uSWNvblxuICAgICAgICAgICAgICAgICksXG4gICAgICAgICAgICAgICAgc3VtbWFyeVxuICAgICAgICAgICAgKTtcbiAgICAgICAgfVxuICAgIH1dKTtcblxuICAgIHJldHVybiBBY3Rpdml0eTtcbn0pKF9yZWFjdDJbJ2RlZmF1bHQnXS5Db21wb25lbnQpO1xuXG5BY3Rpdml0eS5Qcm9wVHlwZXMgPSB7XG4gICAgYWN0aXZpdHk6IF9yZWFjdDJbJ2RlZmF1bHQnXS5Qcm9wVHlwZXMub2JqZWN0LFxuICAgIGxpc3RDb250ZXh0OiBfcmVhY3QyWydkZWZhdWx0J10uUHJvcFR5cGVzLnN0cmluZyxcbiAgICBkaXNwbGF5Q29udGV4dDogX3JlYWN0MlsnZGVmYXVsdCddLlByb3BUeXBlcy5vbmVPZihbJ21haW5MaXN0JywgJ2luZm9QYW5lbCcsICdwb3BvdmVyJ10pXG59O1xuXG5leHBvcnRzWydkZWZhdWx0J10gPSBBY3Rpdml0eSA9IFB5ZGlvQ29udGV4dENvbnN1bWVyKEFjdGl2aXR5KTtcbmV4cG9ydHNbJ2RlZmF1bHQnXSA9IEFjdGl2aXR5O1xubW9kdWxlLmV4cG9ydHMgPSBleHBvcnRzWydkZWZhdWx0J107XG4iLCIvKlxuICogQ29weXJpZ2h0IDIwMDctMjAxNyBDaGFybGVzIGR1IEpldSAtIEFic3RyaXVtIFNBUyA8dGVhbSAoYXQpIHB5ZC5pbz5cbiAqIFRoaXMgZmlsZSBpcyBwYXJ0IG9mIFB5ZGlvLlxuICpcbiAqIFB5ZGlvIGlzIGZyZWUgc29mdHdhcmU6IHlvdSBjYW4gcmVkaXN0cmlidXRlIGl0IGFuZC9vciBtb2RpZnlcbiAqIGl0IHVuZGVyIHRoZSB0ZXJtcyBvZiB0aGUgR05VIEFmZmVybyBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlIGFzIHB1Ymxpc2hlZCBieVxuICogdGhlIEZyZWUgU29mdHdhcmUgRm91bmRhdGlvbiwgZWl0aGVyIHZlcnNpb24gMyBvZiB0aGUgTGljZW5zZSwgb3JcbiAqIChhdCB5b3VyIG9wdGlvbikgYW55IGxhdGVyIHZlcnNpb24uXG4gKlxuICogUHlkaW8gaXMgZGlzdHJpYnV0ZWQgaW4gdGhlIGhvcGUgdGhhdCBpdCB3aWxsIGJlIHVzZWZ1bCxcbiAqIGJ1dCBXSVRIT1VUIEFOWSBXQVJSQU5UWTsgd2l0aG91dCBldmVuIHRoZSBpbXBsaWVkIHdhcnJhbnR5IG9mXG4gKiBNRVJDSEFOVEFCSUxJVFkgb3IgRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UuICBTZWUgdGhlXG4gKiBHTlUgQWZmZXJvIEdlbmVyYWwgUHVibGljIExpY2Vuc2UgZm9yIG1vcmUgZGV0YWlscy5cbiAqXG4gKiBZb3Ugc2hvdWxkIGhhdmUgcmVjZWl2ZWQgYSBjb3B5IG9mIHRoZSBHTlUgQWZmZXJvIEdlbmVyYWwgUHVibGljIExpY2Vuc2VcbiAqIGFsb25nIHdpdGggUHlkaW8uICBJZiBub3QsIHNlZSA8aHR0cDovL3d3dy5nbnUub3JnL2xpY2Vuc2VzLz4uXG4gKlxuICogVGhlIGxhdGVzdCBjb2RlIGNhbiBiZSBmb3VuZCBhdCA8aHR0cHM6Ly9weWRpby5jb20+LlxuICovXG4ndXNlIHN0cmljdCc7XG5cbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHtcbiAgICB2YWx1ZTogdHJ1ZVxufSk7XG5cbnZhciBfZXh0ZW5kcyA9IE9iamVjdC5hc3NpZ24gfHwgZnVuY3Rpb24gKHRhcmdldCkgeyBmb3IgKHZhciBpID0gMTsgaSA8IGFyZ3VtZW50cy5sZW5ndGg7IGkrKykgeyB2YXIgc291cmNlID0gYXJndW1lbnRzW2ldOyBmb3IgKHZhciBrZXkgaW4gc291cmNlKSB7IGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwoc291cmNlLCBrZXkpKSB7IHRhcmdldFtrZXldID0gc291cmNlW2tleV07IH0gfSB9IHJldHVybiB0YXJnZXQ7IH07XG5cbnZhciBfY3JlYXRlQ2xhc3MgPSAoZnVuY3Rpb24gKCkgeyBmdW5jdGlvbiBkZWZpbmVQcm9wZXJ0aWVzKHRhcmdldCwgcHJvcHMpIHsgZm9yICh2YXIgaSA9IDA7IGkgPCBwcm9wcy5sZW5ndGg7IGkrKykgeyB2YXIgZGVzY3JpcHRvciA9IHByb3BzW2ldOyBkZXNjcmlwdG9yLmVudW1lcmFibGUgPSBkZXNjcmlwdG9yLmVudW1lcmFibGUgfHwgZmFsc2U7IGRlc2NyaXB0b3IuY29uZmlndXJhYmxlID0gdHJ1ZTsgaWYgKCd2YWx1ZScgaW4gZGVzY3JpcHRvcikgZGVzY3JpcHRvci53cml0YWJsZSA9IHRydWU7IE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0YXJnZXQsIGRlc2NyaXB0b3Iua2V5LCBkZXNjcmlwdG9yKTsgfSB9IHJldHVybiBmdW5jdGlvbiAoQ29uc3RydWN0b3IsIHByb3RvUHJvcHMsIHN0YXRpY1Byb3BzKSB7IGlmIChwcm90b1Byb3BzKSBkZWZpbmVQcm9wZXJ0aWVzKENvbnN0cnVjdG9yLnByb3RvdHlwZSwgcHJvdG9Qcm9wcyk7IGlmIChzdGF0aWNQcm9wcykgZGVmaW5lUHJvcGVydGllcyhDb25zdHJ1Y3Rvciwgc3RhdGljUHJvcHMpOyByZXR1cm4gQ29uc3RydWN0b3I7IH07IH0pKCk7XG5cbnZhciBfZ2V0ID0gZnVuY3Rpb24gZ2V0KF94LCBfeDIsIF94MykgeyB2YXIgX2FnYWluID0gdHJ1ZTsgX2Z1bmN0aW9uOiB3aGlsZSAoX2FnYWluKSB7IHZhciBvYmplY3QgPSBfeCwgcHJvcGVydHkgPSBfeDIsIHJlY2VpdmVyID0gX3gzOyBfYWdhaW4gPSBmYWxzZTsgaWYgKG9iamVjdCA9PT0gbnVsbCkgb2JqZWN0ID0gRnVuY3Rpb24ucHJvdG90eXBlOyB2YXIgZGVzYyA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3Iob2JqZWN0LCBwcm9wZXJ0eSk7IGlmIChkZXNjID09PSB1bmRlZmluZWQpIHsgdmFyIHBhcmVudCA9IE9iamVjdC5nZXRQcm90b3R5cGVPZihvYmplY3QpOyBpZiAocGFyZW50ID09PSBudWxsKSB7IHJldHVybiB1bmRlZmluZWQ7IH0gZWxzZSB7IF94ID0gcGFyZW50OyBfeDIgPSBwcm9wZXJ0eTsgX3gzID0gcmVjZWl2ZXI7IF9hZ2FpbiA9IHRydWU7IGRlc2MgPSBwYXJlbnQgPSB1bmRlZmluZWQ7IGNvbnRpbnVlIF9mdW5jdGlvbjsgfSB9IGVsc2UgaWYgKCd2YWx1ZScgaW4gZGVzYykgeyByZXR1cm4gZGVzYy52YWx1ZTsgfSBlbHNlIHsgdmFyIGdldHRlciA9IGRlc2MuZ2V0OyBpZiAoZ2V0dGVyID09PSB1bmRlZmluZWQpIHsgcmV0dXJuIHVuZGVmaW5lZDsgfSByZXR1cm4gZ2V0dGVyLmNhbGwocmVjZWl2ZXIpOyB9IH0gfTtcblxuZnVuY3Rpb24gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChvYmopIHsgcmV0dXJuIG9iaiAmJiBvYmouX19lc01vZHVsZSA/IG9iaiA6IHsgJ2RlZmF1bHQnOiBvYmogfTsgfVxuXG5mdW5jdGlvbiBfdG9Db25zdW1hYmxlQXJyYXkoYXJyKSB7IGlmIChBcnJheS5pc0FycmF5KGFycikpIHsgZm9yICh2YXIgaSA9IDAsIGFycjIgPSBBcnJheShhcnIubGVuZ3RoKTsgaSA8IGFyci5sZW5ndGg7IGkrKykgYXJyMltpXSA9IGFycltpXTsgcmV0dXJuIGFycjI7IH0gZWxzZSB7IHJldHVybiBBcnJheS5mcm9tKGFycik7IH0gfVxuXG5mdW5jdGlvbiBfY2xhc3NDYWxsQ2hlY2soaW5zdGFuY2UsIENvbnN0cnVjdG9yKSB7IGlmICghKGluc3RhbmNlIGluc3RhbmNlb2YgQ29uc3RydWN0b3IpKSB7IHRocm93IG5ldyBUeXBlRXJyb3IoJ0Nhbm5vdCBjYWxsIGEgY2xhc3MgYXMgYSBmdW5jdGlvbicpOyB9IH1cblxuZnVuY3Rpb24gX2luaGVyaXRzKHN1YkNsYXNzLCBzdXBlckNsYXNzKSB7IGlmICh0eXBlb2Ygc3VwZXJDbGFzcyAhPT0gJ2Z1bmN0aW9uJyAmJiBzdXBlckNsYXNzICE9PSBudWxsKSB7IHRocm93IG5ldyBUeXBlRXJyb3IoJ1N1cGVyIGV4cHJlc3Npb24gbXVzdCBlaXRoZXIgYmUgbnVsbCBvciBhIGZ1bmN0aW9uLCBub3QgJyArIHR5cGVvZiBzdXBlckNsYXNzKTsgfSBzdWJDbGFzcy5wcm90b3R5cGUgPSBPYmplY3QuY3JlYXRlKHN1cGVyQ2xhc3MgJiYgc3VwZXJDbGFzcy5wcm90b3R5cGUsIHsgY29uc3RydWN0b3I6IHsgdmFsdWU6IHN1YkNsYXNzLCBlbnVtZXJhYmxlOiBmYWxzZSwgd3JpdGFibGU6IHRydWUsIGNvbmZpZ3VyYWJsZTogdHJ1ZSB9IH0pOyBpZiAoc3VwZXJDbGFzcykgT2JqZWN0LnNldFByb3RvdHlwZU9mID8gT2JqZWN0LnNldFByb3RvdHlwZU9mKHN1YkNsYXNzLCBzdXBlckNsYXNzKSA6IHN1YkNsYXNzLl9fcHJvdG9fXyA9IHN1cGVyQ2xhc3M7IH1cblxudmFyIF9yZWFjdCA9IHJlcXVpcmUoJ3JlYWN0Jyk7XG5cbnZhciBfcmVhY3QyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfcmVhY3QpO1xuXG52YXIgX21hdGVyaWFsVWkgPSByZXF1aXJlKCdtYXRlcmlhbC11aScpO1xuXG52YXIgX3B5ZGlvID0gcmVxdWlyZSgncHlkaW8nKTtcblxudmFyIF9weWRpbzIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9weWRpbyk7XG5cbnZhciBfQ2xpZW50ID0gcmVxdWlyZSgnLi9DbGllbnQnKTtcblxudmFyIF9DbGllbnQyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfQ2xpZW50KTtcblxudmFyIF9BY3Rpdml0eSA9IHJlcXVpcmUoJy4vQWN0aXZpdHknKTtcblxudmFyIF9BY3Rpdml0eTIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9BY3Rpdml0eSk7XG5cbnZhciBfUHlkaW8kcmVxdWlyZUxpYiA9IF9weWRpbzJbJ2RlZmF1bHQnXS5yZXF1aXJlTGliKCdib290Jyk7XG5cbnZhciBQeWRpb0NvbnRleHRDb25zdW1lciA9IF9QeWRpbyRyZXF1aXJlTGliLlB5ZGlvQ29udGV4dENvbnN1bWVyO1xudmFyIG1vbWVudCA9IF9QeWRpbyRyZXF1aXJlTGliLm1vbWVudDtcblxudmFyIF9QeWRpbyRyZXF1aXJlTGliMiA9IF9weWRpbzJbJ2RlZmF1bHQnXS5yZXF1aXJlTGliKCdjb21wb25lbnRzJyk7XG5cbnZhciBFbXB0eVN0YXRlVmlldyA9IF9QeWRpbyRyZXF1aXJlTGliMi5FbXB0eVN0YXRlVmlldztcblxudmFyIEFjdGl2aXR5TGlzdCA9IChmdW5jdGlvbiAoX1JlYWN0JENvbXBvbmVudCkge1xuICAgIF9pbmhlcml0cyhBY3Rpdml0eUxpc3QsIF9SZWFjdCRDb21wb25lbnQpO1xuXG4gICAgZnVuY3Rpb24gQWN0aXZpdHlMaXN0KHByb3BzKSB7XG4gICAgICAgIF9jbGFzc0NhbGxDaGVjayh0aGlzLCBBY3Rpdml0eUxpc3QpO1xuXG4gICAgICAgIF9nZXQoT2JqZWN0LmdldFByb3RvdHlwZU9mKEFjdGl2aXR5TGlzdC5wcm90b3R5cGUpLCAnY29uc3RydWN0b3InLCB0aGlzKS5jYWxsKHRoaXMsIHByb3BzKTtcbiAgICAgICAgaWYgKHByb3BzLml0ZW1zKSB7XG4gICAgICAgICAgICB0aGlzLnN0YXRlID0geyBkYXRhOiB7IGl0ZW1zOiBwcm9wcy5pdGVtcyB9LCBvZmZzZXQ6IDAsIGxvYWRNb3JlOiBmYWxzZSwgbG9hZGluZzogZmFsc2UgfTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuc3RhdGUgPSB7IGRhdGE6IFtdLCBvZmZzZXQ6IDAsIGxvYWRNb3JlOiB0cnVlLCBsb2FkaW5nOiBmYWxzZSB9O1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgX2NyZWF0ZUNsYXNzKEFjdGl2aXR5TGlzdCwgW3tcbiAgICAgICAga2V5OiAnbWVyZ2VNb3JlRmVlZCcsXG4gICAgICAgIHZhbHVlOiBmdW5jdGlvbiBtZXJnZU1vcmVGZWVkKGN1cnJlbnRGZWVkLCBuZXdGZWVkKSB7XG4gICAgICAgICAgICB2YXIgY3VycmVudElkcyA9IGN1cnJlbnRGZWVkLml0ZW1zLm1hcChmdW5jdGlvbiAoaXRlbSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBpdGVtLmlkO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB2YXIgZmlsdGVyZWQgPSBuZXdGZWVkLml0ZW1zLmZpbHRlcihmdW5jdGlvbiAoaXRlbSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBjdXJyZW50SWRzLmluZGV4T2YoaXRlbS5pZCkgPT09IC0xO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBpZiAoIWZpbHRlcmVkLmxlbmd0aCkge1xuICAgICAgICAgICAgICAgIHRoaXMuc2V0U3RhdGUoeyBsb2FkTW9yZTogZmFsc2UgfSk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGN1cnJlbnRGZWVkO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdmFyIG1lcmdlZCA9IGN1cnJlbnRGZWVkO1xuICAgICAgICAgICAgbWVyZ2VkLml0ZW1zID0gW10uY29uY2F0KF90b0NvbnN1bWFibGVBcnJheShjdXJyZW50RmVlZC5pdGVtcyksIF90b0NvbnN1bWFibGVBcnJheShmaWx0ZXJlZCkpO1xuICAgICAgICAgICAgbWVyZ2VkLnRvdGFsSXRlbXMgPSBtZXJnZWQuaXRlbXMubGVuZ3RoO1xuICAgICAgICAgICAgcmV0dXJuIG1lcmdlZDtcbiAgICAgICAgfVxuICAgIH0sIHtcbiAgICAgICAga2V5OiAnbG9hZEZvclByb3BzJyxcbiAgICAgICAgdmFsdWU6IGZ1bmN0aW9uIGxvYWRGb3JQcm9wcyhwcm9wcykge1xuICAgICAgICAgICAgdmFyIF90aGlzID0gdGhpcztcblxuICAgICAgICAgICAgdmFyIGNvbnRleHQgPSBwcm9wcy5jb250ZXh0O1xuICAgICAgICAgICAgdmFyIHBvaW50T2ZWaWV3ID0gcHJvcHMucG9pbnRPZlZpZXc7XG4gICAgICAgICAgICB2YXIgY29udGV4dERhdGEgPSBwcm9wcy5jb250ZXh0RGF0YTtcbiAgICAgICAgICAgIHZhciBsaW1pdCA9IHByb3BzLmxpbWl0O1xuICAgICAgICAgICAgdmFyIF9zdGF0ZSA9IHRoaXMuc3RhdGU7XG4gICAgICAgICAgICB2YXIgb2Zmc2V0ID0gX3N0YXRlLm9mZnNldDtcbiAgICAgICAgICAgIHZhciBkYXRhID0gX3N0YXRlLmRhdGE7XG5cbiAgICAgICAgICAgIGlmIChsaW1pdCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgbGltaXQgPSAtMTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChvZmZzZXQgPiAwKSB7XG4gICAgICAgICAgICAgICAgbGltaXQgPSAxMDA7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLnNldFN0YXRlKHsgbG9hZGluZzogdHJ1ZSwgZXJyb3I6IG51bGwgfSk7XG4gICAgICAgICAgICBfQ2xpZW50MlsnZGVmYXVsdCddLmxvYWRBY3Rpdml0eVN0cmVhbXMoY29udGV4dCwgY29udGV4dERhdGEsICdvdXRib3gnLCBwb2ludE9mVmlldywgb2Zmc2V0LCBsaW1pdCkudGhlbihmdW5jdGlvbiAoanNvbikge1xuICAgICAgICAgICAgICAgIGlmIChvZmZzZXQgPiAwICYmIGRhdGEgJiYgZGF0YS5pdGVtcykge1xuICAgICAgICAgICAgICAgICAgICBpZiAoanNvbiAmJiBqc29uLml0ZW1zKSBfdGhpcy5zZXRTdGF0ZSh7IGRhdGE6IF90aGlzLm1lcmdlTW9yZUZlZWQoZGF0YSwganNvbikgfSk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgX3RoaXMuc2V0U3RhdGUoeyBkYXRhOiBqc29uIH0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAoIWpzb24gfHwgIWpzb24uaXRlbXMgfHwgIWpzb24uaXRlbXMubGVuZ3RoKSB7XG4gICAgICAgICAgICAgICAgICAgIF90aGlzLnNldFN0YXRlKHsgbG9hZE1vcmU6IGZhbHNlIH0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBfdGhpcy5zZXRTdGF0ZSh7IGxvYWRpbmc6IGZhbHNlIH0pO1xuICAgICAgICAgICAgfSlbJ2NhdGNoJ10oZnVuY3Rpb24gKG1zZykge1xuICAgICAgICAgICAgICAgIF90aGlzLnNldFN0YXRlKHsgbG9hZGluZzogZmFsc2UsIGVycm9yOiBtc2cgfSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgIH0sIHtcbiAgICAgICAga2V5OiAnY29tcG9uZW50V2lsbE1vdW50JyxcbiAgICAgICAgdmFsdWU6IGZ1bmN0aW9uIGNvbXBvbmVudFdpbGxNb3VudCgpIHtcbiAgICAgICAgICAgIHZhciBfcHJvcHMgPSB0aGlzLnByb3BzO1xuICAgICAgICAgICAgdmFyIGl0ZW1zID0gX3Byb3BzLml0ZW1zO1xuICAgICAgICAgICAgdmFyIGNvbnRleHREYXRhID0gX3Byb3BzLmNvbnRleHREYXRhO1xuXG4gICAgICAgICAgICBpZiAoaXRlbXMpIHtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoY29udGV4dERhdGEpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmxvYWRGb3JQcm9wcyh0aGlzLnByb3BzKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH0sIHtcbiAgICAgICAga2V5OiAnY29tcG9uZW50V2lsbFJlY2VpdmVQcm9wcycsXG4gICAgICAgIHZhbHVlOiBmdW5jdGlvbiBjb21wb25lbnRXaWxsUmVjZWl2ZVByb3BzKG5leHRQcm9wcykge1xuICAgICAgICAgICAgdmFyIF90aGlzMiA9IHRoaXM7XG5cbiAgICAgICAgICAgIGlmIChuZXh0UHJvcHMuaXRlbXMpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnNldFN0YXRlKHsgZGF0YTogeyBpdGVtczogbmV4dFByb3BzLml0ZW1zIH0sIG9mZnNldDogMCwgbG9hZE1vcmU6IGZhbHNlIH0pO1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChuZXh0UHJvcHMuY29udGV4dERhdGEgIT09IHRoaXMucHJvcHMuY29udGV4dERhdGEgfHwgbmV4dFByb3BzLmNvbnRleHQgIT09IHRoaXMucHJvcHMuY29udGV4dCkge1xuICAgICAgICAgICAgICAgIHRoaXMuc2V0U3RhdGUoeyBvZmZzZXQ6IDAsIGxvYWRNb3JlOiB0cnVlIH0sIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgX3RoaXMyLmxvYWRGb3JQcm9wcyhuZXh0UHJvcHMpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfSwge1xuICAgICAgICBrZXk6ICdyZW5kZXInLFxuICAgICAgICB2YWx1ZTogZnVuY3Rpb24gcmVuZGVyKCkge1xuICAgICAgICAgICAgdmFyIF90aGlzMyA9IHRoaXM7XG5cbiAgICAgICAgICAgIHZhciBjb250ZW50ID0gW107XG4gICAgICAgICAgICB2YXIgX3N0YXRlMiA9IHRoaXMuc3RhdGU7XG4gICAgICAgICAgICB2YXIgZGF0YSA9IF9zdGF0ZTIuZGF0YTtcbiAgICAgICAgICAgIHZhciBsb2FkTW9yZSA9IF9zdGF0ZTIubG9hZE1vcmU7XG4gICAgICAgICAgICB2YXIgbG9hZGluZyA9IF9zdGF0ZTIubG9hZGluZztcbiAgICAgICAgICAgIHZhciBlcnJvciA9IF9zdGF0ZTIuZXJyb3I7XG4gICAgICAgICAgICB2YXIgX3Byb3BzMiA9IHRoaXMucHJvcHM7XG4gICAgICAgICAgICB2YXIgbGlzdENvbnRleHQgPSBfcHJvcHMyLmxpc3RDb250ZXh0O1xuICAgICAgICAgICAgdmFyIGdyb3VwQnlEYXRlID0gX3Byb3BzMi5ncm91cEJ5RGF0ZTtcbiAgICAgICAgICAgIHZhciBkaXNwbGF5Q29udGV4dCA9IF9wcm9wczIuZGlzcGxheUNvbnRleHQ7XG4gICAgICAgICAgICB2YXIgcHlkaW8gPSBfcHJvcHMyLnB5ZGlvO1xuXG4gICAgICAgICAgICB2YXIgcHJldmlvdXNGcm9tID0gdW5kZWZpbmVkO1xuICAgICAgICAgICAgdmFyIGVtcHR5U3RhdGVJY29uID0gXCJtZGkgbWRpLXB1bHNlXCI7XG4gICAgICAgICAgICB2YXIgZW1wdHlTdGF0ZVN0cmluZyA9IGxvYWRpbmcgPyBweWRpby5NZXNzYWdlSGFzaFsnbm90aWZpY2F0aW9uX2NlbnRlci4xNyddIDogcHlkaW8uTWVzc2FnZUhhc2hbJ25vdGlmaWNhdGlvbl9jZW50ZXIuMTgnXTtcbiAgICAgICAgICAgIGlmIChlcnJvcikge1xuICAgICAgICAgICAgICAgIGVtcHR5U3RhdGVTdHJpbmcgPSBlcnJvci5EZXRhaWwgfHwgZXJyb3IubXNnIHx8IGVycm9yO1xuICAgICAgICAgICAgICAgIGVtcHR5U3RhdGVJY29uID0gXCJtZGkgbWRpLWFsZXJ0LWNpcmNsZS1vdXRsaW5lXCI7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoZGF0YSAhPT0gbnVsbCAmJiBkYXRhLml0ZW1zKSB7XG4gICAgICAgICAgICAgICAgZGF0YS5pdGVtcy5mb3JFYWNoKGZ1bmN0aW9uIChhYykge1xuXG4gICAgICAgICAgICAgICAgICAgIHZhciBmcm9tTm93ID0gbW9tZW50KGFjLnVwZGF0ZWQpLmZyb21Ob3coKTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGdyb3VwQnlEYXRlICYmIGZyb21Ob3cgIT09IHByZXZpb3VzRnJvbSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgY29udGVudC5wdXNoKF9yZWFjdDJbJ2RlZmF1bHQnXS5jcmVhdGVFbGVtZW50KFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICdkaXYnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHsgc3R5bGU6IHsgcGFkZGluZzogJzAgMTZweCcsIGZvbnRTaXplOiAxMywgY29sb3I6ICdyZ2JhKDE0NywgMTY4LCAxNzgsIDAuNjcpJywgZm9udFdlaWdodDogNTAwIH0gfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBmcm9tTm93XG4gICAgICAgICAgICAgICAgICAgICAgICApKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBjb250ZW50LnB1c2goX3JlYWN0MlsnZGVmYXVsdCddLmNyZWF0ZUVsZW1lbnQoX0FjdGl2aXR5MlsnZGVmYXVsdCddLCB7IGtleTogYWMuaWQsIGFjdGl2aXR5OiBhYywgbGlzdENvbnRleHQ6IGxpc3RDb250ZXh0LCBvbmVMaW5lcjogZ3JvdXBCeURhdGUsIGRpc3BsYXlDb250ZXh0OiBkaXNwbGF5Q29udGV4dCB9KSk7XG4gICAgICAgICAgICAgICAgICAgIGlmIChncm91cEJ5RGF0ZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcHJldmlvdXNGcm9tID0gZnJvbU5vdztcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKGNvbnRlbnQubGVuZ3RoICYmIGxvYWRNb3JlKSB7XG4gICAgICAgICAgICAgICAgdmFyIGxvYWRBY3Rpb24gPSBmdW5jdGlvbiBsb2FkQWN0aW9uKCkge1xuICAgICAgICAgICAgICAgICAgICBfdGhpczMuc2V0U3RhdGUoeyBvZmZzZXQ6IGRhdGEuaXRlbXMubGVuZ3RoICsgMSB9LCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBfdGhpczMubG9hZEZvclByb3BzKF90aGlzMy5wcm9wcyk7XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgY29udGVudC5wdXNoKF9yZWFjdDJbJ2RlZmF1bHQnXS5jcmVhdGVFbGVtZW50KFxuICAgICAgICAgICAgICAgICAgICAnZGl2JyxcbiAgICAgICAgICAgICAgICAgICAgeyBzdHlsZTogeyBwYWRkaW5nTGVmdDogMTYgfSB9LFxuICAgICAgICAgICAgICAgICAgICBfcmVhY3QyWydkZWZhdWx0J10uY3JlYXRlRWxlbWVudChfbWF0ZXJpYWxVaS5GbGF0QnV0dG9uLCB7IHByaW1hcnk6IHRydWUsIGxhYmVsOiBsb2FkaW5nID8gcHlkaW8uTWVzc2FnZUhhc2hbJ25vdGlmaWNhdGlvbl9jZW50ZXIuMjAnXSA6IHB5ZGlvLk1lc3NhZ2VIYXNoWydub3RpZmljYXRpb25fY2VudGVyLjE5J10sIGRpc2FibGVkOiBsb2FkaW5nLCBvblRvdWNoVGFwOiBsb2FkQWN0aW9uIH0pXG4gICAgICAgICAgICAgICAgKSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoY29udGVudC5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gX3JlYWN0MlsnZGVmYXVsdCddLmNyZWF0ZUVsZW1lbnQoXG4gICAgICAgICAgICAgICAgICAgIF9tYXRlcmlhbFVpLkxpc3QsXG4gICAgICAgICAgICAgICAgICAgIHsgc3R5bGU6IHRoaXMucHJvcHMuc3R5bGUgfSxcbiAgICAgICAgICAgICAgICAgICAgY29udGVudFxuICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHZhciBzdHlsZSA9IHsgYmFja2dyb3VuZENvbG9yOiAndHJhbnNwYXJlbnQnIH07XG4gICAgICAgICAgICAgICAgdmFyIGljb25TdHlsZSA9IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICAgICAgbGVnZW5kU3R5bGUgPSB1bmRlZmluZWQ7XG4gICAgICAgICAgICAgICAgaWYgKGRpc3BsYXlDb250ZXh0ID09PSAncG9wb3ZlcicpIHtcbiAgICAgICAgICAgICAgICAgICAgc3R5bGUgPSBfZXh0ZW5kcyh7fSwgc3R5bGUsIHsgbWluSGVpZ2h0OiAyNTAgfSk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmIChkaXNwbGF5Q29udGV4dCA9PT0gJ2luZm9QYW5lbCcpIHtcbiAgICAgICAgICAgICAgICAgICAgc3R5bGUgPSBfZXh0ZW5kcyh7fSwgc3R5bGUsIHsgcGFkZGluZ0JvdHRvbTogMjAgfSk7XG4gICAgICAgICAgICAgICAgICAgIGljb25TdHlsZSA9IHsgZm9udFNpemU6IDQwIH07XG4gICAgICAgICAgICAgICAgICAgIGxlZ2VuZFN0eWxlID0geyBmb250U2l6ZTogMTMsIGZvbnRXZWlnaHQ6IDQwMCB9O1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICByZXR1cm4gX3JlYWN0MlsnZGVmYXVsdCddLmNyZWF0ZUVsZW1lbnQoRW1wdHlTdGF0ZVZpZXcsIHtcbiAgICAgICAgICAgICAgICAgICAgcHlkaW86IHRoaXMucHJvcHMucHlkaW8sXG4gICAgICAgICAgICAgICAgICAgIGljb25DbGFzc05hbWU6IGVtcHR5U3RhdGVJY29uLFxuICAgICAgICAgICAgICAgICAgICBwcmltYXJ5VGV4dElkOiBlbXB0eVN0YXRlU3RyaW5nLFxuICAgICAgICAgICAgICAgICAgICBzdHlsZTogc3R5bGUsXG4gICAgICAgICAgICAgICAgICAgIGljb25TdHlsZTogaWNvblN0eWxlLFxuICAgICAgICAgICAgICAgICAgICBsZWdlbmRTdHlsZTogbGVnZW5kU3R5bGVcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1dKTtcblxuICAgIHJldHVybiBBY3Rpdml0eUxpc3Q7XG59KShfcmVhY3QyWydkZWZhdWx0J10uQ29tcG9uZW50KTtcblxuQWN0aXZpdHlMaXN0LlByb3BUeXBlcyA9IHtcbiAgICBjb250ZXh0OiBfcmVhY3QyWydkZWZhdWx0J10uUHJvcFR5cGVzLnN0cmluZyxcbiAgICBjb250ZXh0RGF0YTogX3JlYWN0MlsnZGVmYXVsdCddLlByb3BUeXBlcy5zdHJpbmcsXG4gICAgYm94TmFtZTogX3JlYWN0MlsnZGVmYXVsdCddLlByb3BUeXBlcy5zdHJpbmcsXG4gICAgcG9pbnRPZlZpZXc6IF9yZWFjdDJbJ2RlZmF1bHQnXS5Qcm9wVHlwZXMub25lT2YoWydHRU5FUklDJywgJ0FDVE9SJywgJ1NVQkpFQ1QnXSksXG4gICAgZGlzcGxheUNvbnRleHQ6IF9yZWFjdDJbJ2RlZmF1bHQnXS5Qcm9wVHlwZXMub25lT2YoWydtYWluTGlzdCcsICdpbmZvUGFuZWwnLCAncG9wb3ZlciddKVxufTtcblxuZXhwb3J0c1snZGVmYXVsdCddID0gQWN0aXZpdHlMaXN0ID0gUHlkaW9Db250ZXh0Q29uc3VtZXIoQWN0aXZpdHlMaXN0KTtcbmV4cG9ydHNbJ2RlZmF1bHQnXSA9IEFjdGl2aXR5TGlzdDtcbm1vZHVsZS5leHBvcnRzID0gZXhwb3J0c1snZGVmYXVsdCddO1xuIiwiLypcbiAqIENvcHlyaWdodCAyMDA3LTIwMTggQ2hhcmxlcyBkdSBKZXUgLSBBYnN0cml1bSBTQVMgPHRlYW0gKGF0KSBweWQuaW8+XG4gKiBUaGlzIGZpbGUgaXMgcGFydCBvZiBQeWRpby5cbiAqXG4gKiBQeWRpbyBpcyBmcmVlIHNvZnR3YXJlOiB5b3UgY2FuIHJlZGlzdHJpYnV0ZSBpdCBhbmQvb3IgbW9kaWZ5XG4gKiBpdCB1bmRlciB0aGUgdGVybXMgb2YgdGhlIEdOVSBBZmZlcm8gR2VuZXJhbCBQdWJsaWMgTGljZW5zZSBhcyBwdWJsaXNoZWQgYnlcbiAqIHRoZSBGcmVlIFNvZnR3YXJlIEZvdW5kYXRpb24sIGVpdGhlciB2ZXJzaW9uIDMgb2YgdGhlIExpY2Vuc2UsIG9yXG4gKiAoYXQgeW91ciBvcHRpb24pIGFueSBsYXRlciB2ZXJzaW9uLlxuICpcbiAqIFB5ZGlvIGlzIGRpc3RyaWJ1dGVkIGluIHRoZSBob3BlIHRoYXQgaXQgd2lsbCBiZSB1c2VmdWwsXG4gKiBidXQgV0lUSE9VVCBBTlkgV0FSUkFOVFk7IHdpdGhvdXQgZXZlbiB0aGUgaW1wbGllZCB3YXJyYW50eSBvZlxuICogTUVSQ0hBTlRBQklMSVRZIG9yIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFLiAgU2VlIHRoZVxuICogR05VIEFmZmVybyBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlIGZvciBtb3JlIGRldGFpbHMuXG4gKlxuICogWW91IHNob3VsZCBoYXZlIHJlY2VpdmVkIGEgY29weSBvZiB0aGUgR05VIEFmZmVybyBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlXG4gKiBhbG9uZyB3aXRoIFB5ZGlvLiAgSWYgbm90LCBzZWUgPGh0dHA6Ly93d3cuZ251Lm9yZy9saWNlbnNlcy8+LlxuICpcbiAqIFRoZSBsYXRlc3QgY29kZSBjYW4gYmUgZm91bmQgYXQgPGh0dHBzOi8vcHlkaW8uY29tPi5cbiAqL1xuJ3VzZSBzdHJpY3QnO1xuXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7XG4gICAgdmFsdWU6IHRydWVcbn0pO1xuXG52YXIgX2NyZWF0ZUNsYXNzID0gKGZ1bmN0aW9uICgpIHsgZnVuY3Rpb24gZGVmaW5lUHJvcGVydGllcyh0YXJnZXQsIHByb3BzKSB7IGZvciAodmFyIGkgPSAwOyBpIDwgcHJvcHMubGVuZ3RoOyBpKyspIHsgdmFyIGRlc2NyaXB0b3IgPSBwcm9wc1tpXTsgZGVzY3JpcHRvci5lbnVtZXJhYmxlID0gZGVzY3JpcHRvci5lbnVtZXJhYmxlIHx8IGZhbHNlOyBkZXNjcmlwdG9yLmNvbmZpZ3VyYWJsZSA9IHRydWU7IGlmICgndmFsdWUnIGluIGRlc2NyaXB0b3IpIGRlc2NyaXB0b3Iud3JpdGFibGUgPSB0cnVlOyBPYmplY3QuZGVmaW5lUHJvcGVydHkodGFyZ2V0LCBkZXNjcmlwdG9yLmtleSwgZGVzY3JpcHRvcik7IH0gfSByZXR1cm4gZnVuY3Rpb24gKENvbnN0cnVjdG9yLCBwcm90b1Byb3BzLCBzdGF0aWNQcm9wcykgeyBpZiAocHJvdG9Qcm9wcykgZGVmaW5lUHJvcGVydGllcyhDb25zdHJ1Y3Rvci5wcm90b3R5cGUsIHByb3RvUHJvcHMpOyBpZiAoc3RhdGljUHJvcHMpIGRlZmluZVByb3BlcnRpZXMoQ29uc3RydWN0b3IsIHN0YXRpY1Byb3BzKTsgcmV0dXJuIENvbnN0cnVjdG9yOyB9OyB9KSgpO1xuXG5mdW5jdGlvbiBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KG9iaikgeyByZXR1cm4gb2JqICYmIG9iai5fX2VzTW9kdWxlID8gb2JqIDogeyAnZGVmYXVsdCc6IG9iaiB9OyB9XG5cbmZ1bmN0aW9uIF9jbGFzc0NhbGxDaGVjayhpbnN0YW5jZSwgQ29uc3RydWN0b3IpIHsgaWYgKCEoaW5zdGFuY2UgaW5zdGFuY2VvZiBDb25zdHJ1Y3RvcikpIHsgdGhyb3cgbmV3IFR5cGVFcnJvcignQ2Fubm90IGNhbGwgYSBjbGFzcyBhcyBhIGZ1bmN0aW9uJyk7IH0gfVxuXG52YXIgX3B5ZGlvSHR0cEFwaSA9IHJlcXVpcmUoJ3B5ZGlvL2h0dHAvYXBpJyk7XG5cbnZhciBfcHlkaW9IdHRwQXBpMiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX3B5ZGlvSHR0cEFwaSk7XG5cbnZhciBfcHlkaW9IdHRwUmVzdEFwaSA9IHJlcXVpcmUoJ3B5ZGlvL2h0dHAvcmVzdC1hcGknKTtcblxudmFyIENhbGxiYWNrcyA9IChmdW5jdGlvbiAoKSB7XG4gICAgZnVuY3Rpb24gQ2FsbGJhY2tzKCkge1xuICAgICAgICBfY2xhc3NDYWxsQ2hlY2sodGhpcywgQ2FsbGJhY2tzKTtcbiAgICB9XG5cbiAgICBfY3JlYXRlQ2xhc3MoQ2FsbGJhY2tzLCBudWxsLCBbe1xuICAgICAgICBrZXk6ICd0b2dnbGVXYXRjaCcsXG4gICAgICAgIHZhbHVlOiBmdW5jdGlvbiB0b2dnbGVXYXRjaChtYW5hZ2VyLCBhcmdzKSB7XG5cbiAgICAgICAgICAgIGlmIChhcmdzKSB7XG4gICAgICAgICAgICAgICAgKGZ1bmN0aW9uICgpIHtcblxuICAgICAgICAgICAgICAgICAgICB2YXIgbm9kZSA9IHB5ZGlvLmdldFVzZXJTZWxlY3Rpb24oKS5nZXRVbmlxdWVOb2RlKCk7XG4gICAgICAgICAgICAgICAgICAgIHZhciBub2RlVXVpZCA9IG5vZGUuZ2V0TWV0YWRhdGEoKS5nZXQoJ3V1aWQnKTtcbiAgICAgICAgICAgICAgICAgICAgdmFyIHVzZXJJZCA9IHB5ZGlvLnVzZXIuaWQ7XG4gICAgICAgICAgICAgICAgICAgIHZhciBzdWJzY3JpcHRpb24gPSBuZXcgX3B5ZGlvSHR0cFJlc3RBcGkuQWN0aXZpdHlTdWJzY3JpcHRpb24oKTtcbiAgICAgICAgICAgICAgICAgICAgdmFyIHR5cGUgPSBuZXcgX3B5ZGlvSHR0cFJlc3RBcGkuQWN0aXZpdHlPd25lclR5cGUoKTtcbiAgICAgICAgICAgICAgICAgICAgc3Vic2NyaXB0aW9uLlVzZXJJZCA9IHVzZXJJZDtcbiAgICAgICAgICAgICAgICAgICAgc3Vic2NyaXB0aW9uLk9iamVjdElkID0gbm9kZVV1aWQ7XG4gICAgICAgICAgICAgICAgICAgIHN1YnNjcmlwdGlvbi5PYmplY3RUeXBlID0gdHlwZS5OT0RFO1xuICAgICAgICAgICAgICAgICAgICB2YXIgZXZlbnRzID0gW107XG4gICAgICAgICAgICAgICAgICAgIGlmIChhcmdzID09PSAnd2F0Y2hfY2hhbmdlJyB8fCBhcmdzID09PSAnd2F0Y2hfYm90aCcpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGV2ZW50cy5wdXNoKCdjaGFuZ2UnKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBpZiAoYXJncyA9PT0gJ3dhdGNoX3JlYWQnIHx8IGFyZ3MgPT09ICd3YXRjaF9ib3RoJykge1xuICAgICAgICAgICAgICAgICAgICAgICAgZXZlbnRzLnB1c2goJ3JlYWQnKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBzdWJzY3JpcHRpb24uRXZlbnRzID0gZXZlbnRzO1xuICAgICAgICAgICAgICAgICAgICB2YXIgYXBpID0gbmV3IF9weWRpb0h0dHBSZXN0QXBpLkFjdGl2aXR5U2VydmljZUFwaShfcHlkaW9IdHRwQXBpMlsnZGVmYXVsdCddLmdldFJlc3RDbGllbnQoKSk7XG4gICAgICAgICAgICAgICAgICAgIGFwaS5zdWJzY3JpYmUoc3Vic2NyaXB0aW9uKS50aGVuKGZ1bmN0aW9uIChvdXRTdWIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBvdmVybGF5ID0gbm9kZS5nZXRNZXRhZGF0YSgpLmdldCgnb3ZlcmxheV9jbGFzcycpIHx8ICcnO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGFyZ3MgPT09ICd3YXRjaF9zdG9wJykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5vZGUuZ2V0TWV0YWRhdGEoKVsnZGVsZXRlJ10oJ21ldGFfd2F0Y2hlZCcpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5vZGUuZ2V0TWV0YWRhdGEoKS5zZXQoJ292ZXJsYXlfY2xhc3MnLCBvdmVybGF5LnJlcGxhY2UoJ21kaSBtZGktYmVsbCcsICcnKSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5vZGUuZ2V0TWV0YWRhdGEoKS5zZXQoJ21ldGFfd2F0Y2hlZCcsICdNRVRBXycgKyBhcmdzLnRvVXBwZXJDYXNlKCkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBvdmVybGF5cyA9IG92ZXJsYXkucmVwbGFjZSgnbWRpIG1kaS1iZWxsJywgJycpLnNwbGl0KCcsJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgb3ZlcmxheXMucHVzaCgnbWRpIG1kaS1iZWxsJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbm9kZS5nZXRNZXRhZGF0YSgpLnNldCgnb3ZlcmxheV9jbGFzcycsIG92ZXJsYXlzLmpvaW4oJywnKSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBub2RlLm5vdGlmeSgnbm9kZV9yZXBsYWNlZCcpO1xuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9KSgpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfV0pO1xuXG4gICAgcmV0dXJuIENhbGxiYWNrcztcbn0pKCk7XG5cbmV4cG9ydHNbJ2RlZmF1bHQnXSA9IENhbGxiYWNrcztcbm1vZHVsZS5leHBvcnRzID0gZXhwb3J0c1snZGVmYXVsdCddO1xuIiwiLypcbiAqIENvcHlyaWdodCAyMDA3LTIwMTcgQ2hhcmxlcyBkdSBKZXUgLSBBYnN0cml1bSBTQVMgPHRlYW0gKGF0KSBweWQuaW8+XG4gKiBUaGlzIGZpbGUgaXMgcGFydCBvZiBQeWRpby5cbiAqXG4gKiBQeWRpbyBpcyBmcmVlIHNvZnR3YXJlOiB5b3UgY2FuIHJlZGlzdHJpYnV0ZSBpdCBhbmQvb3IgbW9kaWZ5XG4gKiBpdCB1bmRlciB0aGUgdGVybXMgb2YgdGhlIEdOVSBBZmZlcm8gR2VuZXJhbCBQdWJsaWMgTGljZW5zZSBhcyBwdWJsaXNoZWQgYnlcbiAqIHRoZSBGcmVlIFNvZnR3YXJlIEZvdW5kYXRpb24sIGVpdGhlciB2ZXJzaW9uIDMgb2YgdGhlIExpY2Vuc2UsIG9yXG4gKiAoYXQgeW91ciBvcHRpb24pIGFueSBsYXRlciB2ZXJzaW9uLlxuICpcbiAqIFB5ZGlvIGlzIGRpc3RyaWJ1dGVkIGluIHRoZSBob3BlIHRoYXQgaXQgd2lsbCBiZSB1c2VmdWwsXG4gKiBidXQgV0lUSE9VVCBBTlkgV0FSUkFOVFk7IHdpdGhvdXQgZXZlbiB0aGUgaW1wbGllZCB3YXJyYW50eSBvZlxuICogTUVSQ0hBTlRBQklMSVRZIG9yIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFLiAgU2VlIHRoZVxuICogR05VIEFmZmVybyBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlIGZvciBtb3JlIGRldGFpbHMuXG4gKlxuICogWW91IHNob3VsZCBoYXZlIHJlY2VpdmVkIGEgY29weSBvZiB0aGUgR05VIEFmZmVybyBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlXG4gKiBhbG9uZyB3aXRoIFB5ZGlvLiAgSWYgbm90LCBzZWUgPGh0dHA6Ly93d3cuZ251Lm9yZy9saWNlbnNlcy8+LlxuICpcbiAqIFRoZSBsYXRlc3QgY29kZSBjYW4gYmUgZm91bmQgYXQgPGh0dHBzOi8vcHlkaW8uY29tPi5cbiAqL1xuXG4ndXNlIHN0cmljdCc7XG5cbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHtcbiAgICB2YWx1ZTogdHJ1ZVxufSk7XG5cbnZhciBfY3JlYXRlQ2xhc3MgPSAoZnVuY3Rpb24gKCkgeyBmdW5jdGlvbiBkZWZpbmVQcm9wZXJ0aWVzKHRhcmdldCwgcHJvcHMpIHsgZm9yICh2YXIgaSA9IDA7IGkgPCBwcm9wcy5sZW5ndGg7IGkrKykgeyB2YXIgZGVzY3JpcHRvciA9IHByb3BzW2ldOyBkZXNjcmlwdG9yLmVudW1lcmFibGUgPSBkZXNjcmlwdG9yLmVudW1lcmFibGUgfHwgZmFsc2U7IGRlc2NyaXB0b3IuY29uZmlndXJhYmxlID0gdHJ1ZTsgaWYgKCd2YWx1ZScgaW4gZGVzY3JpcHRvcikgZGVzY3JpcHRvci53cml0YWJsZSA9IHRydWU7IE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0YXJnZXQsIGRlc2NyaXB0b3Iua2V5LCBkZXNjcmlwdG9yKTsgfSB9IHJldHVybiBmdW5jdGlvbiAoQ29uc3RydWN0b3IsIHByb3RvUHJvcHMsIHN0YXRpY1Byb3BzKSB7IGlmIChwcm90b1Byb3BzKSBkZWZpbmVQcm9wZXJ0aWVzKENvbnN0cnVjdG9yLnByb3RvdHlwZSwgcHJvdG9Qcm9wcyk7IGlmIChzdGF0aWNQcm9wcykgZGVmaW5lUHJvcGVydGllcyhDb25zdHJ1Y3Rvciwgc3RhdGljUHJvcHMpOyByZXR1cm4gQ29uc3RydWN0b3I7IH07IH0pKCk7XG5cbmZ1bmN0aW9uIF9pbnRlcm9wUmVxdWlyZURlZmF1bHQob2JqKSB7IHJldHVybiBvYmogJiYgb2JqLl9fZXNNb2R1bGUgPyBvYmogOiB7ICdkZWZhdWx0Jzogb2JqIH07IH1cblxuZnVuY3Rpb24gX2NsYXNzQ2FsbENoZWNrKGluc3RhbmNlLCBDb25zdHJ1Y3RvcikgeyBpZiAoIShpbnN0YW5jZSBpbnN0YW5jZW9mIENvbnN0cnVjdG9yKSkgeyB0aHJvdyBuZXcgVHlwZUVycm9yKCdDYW5ub3QgY2FsbCBhIGNsYXNzIGFzIGEgZnVuY3Rpb24nKTsgfSB9XG5cbnZhciBfcHlkaW8gPSByZXF1aXJlKCdweWRpbycpO1xuXG52YXIgX3B5ZGlvMiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX3B5ZGlvKTtcblxudmFyIF9weWRpb0h0dHBBcGkgPSByZXF1aXJlKCdweWRpby9odHRwL2FwaScpO1xuXG52YXIgX3B5ZGlvSHR0cEFwaTIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9weWRpb0h0dHBBcGkpO1xuXG52YXIgX3B5ZGlvSHR0cFJlc3RBcGkgPSByZXF1aXJlKCdweWRpby9odHRwL3Jlc3QtYXBpJyk7XG5cbnZhciBBUzJDbGllbnQgPSAoZnVuY3Rpb24gKCkge1xuICAgIGZ1bmN0aW9uIEFTMkNsaWVudCgpIHtcbiAgICAgICAgX2NsYXNzQ2FsbENoZWNrKHRoaXMsIEFTMkNsaWVudCk7XG4gICAgfVxuXG4gICAgX2NyZWF0ZUNsYXNzKEFTMkNsaWVudCwgbnVsbCwgW3tcbiAgICAgICAga2V5OiAnbG9hZEFjdGl2aXR5U3RyZWFtcycsXG4gICAgICAgIHZhbHVlOiBmdW5jdGlvbiBsb2FkQWN0aXZpdHlTdHJlYW1zKCkge1xuICAgICAgICAgICAgdmFyIGNvbnRleHQgPSBhcmd1bWVudHMubGVuZ3RoIDw9IDAgfHwgYXJndW1lbnRzWzBdID09PSB1bmRlZmluZWQgPyAnVVNFUl9JRCcgOiBhcmd1bWVudHNbMF07XG4gICAgICAgICAgICB2YXIgY29udGV4dERhdGEgPSBhcmd1bWVudHMubGVuZ3RoIDw9IDEgfHwgYXJndW1lbnRzWzFdID09PSB1bmRlZmluZWQgPyAnJyA6IGFyZ3VtZW50c1sxXTtcbiAgICAgICAgICAgIHZhciBib3hOYW1lID0gYXJndW1lbnRzLmxlbmd0aCA8PSAyIHx8IGFyZ3VtZW50c1syXSA9PT0gdW5kZWZpbmVkID8gJ291dGJveCcgOiBhcmd1bWVudHNbMl07XG4gICAgICAgICAgICB2YXIgcG9pbnRPZlZpZXcgPSBhcmd1bWVudHMubGVuZ3RoIDw9IDMgfHwgYXJndW1lbnRzWzNdID09PSB1bmRlZmluZWQgPyAnJyA6IGFyZ3VtZW50c1szXTtcbiAgICAgICAgICAgIHZhciBvZmZzZXQgPSBhcmd1bWVudHMubGVuZ3RoIDw9IDQgfHwgYXJndW1lbnRzWzRdID09PSB1bmRlZmluZWQgPyAtMSA6IGFyZ3VtZW50c1s0XTtcbiAgICAgICAgICAgIHZhciBsaW1pdCA9IGFyZ3VtZW50cy5sZW5ndGggPD0gNSB8fCBhcmd1bWVudHNbNV0gPT09IHVuZGVmaW5lZCA/IC0xIDogYXJndW1lbnRzWzVdO1xuXG4gICAgICAgICAgICBpZiAoIWNvbnRleHREYXRhKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZShbXSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB2YXIgYXBpID0gbmV3IF9weWRpb0h0dHBSZXN0QXBpLkFjdGl2aXR5U2VydmljZUFwaShfcHlkaW9IdHRwQXBpMlsnZGVmYXVsdCddLmdldFJlc3RDbGllbnQoKSk7XG4gICAgICAgICAgICB2YXIgcmVxID0gbmV3IF9weWRpb0h0dHBSZXN0QXBpLkFjdGl2aXR5U3RyZWFtQWN0aXZpdGllc1JlcXVlc3QoKTtcbiAgICAgICAgICAgIHJlcS5Db250ZXh0ID0gY29udGV4dDtcbiAgICAgICAgICAgIHJlcS5Db250ZXh0RGF0YSA9IGNvbnRleHREYXRhO1xuICAgICAgICAgICAgcmVxLkJveE5hbWUgPSBib3hOYW1lO1xuICAgICAgICAgICAgaWYgKG9mZnNldCA+IC0xKSB7XG4gICAgICAgICAgICAgICAgcmVxLk9mZnNldCA9IG9mZnNldDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChsaW1pdCA+IC0xKSB7XG4gICAgICAgICAgICAgICAgcmVxLkxpbWl0ID0gbGltaXQ7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXEuTGFuZ3VhZ2UgPSBfcHlkaW8yWydkZWZhdWx0J10uZ2V0SW5zdGFuY2UoKS51c2VyLmdldFByZWZlcmVuY2UoXCJsYW5nXCIpIHx8ICcnO1xuICAgICAgICAgICAgaWYgKHBvaW50T2ZWaWV3KSB7XG4gICAgICAgICAgICAgICAgcmVxLlBvaW50T2ZWaWV3ID0gcG9pbnRPZlZpZXc7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gYXBpLnN0cmVhbShyZXEpO1xuICAgICAgICB9XG4gICAgfSwge1xuICAgICAgICBrZXk6ICdVbnJlYWRJbmJveCcsXG4gICAgICAgIHZhbHVlOiBmdW5jdGlvbiBVbnJlYWRJbmJveCh1c2VySWQpIHtcbiAgICAgICAgICAgIHZhciBjYWxsYmFjayA9IGFyZ3VtZW50cy5sZW5ndGggPD0gMSB8fCBhcmd1bWVudHNbMV0gPT09IHVuZGVmaW5lZCA/IGZ1bmN0aW9uIChjb3VudCkge30gOiBhcmd1bWVudHNbMV07XG5cbiAgICAgICAgICAgIHZhciBhcGkgPSBuZXcgX3B5ZGlvSHR0cFJlc3RBcGkuQWN0aXZpdHlTZXJ2aWNlQXBpKF9weWRpb0h0dHBBcGkyWydkZWZhdWx0J10uZ2V0UmVzdENsaWVudCgpKTtcbiAgICAgICAgICAgIHZhciByZXEgPSBuZXcgX3B5ZGlvSHR0cFJlc3RBcGkuQWN0aXZpdHlTdHJlYW1BY3Rpdml0aWVzUmVxdWVzdCgpO1xuICAgICAgICAgICAgcmVxLkNvbnRleHQgPSAnVVNFUl9JRCc7XG4gICAgICAgICAgICByZXEuQ29udGV4dERhdGEgPSB1c2VySWQ7XG4gICAgICAgICAgICByZXEuQm94TmFtZSA9ICdpbmJveCc7XG4gICAgICAgICAgICByZXEuVW5yZWFkQ291bnRPbmx5ID0gdHJ1ZTtcbiAgICAgICAgICAgIHJldHVybiBhcGkuc3RyZWFtKHJlcSkudGhlbihmdW5jdGlvbiAoZGF0YSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBkYXRhLnRvdGFsSXRlbXMgfHwgMDtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgfV0pO1xuXG4gICAgcmV0dXJuIEFTMkNsaWVudDtcbn0pKCk7XG5cbmV4cG9ydHNbJ2RlZmF1bHQnXSA9IEFTMkNsaWVudDtcbm1vZHVsZS5leHBvcnRzID0gZXhwb3J0c1snZGVmYXVsdCddO1xuIiwiLypcbiAqIENvcHlyaWdodCAyMDA3LTIwMTcgQ2hhcmxlcyBkdSBKZXUgLSBBYnN0cml1bSBTQVMgPHRlYW0gKGF0KSBweWQuaW8+XG4gKiBUaGlzIGZpbGUgaXMgcGFydCBvZiBQeWRpby5cbiAqXG4gKiBQeWRpbyBpcyBmcmVlIHNvZnR3YXJlOiB5b3UgY2FuIHJlZGlzdHJpYnV0ZSBpdCBhbmQvb3IgbW9kaWZ5XG4gKiBpdCB1bmRlciB0aGUgdGVybXMgb2YgdGhlIEdOVSBBZmZlcm8gR2VuZXJhbCBQdWJsaWMgTGljZW5zZSBhcyBwdWJsaXNoZWQgYnlcbiAqIHRoZSBGcmVlIFNvZnR3YXJlIEZvdW5kYXRpb24sIGVpdGhlciB2ZXJzaW9uIDMgb2YgdGhlIExpY2Vuc2UsIG9yXG4gKiAoYXQgeW91ciBvcHRpb24pIGFueSBsYXRlciB2ZXJzaW9uLlxuICpcbiAqIFB5ZGlvIGlzIGRpc3RyaWJ1dGVkIGluIHRoZSBob3BlIHRoYXQgaXQgd2lsbCBiZSB1c2VmdWwsXG4gKiBidXQgV0lUSE9VVCBBTlkgV0FSUkFOVFk7IHdpdGhvdXQgZXZlbiB0aGUgaW1wbGllZCB3YXJyYW50eSBvZlxuICogTUVSQ0hBTlRBQklMSVRZIG9yIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFLiAgU2VlIHRoZVxuICogR05VIEFmZmVybyBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlIGZvciBtb3JlIGRldGFpbHMuXG4gKlxuICogWW91IHNob3VsZCBoYXZlIHJlY2VpdmVkIGEgY29weSBvZiB0aGUgR05VIEFmZmVybyBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlXG4gKiBhbG9uZyB3aXRoIFB5ZGlvLiAgSWYgbm90LCBzZWUgPGh0dHA6Ly93d3cuZ251Lm9yZy9saWNlbnNlcy8+LlxuICpcbiAqIFRoZSBsYXRlc3QgY29kZSBjYW4gYmUgZm91bmQgYXQgPGh0dHBzOi8vcHlkaW8uY29tPi5cbiAqL1xuXG4ndXNlIHN0cmljdCc7XG5cbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHtcbiAgICB2YWx1ZTogdHJ1ZVxufSk7XG5cbnZhciBfZXh0ZW5kcyA9IE9iamVjdC5hc3NpZ24gfHwgZnVuY3Rpb24gKHRhcmdldCkgeyBmb3IgKHZhciBpID0gMTsgaSA8IGFyZ3VtZW50cy5sZW5ndGg7IGkrKykgeyB2YXIgc291cmNlID0gYXJndW1lbnRzW2ldOyBmb3IgKHZhciBrZXkgaW4gc291cmNlKSB7IGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwoc291cmNlLCBrZXkpKSB7IHRhcmdldFtrZXldID0gc291cmNlW2tleV07IH0gfSB9IHJldHVybiB0YXJnZXQ7IH07XG5cbnZhciBfY3JlYXRlQ2xhc3MgPSAoZnVuY3Rpb24gKCkgeyBmdW5jdGlvbiBkZWZpbmVQcm9wZXJ0aWVzKHRhcmdldCwgcHJvcHMpIHsgZm9yICh2YXIgaSA9IDA7IGkgPCBwcm9wcy5sZW5ndGg7IGkrKykgeyB2YXIgZGVzY3JpcHRvciA9IHByb3BzW2ldOyBkZXNjcmlwdG9yLmVudW1lcmFibGUgPSBkZXNjcmlwdG9yLmVudW1lcmFibGUgfHwgZmFsc2U7IGRlc2NyaXB0b3IuY29uZmlndXJhYmxlID0gdHJ1ZTsgaWYgKCd2YWx1ZScgaW4gZGVzY3JpcHRvcikgZGVzY3JpcHRvci53cml0YWJsZSA9IHRydWU7IE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0YXJnZXQsIGRlc2NyaXB0b3Iua2V5LCBkZXNjcmlwdG9yKTsgfSB9IHJldHVybiBmdW5jdGlvbiAoQ29uc3RydWN0b3IsIHByb3RvUHJvcHMsIHN0YXRpY1Byb3BzKSB7IGlmIChwcm90b1Byb3BzKSBkZWZpbmVQcm9wZXJ0aWVzKENvbnN0cnVjdG9yLnByb3RvdHlwZSwgcHJvdG9Qcm9wcyk7IGlmIChzdGF0aWNQcm9wcykgZGVmaW5lUHJvcGVydGllcyhDb25zdHJ1Y3Rvciwgc3RhdGljUHJvcHMpOyByZXR1cm4gQ29uc3RydWN0b3I7IH07IH0pKCk7XG5cbnZhciBfZ2V0ID0gZnVuY3Rpb24gZ2V0KF94LCBfeDIsIF94MykgeyB2YXIgX2FnYWluID0gdHJ1ZTsgX2Z1bmN0aW9uOiB3aGlsZSAoX2FnYWluKSB7IHZhciBvYmplY3QgPSBfeCwgcHJvcGVydHkgPSBfeDIsIHJlY2VpdmVyID0gX3gzOyBfYWdhaW4gPSBmYWxzZTsgaWYgKG9iamVjdCA9PT0gbnVsbCkgb2JqZWN0ID0gRnVuY3Rpb24ucHJvdG90eXBlOyB2YXIgZGVzYyA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3Iob2JqZWN0LCBwcm9wZXJ0eSk7IGlmIChkZXNjID09PSB1bmRlZmluZWQpIHsgdmFyIHBhcmVudCA9IE9iamVjdC5nZXRQcm90b3R5cGVPZihvYmplY3QpOyBpZiAocGFyZW50ID09PSBudWxsKSB7IHJldHVybiB1bmRlZmluZWQ7IH0gZWxzZSB7IF94ID0gcGFyZW50OyBfeDIgPSBwcm9wZXJ0eTsgX3gzID0gcmVjZWl2ZXI7IF9hZ2FpbiA9IHRydWU7IGRlc2MgPSBwYXJlbnQgPSB1bmRlZmluZWQ7IGNvbnRpbnVlIF9mdW5jdGlvbjsgfSB9IGVsc2UgaWYgKCd2YWx1ZScgaW4gZGVzYykgeyByZXR1cm4gZGVzYy52YWx1ZTsgfSBlbHNlIHsgdmFyIGdldHRlciA9IGRlc2MuZ2V0OyBpZiAoZ2V0dGVyID09PSB1bmRlZmluZWQpIHsgcmV0dXJuIHVuZGVmaW5lZDsgfSByZXR1cm4gZ2V0dGVyLmNhbGwocmVjZWl2ZXIpOyB9IH0gfTtcblxuZnVuY3Rpb24gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChvYmopIHsgcmV0dXJuIG9iaiAmJiBvYmouX19lc01vZHVsZSA/IG9iaiA6IHsgJ2RlZmF1bHQnOiBvYmogfTsgfVxuXG5mdW5jdGlvbiBfY2xhc3NDYWxsQ2hlY2soaW5zdGFuY2UsIENvbnN0cnVjdG9yKSB7IGlmICghKGluc3RhbmNlIGluc3RhbmNlb2YgQ29uc3RydWN0b3IpKSB7IHRocm93IG5ldyBUeXBlRXJyb3IoJ0Nhbm5vdCBjYWxsIGEgY2xhc3MgYXMgYSBmdW5jdGlvbicpOyB9IH1cblxuZnVuY3Rpb24gX2luaGVyaXRzKHN1YkNsYXNzLCBzdXBlckNsYXNzKSB7IGlmICh0eXBlb2Ygc3VwZXJDbGFzcyAhPT0gJ2Z1bmN0aW9uJyAmJiBzdXBlckNsYXNzICE9PSBudWxsKSB7IHRocm93IG5ldyBUeXBlRXJyb3IoJ1N1cGVyIGV4cHJlc3Npb24gbXVzdCBlaXRoZXIgYmUgbnVsbCBvciBhIGZ1bmN0aW9uLCBub3QgJyArIHR5cGVvZiBzdXBlckNsYXNzKTsgfSBzdWJDbGFzcy5wcm90b3R5cGUgPSBPYmplY3QuY3JlYXRlKHN1cGVyQ2xhc3MgJiYgc3VwZXJDbGFzcy5wcm90b3R5cGUsIHsgY29uc3RydWN0b3I6IHsgdmFsdWU6IHN1YkNsYXNzLCBlbnVtZXJhYmxlOiBmYWxzZSwgd3JpdGFibGU6IHRydWUsIGNvbmZpZ3VyYWJsZTogdHJ1ZSB9IH0pOyBpZiAoc3VwZXJDbGFzcykgT2JqZWN0LnNldFByb3RvdHlwZU9mID8gT2JqZWN0LnNldFByb3RvdHlwZU9mKHN1YkNsYXNzLCBzdXBlckNsYXNzKSA6IHN1YkNsYXNzLl9fcHJvdG9fXyA9IHN1cGVyQ2xhc3M7IH1cblxudmFyIF9yZWFjdCA9IHJlcXVpcmUoJ3JlYWN0Jyk7XG5cbnZhciBfcmVhY3QyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfcmVhY3QpO1xuXG52YXIgX3JlcXVpcmUgPSByZXF1aXJlKCdtYXRlcmlhbC11aScpO1xuXG52YXIgUG9wb3ZlciA9IF9yZXF1aXJlLlBvcG92ZXI7XG52YXIgUGFwZXIgPSBfcmVxdWlyZS5QYXBlcjtcbnZhciBJY29uQnV0dG9uID0gX3JlcXVpcmUuSWNvbkJ1dHRvbjtcbnZhciBGbGF0QnV0dG9uID0gX3JlcXVpcmUuRmxhdEJ1dHRvbjtcbnZhciBEaXZpZGVyID0gX3JlcXVpcmUuRGl2aWRlcjtcblxudmFyIFB5ZGlvID0gcmVxdWlyZSgncHlkaW8nKTtcbnZhciBkZWJvdW5jZSA9IHJlcXVpcmUoJ2xvZGFzaC5kZWJvdW5jZScpO1xudmFyIE1ldGFOb2RlUHJvdmlkZXIgPSByZXF1aXJlKCdweWRpby9tb2RlbC9tZXRhLW5vZGUtcHJvdmlkZXInKTtcblxudmFyIF9QeWRpbyRyZXF1aXJlTGliID0gUHlkaW8ucmVxdWlyZUxpYignYm9vdCcpO1xuXG52YXIgUHlkaW9Db250ZXh0Q29uc3VtZXIgPSBfUHlkaW8kcmVxdWlyZUxpYi5QeWRpb0NvbnRleHRDb25zdW1lcjtcblxudmFyIF9QeWRpbyRyZXF1aXJlTGliMiA9IFB5ZGlvLnJlcXVpcmVMaWIoJ3dvcmtzcGFjZXMnKTtcblxudmFyIEZpbGVQcmV2aWV3ID0gX1B5ZGlvJHJlcXVpcmVMaWIyLkZpbGVQcmV2aWV3O1xuXG5mdW5jdGlvbiBub2Rlc0Zyb21PYmplY3Qob2JqZWN0LCBweWRpbykge1xuICAgIHZhciBub2RlcyA9IFtdO1xuICAgIHZhciBjdXJyZW50UmVwb3NpdG9yeSA9IHB5ZGlvLnVzZXIuZ2V0QWN0aXZlUmVwb3NpdG9yeSgpO1xuICAgIGlmICghb2JqZWN0LnBhcnRPZiB8fCAhb2JqZWN0LnBhcnRPZi5pdGVtcyB8fCAhb2JqZWN0LnBhcnRPZi5pdGVtcy5sZW5ndGgpIHtcbiAgICAgICAgcmV0dXJuIG5vZGVzO1xuICAgIH1cbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IG9iamVjdC5wYXJ0T2YuaXRlbXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgdmFyIHdzID0gb2JqZWN0LnBhcnRPZi5pdGVtc1tpXTtcbiAgICAgICAgLy8gUmVtb3ZlIHNsdWcgcGFydFxuICAgICAgICB2YXIgcGF0aHMgPSB3cy5yZWwuc3BsaXQoJy8nKTtcbiAgICAgICAgcGF0aHMuc2hpZnQoKTtcbiAgICAgICAgdmFyIHJlbFBhdGggPSBwYXRocy5qb2luKCcvJyk7XG4gICAgICAgIHZhciBub2RlID0gbmV3IEFqeHBOb2RlKHJlbFBhdGgsIG9iamVjdC50eXBlID09PSAnRG9jdW1lbnQnKTtcbiAgICAgICAgbm9kZS5nZXRNZXRhZGF0YSgpLnNldCgncmVwb3NpdG9yeV9pZCcsIHdzLmlkKTtcbiAgICAgICAgbm9kZS5nZXRNZXRhZGF0YSgpLnNldCgncmVwb3NpdG9yeV9sYWJlbCcsIHdzLm5hbWUpO1xuICAgICAgICBpZiAod3MuaWQgPT09IGN1cnJlbnRSZXBvc2l0b3J5KSB7XG4gICAgICAgICAgICByZXR1cm4gW25vZGVdO1xuICAgICAgICB9XG4gICAgICAgIG5vZGVzLnB1c2gobm9kZSk7XG4gICAgfVxuICAgIHJldHVybiBub2Rlcztcbn1cblxudmFyIERvY1ByZXZpZXcgPSAoZnVuY3Rpb24gKF9SZWFjdCRDb21wb25lbnQpIHtcbiAgICBfaW5oZXJpdHMoRG9jUHJldmlldywgX1JlYWN0JENvbXBvbmVudCk7XG5cbiAgICBmdW5jdGlvbiBEb2NQcmV2aWV3KHByb3BzKSB7XG4gICAgICAgIF9jbGFzc0NhbGxDaGVjayh0aGlzLCBEb2NQcmV2aWV3KTtcblxuICAgICAgICBfZ2V0KE9iamVjdC5nZXRQcm90b3R5cGVPZihEb2NQcmV2aWV3LnByb3RvdHlwZSksICdjb25zdHJ1Y3RvcicsIHRoaXMpLmNhbGwodGhpcywgcHJvcHMpO1xuICAgICAgICB2YXIgbm9kZXMgPSBub2Rlc0Zyb21PYmplY3QocHJvcHMuYWN0aXZpdHkub2JqZWN0LCBwcm9wcy5weWRpbyk7XG4gICAgICAgIGlmIChub2Rlcy5sZW5ndGggJiYgIW5vZGVzWzBdLmlzTGVhZigpKSB7XG4gICAgICAgICAgICB0aGlzLnN0YXRlID0ge1xuICAgICAgICAgICAgICAgIHByZXZpZXdMb2FkZWQ6IHRydWUsXG4gICAgICAgICAgICAgICAgcHJldmlld0ZhaWxlZDogZmFsc2UsXG4gICAgICAgICAgICAgICAgbm9kZXM6IG5vZGVzXG4gICAgICAgICAgICB9O1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5zdGF0ZSA9IHtcbiAgICAgICAgICAgICAgICBwcmV2aWV3TG9hZGVkOiBmYWxzZSxcbiAgICAgICAgICAgICAgICBwcmV2aWV3RmFpbGVkOiBmYWxzZSxcbiAgICAgICAgICAgICAgICBub2Rlczogbm9kZXNcbiAgICAgICAgICAgIH07XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBfY3JlYXRlQ2xhc3MoRG9jUHJldmlldywgW3tcbiAgICAgICAga2V5OiAncmVuZGVyJyxcbiAgICAgICAgdmFsdWU6IGZ1bmN0aW9uIHJlbmRlcigpIHtcbiAgICAgICAgICAgIHZhciBfdGhpcyA9IHRoaXM7XG5cbiAgICAgICAgICAgIHZhciBweWRpbyA9IHRoaXMucHJvcHMucHlkaW87XG4gICAgICAgICAgICB2YXIgX3N0YXRlID0gdGhpcy5zdGF0ZTtcbiAgICAgICAgICAgIHZhciBwcmV2aWV3TG9hZGVkID0gX3N0YXRlLnByZXZpZXdMb2FkZWQ7XG4gICAgICAgICAgICB2YXIgbm9kZXMgPSBfc3RhdGUubm9kZXM7XG4gICAgICAgICAgICB2YXIgcHJldmlld0ZhaWxlZCA9IF9zdGF0ZS5wcmV2aWV3RmFpbGVkO1xuXG4gICAgICAgICAgICB2YXIgcHJldmlld05vZGUgPSBub2Rlcy5sZW5ndGggPyBub2Rlc1swXSA6IG51bGw7XG4gICAgICAgICAgICB2YXIgZlByZXZpZXcgPSB1bmRlZmluZWQ7XG4gICAgICAgICAgICB2YXIgZlByZXZpZXdMb2FkaW5nID0gdW5kZWZpbmVkO1xuICAgICAgICAgICAgdmFyIGZQcmV2aWV3U3R5bGUgPSB7XG4gICAgICAgICAgICAgICAgaGVpZ2h0OiAyMDAsIGRpc3BsYXk6ICdmbGV4JywgYWxpZ25JdGVtczogJ2NlbnRlcicsIGp1c3RpZnlDb250ZW50OiAnY2VudGVyJywgZm9udFNpemU6IDcwXG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgaWYgKHByZXZpZXdOb2RlICYmIHByZXZpZXdOb2RlLmlzTGVhZigpKSB7XG4gICAgICAgICAgICAgICAgaWYgKHByZXZpZXdMb2FkZWQgJiYgIXByZXZpZXdGYWlsZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgZlByZXZpZXcgPSBfcmVhY3QyWydkZWZhdWx0J10uY3JlYXRlRWxlbWVudChGaWxlUHJldmlldywgeyBzdHlsZTogZlByZXZpZXdTdHlsZSxcbiAgICAgICAgICAgICAgICAgICAgICAgIG5vZGU6IHByZXZpZXdOb2RlLCBweWRpbzogcHlkaW8sIGxvYWRUaHVtYm5haWw6IHRydWUsXG4gICAgICAgICAgICAgICAgICAgICAgICByaWNoUHJldmlldzogdHJ1ZSwgcHJvY2Vzc2luZzogIXByZXZpZXdMb2FkZWQgfSk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmIChwcmV2aWV3TG9hZGVkICYmIHByZXZpZXdGYWlsZWQpIHtcblxuICAgICAgICAgICAgICAgICAgICBmUHJldmlldyA9IF9yZWFjdDJbJ2RlZmF1bHQnXS5jcmVhdGVFbGVtZW50KFxuICAgICAgICAgICAgICAgICAgICAgICAgJ2RpdicsXG4gICAgICAgICAgICAgICAgICAgICAgICB7IHN0eWxlOiBfZXh0ZW5kcyh7fSwgZlByZXZpZXdTdHlsZSwgeyBmbGV4RGlyZWN0aW9uOiAnY29sdW1uJyB9KSwgY2xhc3NOYW1lOiAnbWltZWZvbnQtY29udGFpbmVyJyB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgX3JlYWN0MlsnZGVmYXVsdCddLmNyZWF0ZUVsZW1lbnQoJ2RpdicsIHsgY2xhc3NOYW1lOiAnbWltZWZvbnQgbWRpIG1kaS1kZWxldGUnIH0pLFxuICAgICAgICAgICAgICAgICAgICAgICAgX3JlYWN0MlsnZGVmYXVsdCddLmNyZWF0ZUVsZW1lbnQoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJ3NwYW4nLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHsgc3R5bGU6IHsgZm9udFNpemU6IDEzIH0gfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAnRmlsZSBkZWxldGVkJ1xuICAgICAgICAgICAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgbm9kZVJlcG9JZCA9IHByZXZpZXdOb2RlLmdldE1ldGFkYXRhKCkuZ2V0KCdyZXBvc2l0b3J5X2lkJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgbm9kZVJlcG9MYWJlbCA9IHByZXZpZXdOb2RlLmdldE1ldGFkYXRhKCkuZ2V0KCdyZXBvc2l0b3J5X2xhYmVsJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgcHJvdmlkZXIgPSBuZXcgTWV0YU5vZGVQcm92aWRlcigpO1xuICAgICAgICAgICAgICAgICAgICAgICAgcHJldmlld05vZGUub2JzZXJ2ZU9uY2UoJ2Vycm9yJywgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIF90aGlzLnNldFN0YXRlKHsgcHJldmlld0xvYWRlZDogdHJ1ZSwgcHJldmlld0ZhaWxlZDogdHJ1ZSB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgcHJvdmlkZXIubG9hZExlYWZOb2RlU3luYyhwcmV2aWV3Tm9kZSwgZnVuY3Rpb24gKGxvYWRlZE5vZGUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsb2FkZWROb2RlLmdldE1ldGFkYXRhKCkuc2V0KCdyZXBvc2l0b3J5X2lkJywgbm9kZVJlcG9JZCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbG9hZGVkTm9kZS5nZXRNZXRhZGF0YSgpLnNldCgncmVwb3NpdG9yeV9sYWJlbCcsIG5vZGVSZXBvTGFiZWwpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5vZGVzWzBdID0gbG9hZGVkTm9kZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBfdGhpcy5zZXRTdGF0ZSh7IHByZXZpZXdMb2FkZWQ6IHRydWUsIG5vZGVzOiBub2RlcyB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sIHRydWUsIHsgdG1wX3JlcG9zaXRvcnlfaWQ6IG5vZGVSZXBvSWQgfSk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIGZQcmV2aWV3TG9hZGluZyA9IF9yZWFjdDJbJ2RlZmF1bHQnXS5jcmVhdGVFbGVtZW50KEZpbGVQcmV2aWV3LCB7IHN0eWxlOiBmUHJldmlld1N0eWxlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5vZGU6IHByZXZpZXdOb2RlLCBweWRpbzogcHlkaW8sIGxvYWRUaHVtYm5haWw6IGZhbHNlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJpY2hQcmV2aWV3OiBmYWxzZSwgcHJvY2Vzc2luZzogdHJ1ZSB9KTtcbiAgICAgICAgICAgICAgICAgICAgfSkoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHZhciBidXR0b25zID0gW107XG4gICAgICAgICAgICB2YXIgY3VycmVudFJlcG9CdXR0b24gPSB1bmRlZmluZWQ7XG4gICAgICAgICAgICB2YXIgY3VycmVudFJlcG9zaXRvcnkgPSBweWRpby51c2VyLmdldEFjdGl2ZVJlcG9zaXRvcnkoKTtcblxuICAgICAgICAgICAgdmFyIF9sb29wID0gZnVuY3Rpb24gKGkpIHtcbiAgICAgICAgICAgICAgICB2YXIgbm9kZSA9IG5vZGVzW2ldO1xuICAgICAgICAgICAgICAgIHZhciBidXR0b24gPSBfcmVhY3QyWydkZWZhdWx0J10uY3JlYXRlRWxlbWVudChcbiAgICAgICAgICAgICAgICAgICAgJ2RpdicsXG4gICAgICAgICAgICAgICAgICAgIHsgc3R5bGU6IHsgZGlzcGxheTogJ2ZsZXgnLCBhbGlnbkl0ZW1zOiAnY2VudGVyJywgcGFkZGluZ0xlZnQ6IDEwIH0gfSxcbiAgICAgICAgICAgICAgICAgICAgX3JlYWN0MlsnZGVmYXVsdCddLmNyZWF0ZUVsZW1lbnQoXG4gICAgICAgICAgICAgICAgICAgICAgICAnZGl2JyxcbiAgICAgICAgICAgICAgICAgICAgICAgIHsgc3R5bGU6IHsgZmxleDogMSwgZm9udFNpemU6IDEzLCBmb250V2VpZ2h0OiA1MDAsIGNvbG9yOiAncmdiYSgwLDAsMCwwLjMzKScgfSB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgcHlkaW8uTWVzc2FnZUhhc2hbJ25vdGlmaWNhdGlvbl9jZW50ZXIuMTYnXSxcbiAgICAgICAgICAgICAgICAgICAgICAgICcgJyxcbiAgICAgICAgICAgICAgICAgICAgICAgIG5vZGUuZ2V0TWV0YWRhdGEoKS5nZXQoJ3JlcG9zaXRvcnlfbGFiZWwnKVxuICAgICAgICAgICAgICAgICAgICApLFxuICAgICAgICAgICAgICAgICAgICBfcmVhY3QyWydkZWZhdWx0J10uY3JlYXRlRWxlbWVudChJY29uQnV0dG9uLCB7IGljb25DbGFzc05hbWU6IFwibWRpIG1kaS1vcGVuLWluLW5ld1wiLCB0b29sdGlwOiBweWRpby5NZXNzYWdlSGFzaFsnbm90aWZpY2F0aW9uX2NlbnRlci42J10sIHRvb2x0aXBQb3NpdGlvbjogXCJ0b3AtY2VudGVyXCIsIG9uQ2xpY2s6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBweWRpby5nb1RvKG5vZGUpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSB9KVxuICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgaWYgKG5vZGUuZ2V0TWV0YWRhdGEoKS5nZXQoJ3JlcG9zaXRvcnlfaWQnKSA9PT0gY3VycmVudFJlcG9zaXRvcnkpIHtcbiAgICAgICAgICAgICAgICAgICAgY3VycmVudFJlcG9CdXR0b24gPSBfcmVhY3QyWydkZWZhdWx0J10uY3JlYXRlRWxlbWVudChcbiAgICAgICAgICAgICAgICAgICAgICAgICdkaXYnLFxuICAgICAgICAgICAgICAgICAgICAgICAgeyBzdHlsZTogeyBkaXNwbGF5OiAnZmxleCcsIGFsaWduSXRlbXM6ICdjZW50ZXInIH0gfSxcbiAgICAgICAgICAgICAgICAgICAgICAgIF9yZWFjdDJbJ2RlZmF1bHQnXS5jcmVhdGVFbGVtZW50KCdzcGFuJywgeyBzdHlsZTogeyBmbGV4OiAxIH0gfSksXG4gICAgICAgICAgICAgICAgICAgICAgICAnICcsXG4gICAgICAgICAgICAgICAgICAgICAgICBfcmVhY3QyWydkZWZhdWx0J10uY3JlYXRlRWxlbWVudChGbGF0QnV0dG9uLCB7IGxhYmVsOiBweWRpby5NZXNzYWdlSGFzaFsnbm90aWZpY2F0aW9uX2NlbnRlci42J10sIGljb25DbGFzc05hbWU6IFwibWRpIG1kaS1vcGVuLWluLW5ld1wiLCB0b29sdGlwOiAnT3BlbicsIHRvb2x0aXBQb3NpdGlvbjogXCJ0b3AtcmlnaHRcIiwgb25DbGljazogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBweWRpby5nb1RvKG5vZGUpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gfSlcbiAgICAgICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuICdicmVhayc7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGJ1dHRvbnMucHVzaChidXR0b24pO1xuICAgICAgICAgICAgICAgIGlmIChpIDwgbm9kZXMubGVuZ3RoIC0gMSkge1xuICAgICAgICAgICAgICAgICAgICBidXR0b25zLnB1c2goX3JlYWN0MlsnZGVmYXVsdCddLmNyZWF0ZUVsZW1lbnQoRGl2aWRlciwgbnVsbCkpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbm9kZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICB2YXIgX3JldDIgPSBfbG9vcChpKTtcblxuICAgICAgICAgICAgICAgIGlmIChfcmV0MiA9PT0gJ2JyZWFrJykgYnJlYWs7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoY3VycmVudFJlcG9CdXR0b24pIHtcbiAgICAgICAgICAgICAgICBidXR0b25zID0gW2N1cnJlbnRSZXBvQnV0dG9uXTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIF9yZWFjdDJbJ2RlZmF1bHQnXS5jcmVhdGVFbGVtZW50KFxuICAgICAgICAgICAgICAgICdkaXYnLFxuICAgICAgICAgICAgICAgIG51bGwsXG4gICAgICAgICAgICAgICAgIXByZXZpZXdGYWlsZWQgJiYgX3JlYWN0MlsnZGVmYXVsdCddLmNyZWF0ZUVsZW1lbnQoXG4gICAgICAgICAgICAgICAgICAgICdkaXYnLFxuICAgICAgICAgICAgICAgICAgICB7IHN0eWxlOiB7IHBhZGRpbmc6IDYgfSB9LFxuICAgICAgICAgICAgICAgICAgICBidXR0b25zXG4gICAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgKTtcbiAgICAgICAgfVxuICAgIH1dKTtcblxuICAgIHJldHVybiBEb2NQcmV2aWV3O1xufSkoX3JlYWN0MlsnZGVmYXVsdCddLkNvbXBvbmVudCk7XG5cbnZhciBEb2NMaW5rID0gKGZ1bmN0aW9uIChfUmVhY3QkQ29tcG9uZW50Mikge1xuICAgIF9pbmhlcml0cyhEb2NMaW5rLCBfUmVhY3QkQ29tcG9uZW50Mik7XG5cbiAgICBmdW5jdGlvbiBEb2NMaW5rKHByb3BzKSB7XG4gICAgICAgIF9jbGFzc0NhbGxDaGVjayh0aGlzLCBEb2NMaW5rKTtcblxuICAgICAgICBfZ2V0KE9iamVjdC5nZXRQcm90b3R5cGVPZihEb2NMaW5rLnByb3RvdHlwZSksICdjb25zdHJ1Y3RvcicsIHRoaXMpLmNhbGwodGhpcywgcHJvcHMpO1xuICAgICAgICB0aGlzLnN0YXRlID0ge1xuICAgICAgICAgICAgc2hvd1BvcG92ZXI6IGZhbHNlLFxuICAgICAgICAgICAgcG9wb3ZlckFuY2hvcjogbnVsbFxuICAgICAgICB9O1xuICAgIH1cblxuICAgIF9jcmVhdGVDbGFzcyhEb2NMaW5rLCBbe1xuICAgICAgICBrZXk6ICdyZW5kZXInLFxuICAgICAgICB2YWx1ZTogZnVuY3Rpb24gcmVuZGVyKCkge1xuICAgICAgICAgICAgdmFyIF90aGlzMiA9IHRoaXM7XG5cbiAgICAgICAgICAgIHZhciBfcHJvcHMgPSB0aGlzLnByb3BzO1xuICAgICAgICAgICAgdmFyIHB5ZGlvID0gX3Byb3BzLnB5ZGlvO1xuICAgICAgICAgICAgdmFyIGFjdGl2aXR5ID0gX3Byb3BzLmFjdGl2aXR5O1xuICAgICAgICAgICAgdmFyIGNoaWxkcmVuID0gX3Byb3BzLmNoaWxkcmVuO1xuXG4gICAgICAgICAgICBpZiAoIWFjdGl2aXR5Lm9iamVjdC5uYW1lKSB7XG4gICAgICAgICAgICAgICAgYWN0aXZpdHkub2JqZWN0Lm5hbWUgPSAnJztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHZhciBub2RlcyA9IG5vZGVzRnJvbU9iamVjdChhY3Rpdml0eS5vYmplY3QsIHB5ZGlvKTtcblxuICAgICAgICAgICAgdmFyIG9uQ2xpY2sgPSB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgb25Nb3VzZU92ZXIgPSB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgb25Nb3VzZU91dCA9IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBwb3BvdmVyID0gdW5kZWZpbmVkO1xuXG4gICAgICAgICAgICB2YXIgcGF0aFBhcnRzID0gYWN0aXZpdHkub2JqZWN0Lm5hbWUucmVwbGFjZSgnZG9jOi8vJywgJycpLnNwbGl0KCcvJyk7XG4gICAgICAgICAgICBwYXRoUGFydHMuc2hpZnQoKTtcbiAgICAgICAgICAgIHZhciB0aXRsZSA9ICcvJyArIHBhdGhQYXJ0cy5qb2luKCcvJyk7XG5cbiAgICAgICAgICAgIGlmIChub2Rlcy5sZW5ndGggPiAxKSB7XG5cbiAgICAgICAgICAgICAgICBvbkNsaWNrID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICBweWRpby5nb1RvKG5vZGVzWzBdKTtcbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgIG9uTW91c2VPdXQgPSBkZWJvdW5jZShmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgIF90aGlzMi5zZXRTdGF0ZSh7IHNob3dQb3BvdmVyOiBmYWxzZSB9KTtcbiAgICAgICAgICAgICAgICB9LCAzNTApO1xuICAgICAgICAgICAgICAgIG9uTW91c2VPdmVyID0gZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgICAgICAgICAgICAgX3RoaXMyLnNldFN0YXRlKHsgc2hvd1BvcG92ZXI6IHRydWUsIHBvcG92ZXJBbmNob3I6IGUuY3VycmVudFRhcmdldCB9KTtcbiAgICAgICAgICAgICAgICAgICAgb25Nb3VzZU91dC5jYW5jZWwoKTtcbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgIHZhciBvbk1vdXNlT3ZlcklubmVyID0gZnVuY3Rpb24gb25Nb3VzZU92ZXJJbm5lcihlKSB7XG4gICAgICAgICAgICAgICAgICAgIF90aGlzMi5zZXRTdGF0ZSh7IHNob3dQb3BvdmVyOiB0cnVlIH0pO1xuICAgICAgICAgICAgICAgICAgICBvbk1vdXNlT3V0LmNhbmNlbCgpO1xuICAgICAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgICAgICBwb3BvdmVyID0gX3JlYWN0MlsnZGVmYXVsdCddLmNyZWF0ZUVsZW1lbnQoXG4gICAgICAgICAgICAgICAgICAgIFBvcG92ZXIsXG4gICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIG9wZW46IHRoaXMuc3RhdGUuc2hvd1BvcG92ZXIsXG4gICAgICAgICAgICAgICAgICAgICAgICBhbmNob3JFbDogdGhpcy5zdGF0ZS5wb3BvdmVyQW5jaG9yLFxuICAgICAgICAgICAgICAgICAgICAgICAgb25SZXF1ZXN0Q2xvc2U6IGZ1bmN0aW9uIChyZWFzb24pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAocmVhc29uICE9PSAnY2xpY2tBd2F5Jykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBfdGhpczIuc2V0U3RhdGUoeyBzaG93UG9wb3ZlcjogZmFsc2UgfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGFuY2hvck9yaWdpbjogeyBob3Jpem9udGFsOiBcImxlZnRcIiwgdmVydGljYWw6IFwiYm90dG9tXCIgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHRhcmdldE9yaWdpbjogeyBob3Jpem9udGFsOiBcImxlZnRcIiwgdmVydGljYWw6IFwidG9wXCIgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHVzZUxheWVyRm9yQ2xpY2tBd2F5OiBmYWxzZVxuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICBfcmVhY3QyWydkZWZhdWx0J10uY3JlYXRlRWxlbWVudChcbiAgICAgICAgICAgICAgICAgICAgICAgIFBhcGVyLFxuICAgICAgICAgICAgICAgICAgICAgICAgeyB6RGVwdGg6IDIsIHN0eWxlOiB7IHdpZHRoOiAyMDAsIGhlaWdodDogJ2F1dG8nLCBvdmVyZmxvd1k6ICdhdXRvJyB9LCBvbk1vdXNlT3Zlcjogb25Nb3VzZU92ZXJJbm5lciwgb25Nb3VzZU91dDogb25Nb3VzZU91dCB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgX3JlYWN0MlsnZGVmYXVsdCddLmNyZWF0ZUVsZW1lbnQoRG9jUHJldmlldywgeyBweWRpbzogcHlkaW8sIGFjdGl2aXR5OiBhY3Rpdml0eSB9KVxuICAgICAgICAgICAgICAgICAgICApXG4gICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAobm9kZXMubGVuZ3RoID09PSAxKSB7XG4gICAgICAgICAgICAgICAgb25DbGljayA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgcHlkaW8uZ29Ubyhub2Rlc1swXSk7XG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIF9yZWFjdDJbJ2RlZmF1bHQnXS5jcmVhdGVFbGVtZW50KFxuICAgICAgICAgICAgICAgICdzcGFuJyxcbiAgICAgICAgICAgICAgICBudWxsLFxuICAgICAgICAgICAgICAgIF9yZWFjdDJbJ2RlZmF1bHQnXS5jcmVhdGVFbGVtZW50KFxuICAgICAgICAgICAgICAgICAgICAnYScsXG4gICAgICAgICAgICAgICAgICAgIHsgdGl0bGU6IHRpdGxlLCBzdHlsZTogeyBjdXJzb3I6ICdwb2ludGVyJywgY29sb3I6ICdyZ2IoNjYsIDE0MCwgMTc5KScgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgIG9uTW91c2VPdmVyOiBvbk1vdXNlT3ZlcixcbiAgICAgICAgICAgICAgICAgICAgICAgIG9uTW91c2VPdXQ6IG9uTW91c2VPdXQsXG4gICAgICAgICAgICAgICAgICAgICAgICBvbkNsaWNrOiBvbkNsaWNrIH0sXG4gICAgICAgICAgICAgICAgICAgIGNoaWxkcmVuXG4gICAgICAgICAgICAgICAgKSxcbiAgICAgICAgICAgICAgICBwb3BvdmVyXG4gICAgICAgICAgICApO1xuICAgICAgICB9XG4gICAgfV0pO1xuXG4gICAgcmV0dXJuIERvY0xpbms7XG59KShfcmVhY3QyWydkZWZhdWx0J10uQ29tcG9uZW50KTtcblxuRG9jTGluay5Qcm9wVHlwZXMgPSB7XG4gICAgYWN0aXZpdHk6IF9yZWFjdDJbJ2RlZmF1bHQnXS5Qcm9wVHlwZXMub2JqZWN0LFxuICAgIHB5ZGlvOiBfcmVhY3QyWydkZWZhdWx0J10uUHJvcFR5cGVzLmluc3RhbmNlT2YoUHlkaW8pXG59O1xuXG5leHBvcnRzWydkZWZhdWx0J10gPSBEb2NMaW5rID0gUHlkaW9Db250ZXh0Q29uc3VtZXIoRG9jTGluayk7XG5leHBvcnRzWydkZWZhdWx0J10gPSBEb2NMaW5rO1xubW9kdWxlLmV4cG9ydHMgPSBleHBvcnRzWydkZWZhdWx0J107XG4iLCIvKlxuICogQ29weXJpZ2h0IDIwMDctMjAxNyBDaGFybGVzIGR1IEpldSAtIEFic3RyaXVtIFNBUyA8dGVhbSAoYXQpIHB5ZC5pbz5cbiAqIFRoaXMgZmlsZSBpcyBwYXJ0IG9mIFB5ZGlvLlxuICpcbiAqIFB5ZGlvIGlzIGZyZWUgc29mdHdhcmU6IHlvdSBjYW4gcmVkaXN0cmlidXRlIGl0IGFuZC9vciBtb2RpZnlcbiAqIGl0IHVuZGVyIHRoZSB0ZXJtcyBvZiB0aGUgR05VIEFmZmVybyBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlIGFzIHB1Ymxpc2hlZCBieVxuICogdGhlIEZyZWUgU29mdHdhcmUgRm91bmRhdGlvbiwgZWl0aGVyIHZlcnNpb24gMyBvZiB0aGUgTGljZW5zZSwgb3JcbiAqIChhdCB5b3VyIG9wdGlvbikgYW55IGxhdGVyIHZlcnNpb24uXG4gKlxuICogUHlkaW8gaXMgZGlzdHJpYnV0ZWQgaW4gdGhlIGhvcGUgdGhhdCBpdCB3aWxsIGJlIHVzZWZ1bCxcbiAqIGJ1dCBXSVRIT1VUIEFOWSBXQVJSQU5UWTsgd2l0aG91dCBldmVuIHRoZSBpbXBsaWVkIHdhcnJhbnR5IG9mXG4gKiBNRVJDSEFOVEFCSUxJVFkgb3IgRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UuICBTZWUgdGhlXG4gKiBHTlUgQWZmZXJvIEdlbmVyYWwgUHVibGljIExpY2Vuc2UgZm9yIG1vcmUgZGV0YWlscy5cbiAqXG4gKiBZb3Ugc2hvdWxkIGhhdmUgcmVjZWl2ZWQgYSBjb3B5IG9mIHRoZSBHTlUgQWZmZXJvIEdlbmVyYWwgUHVibGljIExpY2Vuc2VcbiAqIGFsb25nIHdpdGggUHlkaW8uICBJZiBub3QsIHNlZSA8aHR0cDovL3d3dy5nbnUub3JnL2xpY2Vuc2VzLz4uXG4gKlxuICogVGhlIGxhdGVzdCBjb2RlIGNhbiBiZSBmb3VuZCBhdCA8aHR0cHM6Ly9weWRpby5jb20+LlxuICovXG4ndXNlIHN0cmljdCc7XG5cbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHtcbiAgICB2YWx1ZTogdHJ1ZVxufSk7XG5cbnZhciBfY3JlYXRlQ2xhc3MgPSAoZnVuY3Rpb24gKCkgeyBmdW5jdGlvbiBkZWZpbmVQcm9wZXJ0aWVzKHRhcmdldCwgcHJvcHMpIHsgZm9yICh2YXIgaSA9IDA7IGkgPCBwcm9wcy5sZW5ndGg7IGkrKykgeyB2YXIgZGVzY3JpcHRvciA9IHByb3BzW2ldOyBkZXNjcmlwdG9yLmVudW1lcmFibGUgPSBkZXNjcmlwdG9yLmVudW1lcmFibGUgfHwgZmFsc2U7IGRlc2NyaXB0b3IuY29uZmlndXJhYmxlID0gdHJ1ZTsgaWYgKCd2YWx1ZScgaW4gZGVzY3JpcHRvcikgZGVzY3JpcHRvci53cml0YWJsZSA9IHRydWU7IE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0YXJnZXQsIGRlc2NyaXB0b3Iua2V5LCBkZXNjcmlwdG9yKTsgfSB9IHJldHVybiBmdW5jdGlvbiAoQ29uc3RydWN0b3IsIHByb3RvUHJvcHMsIHN0YXRpY1Byb3BzKSB7IGlmIChwcm90b1Byb3BzKSBkZWZpbmVQcm9wZXJ0aWVzKENvbnN0cnVjdG9yLnByb3RvdHlwZSwgcHJvdG9Qcm9wcyk7IGlmIChzdGF0aWNQcm9wcykgZGVmaW5lUHJvcGVydGllcyhDb25zdHJ1Y3Rvciwgc3RhdGljUHJvcHMpOyByZXR1cm4gQ29uc3RydWN0b3I7IH07IH0pKCk7XG5cbnZhciBfZ2V0ID0gZnVuY3Rpb24gZ2V0KF94LCBfeDIsIF94MykgeyB2YXIgX2FnYWluID0gdHJ1ZTsgX2Z1bmN0aW9uOiB3aGlsZSAoX2FnYWluKSB7IHZhciBvYmplY3QgPSBfeCwgcHJvcGVydHkgPSBfeDIsIHJlY2VpdmVyID0gX3gzOyBfYWdhaW4gPSBmYWxzZTsgaWYgKG9iamVjdCA9PT0gbnVsbCkgb2JqZWN0ID0gRnVuY3Rpb24ucHJvdG90eXBlOyB2YXIgZGVzYyA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3Iob2JqZWN0LCBwcm9wZXJ0eSk7IGlmIChkZXNjID09PSB1bmRlZmluZWQpIHsgdmFyIHBhcmVudCA9IE9iamVjdC5nZXRQcm90b3R5cGVPZihvYmplY3QpOyBpZiAocGFyZW50ID09PSBudWxsKSB7IHJldHVybiB1bmRlZmluZWQ7IH0gZWxzZSB7IF94ID0gcGFyZW50OyBfeDIgPSBwcm9wZXJ0eTsgX3gzID0gcmVjZWl2ZXI7IF9hZ2FpbiA9IHRydWU7IGRlc2MgPSBwYXJlbnQgPSB1bmRlZmluZWQ7IGNvbnRpbnVlIF9mdW5jdGlvbjsgfSB9IGVsc2UgaWYgKCd2YWx1ZScgaW4gZGVzYykgeyByZXR1cm4gZGVzYy52YWx1ZTsgfSBlbHNlIHsgdmFyIGdldHRlciA9IGRlc2MuZ2V0OyBpZiAoZ2V0dGVyID09PSB1bmRlZmluZWQpIHsgcmV0dXJuIHVuZGVmaW5lZDsgfSByZXR1cm4gZ2V0dGVyLmNhbGwocmVjZWl2ZXIpOyB9IH0gfTtcblxuZnVuY3Rpb24gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChvYmopIHsgcmV0dXJuIG9iaiAmJiBvYmouX19lc01vZHVsZSA/IG9iaiA6IHsgJ2RlZmF1bHQnOiBvYmogfTsgfVxuXG5mdW5jdGlvbiBfY2xhc3NDYWxsQ2hlY2soaW5zdGFuY2UsIENvbnN0cnVjdG9yKSB7IGlmICghKGluc3RhbmNlIGluc3RhbmNlb2YgQ29uc3RydWN0b3IpKSB7IHRocm93IG5ldyBUeXBlRXJyb3IoJ0Nhbm5vdCBjYWxsIGEgY2xhc3MgYXMgYSBmdW5jdGlvbicpOyB9IH1cblxuZnVuY3Rpb24gX2luaGVyaXRzKHN1YkNsYXNzLCBzdXBlckNsYXNzKSB7IGlmICh0eXBlb2Ygc3VwZXJDbGFzcyAhPT0gJ2Z1bmN0aW9uJyAmJiBzdXBlckNsYXNzICE9PSBudWxsKSB7IHRocm93IG5ldyBUeXBlRXJyb3IoJ1N1cGVyIGV4cHJlc3Npb24gbXVzdCBlaXRoZXIgYmUgbnVsbCBvciBhIGZ1bmN0aW9uLCBub3QgJyArIHR5cGVvZiBzdXBlckNsYXNzKTsgfSBzdWJDbGFzcy5wcm90b3R5cGUgPSBPYmplY3QuY3JlYXRlKHN1cGVyQ2xhc3MgJiYgc3VwZXJDbGFzcy5wcm90b3R5cGUsIHsgY29uc3RydWN0b3I6IHsgdmFsdWU6IHN1YkNsYXNzLCBlbnVtZXJhYmxlOiBmYWxzZSwgd3JpdGFibGU6IHRydWUsIGNvbmZpZ3VyYWJsZTogdHJ1ZSB9IH0pOyBpZiAoc3VwZXJDbGFzcykgT2JqZWN0LnNldFByb3RvdHlwZU9mID8gT2JqZWN0LnNldFByb3RvdHlwZU9mKHN1YkNsYXNzLCBzdXBlckNsYXNzKSA6IHN1YkNsYXNzLl9fcHJvdG9fXyA9IHN1cGVyQ2xhc3M7IH1cblxudmFyIF9yZWFjdCA9IHJlcXVpcmUoJ3JlYWN0Jyk7XG5cbnZhciBfcmVhY3QyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfcmVhY3QpO1xuXG52YXIgX21hdGVyaWFsVWkgPSByZXF1aXJlKCdtYXRlcmlhbC11aScpO1xuXG52YXIgX0FjdGl2aXR5TGlzdCA9IHJlcXVpcmUoJy4vQWN0aXZpdHlMaXN0Jyk7XG5cbnZhciBfQWN0aXZpdHlMaXN0MiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX0FjdGl2aXR5TGlzdCk7XG5cbnZhciBfUHlkaW8kcmVxdWlyZUxpYiA9IFB5ZGlvLnJlcXVpcmVMaWIoJ2Jvb3QnKTtcblxudmFyIFB5ZGlvQ29udGV4dENvbnN1bWVyID0gX1B5ZGlvJHJlcXVpcmVMaWIuUHlkaW9Db250ZXh0Q29uc3VtZXI7XG5cbnZhciBfUHlkaW8kcmVxdWlyZUxpYjIgPSBQeWRpby5yZXF1aXJlTGliKCd3b3Jrc3BhY2VzJyk7XG5cbnZhciBJbmZvUGFuZWxDYXJkID0gX1B5ZGlvJHJlcXVpcmVMaWIyLkluZm9QYW5lbENhcmQ7XG5cbnZhciBJbmZvUGFuZWwgPSAoZnVuY3Rpb24gKF9SZWFjdCRDb21wb25lbnQpIHtcbiAgICBfaW5oZXJpdHMoSW5mb1BhbmVsLCBfUmVhY3QkQ29tcG9uZW50KTtcblxuICAgIGZ1bmN0aW9uIEluZm9QYW5lbCgpIHtcbiAgICAgICAgX2NsYXNzQ2FsbENoZWNrKHRoaXMsIEluZm9QYW5lbCk7XG5cbiAgICAgICAgX2dldChPYmplY3QuZ2V0UHJvdG90eXBlT2YoSW5mb1BhbmVsLnByb3RvdHlwZSksICdjb25zdHJ1Y3RvcicsIHRoaXMpLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgfVxuXG4gICAgX2NyZWF0ZUNsYXNzKEluZm9QYW5lbCwgW3tcbiAgICAgICAga2V5OiAncmVuZGVyJyxcbiAgICAgICAgdmFsdWU6IGZ1bmN0aW9uIHJlbmRlcigpIHtcbiAgICAgICAgICAgIHZhciBfcHJvcHMgPSB0aGlzLnByb3BzO1xuICAgICAgICAgICAgdmFyIG5vZGUgPSBfcHJvcHMubm9kZTtcbiAgICAgICAgICAgIHZhciBweWRpbyA9IF9wcm9wcy5weWRpbztcblxuICAgICAgICAgICAgaWYgKHB5ZGlvLmdldFBsdWdpbkNvbmZpZ3MoXCJjb3JlLmFjdGl2aXR5c3RyZWFtc1wiKS5nZXQoXCJBQ1RJVklUWV9TSE9XX0FDVElWSVRJRVNcIikgPT09IGZhbHNlKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiBfcmVhY3QyWydkZWZhdWx0J10uY3JlYXRlRWxlbWVudChcbiAgICAgICAgICAgICAgICBJbmZvUGFuZWxDYXJkLFxuICAgICAgICAgICAgICAgIHsgaWRlbnRpZmllcjogXCJhY3Rpdml0eVwiLCB0aXRsZTogbm9kZS5pc0xlYWYoKSA/IHB5ZGlvLk1lc3NhZ2VIYXNoWydub3RpZmljYXRpb25fY2VudGVyLjExJ10gOiBweWRpby5NZXNzYWdlSGFzaFsnbm90aWZpY2F0aW9uX2NlbnRlci4xMCddIH0sXG4gICAgICAgICAgICAgICAgX3JlYWN0MlsnZGVmYXVsdCddLmNyZWF0ZUVsZW1lbnQoX0FjdGl2aXR5TGlzdDJbJ2RlZmF1bHQnXSwge1xuICAgICAgICAgICAgICAgICAgICBjb250ZXh0OiAnTk9ERV9JRCcsXG4gICAgICAgICAgICAgICAgICAgIGNvbnRleHREYXRhOiBub2RlLmdldE1ldGFkYXRhKCkuZ2V0KCd1dWlkJyksXG4gICAgICAgICAgICAgICAgICAgIGJveE5hbWU6ICdvdXRib3gnLFxuICAgICAgICAgICAgICAgICAgICBzdHlsZTogeyBvdmVyZmxvd1k6ICdzY3JvbGwnLCBtYXhIZWlnaHQ6IDM4MCB9LFxuICAgICAgICAgICAgICAgICAgICBsaXN0Q29udGV4dDogXCJOT0RFLVwiICsgKG5vZGUuaXNMZWFmKCkgPyBcIkxFQUZcIiA6IFwiQ09MTEVDVElPTlwiKSxcbiAgICAgICAgICAgICAgICAgICAgcG9pbnRPZlZpZXc6IFwiQUNUT1JcIixcbiAgICAgICAgICAgICAgICAgICAgZGlzcGxheUNvbnRleHQ6ICdpbmZvUGFuZWwnXG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICk7XG4gICAgICAgIH1cbiAgICB9XSk7XG5cbiAgICByZXR1cm4gSW5mb1BhbmVsO1xufSkoX3JlYWN0MlsnZGVmYXVsdCddLkNvbXBvbmVudCk7XG5cbmV4cG9ydHNbJ2RlZmF1bHQnXSA9IEluZm9QYW5lbCA9IFB5ZGlvQ29udGV4dENvbnN1bWVyKEluZm9QYW5lbCk7XG5leHBvcnRzWydkZWZhdWx0J10gPSBJbmZvUGFuZWw7XG5tb2R1bGUuZXhwb3J0cyA9IGV4cG9ydHNbJ2RlZmF1bHQnXTtcbiIsIi8qXG4gKiBDb3B5cmlnaHQgMjAwNy0yMDE4IENoYXJsZXMgZHUgSmV1IC0gQWJzdHJpdW0gU0FTIDx0ZWFtIChhdCkgcHlkLmlvPlxuICogVGhpcyBmaWxlIGlzIHBhcnQgb2YgUHlkaW8uXG4gKlxuICogUHlkaW8gaXMgZnJlZSBzb2Z0d2FyZTogeW91IGNhbiByZWRpc3RyaWJ1dGUgaXQgYW5kL29yIG1vZGlmeVxuICogaXQgdW5kZXIgdGhlIHRlcm1zIG9mIHRoZSBHTlUgQWZmZXJvIEdlbmVyYWwgUHVibGljIExpY2Vuc2UgYXMgcHVibGlzaGVkIGJ5XG4gKiB0aGUgRnJlZSBTb2Z0d2FyZSBGb3VuZGF0aW9uLCBlaXRoZXIgdmVyc2lvbiAzIG9mIHRoZSBMaWNlbnNlLCBvclxuICogKGF0IHlvdXIgb3B0aW9uKSBhbnkgbGF0ZXIgdmVyc2lvbi5cbiAqXG4gKiBQeWRpbyBpcyBkaXN0cmlidXRlZCBpbiB0aGUgaG9wZSB0aGF0IGl0IHdpbGwgYmUgdXNlZnVsLFxuICogYnV0IFdJVEhPVVQgQU5ZIFdBUlJBTlRZOyB3aXRob3V0IGV2ZW4gdGhlIGltcGxpZWQgd2FycmFudHkgb2ZcbiAqIE1FUkNIQU5UQUJJTElUWSBvciBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRS4gIFNlZSB0aGVcbiAqIEdOVSBBZmZlcm8gR2VuZXJhbCBQdWJsaWMgTGljZW5zZSBmb3IgbW9yZSBkZXRhaWxzLlxuICpcbiAqIFlvdSBzaG91bGQgaGF2ZSByZWNlaXZlZCBhIGNvcHkgb2YgdGhlIEdOVSBBZmZlcm8gR2VuZXJhbCBQdWJsaWMgTGljZW5zZVxuICogYWxvbmcgd2l0aCBQeWRpby4gIElmIG5vdCwgc2VlIDxodHRwOi8vd3d3LmdudS5vcmcvbGljZW5zZXMvPi5cbiAqXG4gKiBUaGUgbGF0ZXN0IGNvZGUgY2FuIGJlIGZvdW5kIGF0IDxodHRwczovL3B5ZGlvLmNvbT4uXG4gKi9cblwidXNlIHN0cmljdFwiO1xuXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHtcbiAgICB2YWx1ZTogdHJ1ZVxufSk7XG5cbnZhciBfY3JlYXRlQ2xhc3MgPSAoZnVuY3Rpb24gKCkgeyBmdW5jdGlvbiBkZWZpbmVQcm9wZXJ0aWVzKHRhcmdldCwgcHJvcHMpIHsgZm9yICh2YXIgaSA9IDA7IGkgPCBwcm9wcy5sZW5ndGg7IGkrKykgeyB2YXIgZGVzY3JpcHRvciA9IHByb3BzW2ldOyBkZXNjcmlwdG9yLmVudW1lcmFibGUgPSBkZXNjcmlwdG9yLmVudW1lcmFibGUgfHwgZmFsc2U7IGRlc2NyaXB0b3IuY29uZmlndXJhYmxlID0gdHJ1ZTsgaWYgKFwidmFsdWVcIiBpbiBkZXNjcmlwdG9yKSBkZXNjcmlwdG9yLndyaXRhYmxlID0gdHJ1ZTsgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRhcmdldCwgZGVzY3JpcHRvci5rZXksIGRlc2NyaXB0b3IpOyB9IH0gcmV0dXJuIGZ1bmN0aW9uIChDb25zdHJ1Y3RvciwgcHJvdG9Qcm9wcywgc3RhdGljUHJvcHMpIHsgaWYgKHByb3RvUHJvcHMpIGRlZmluZVByb3BlcnRpZXMoQ29uc3RydWN0b3IucHJvdG90eXBlLCBwcm90b1Byb3BzKTsgaWYgKHN0YXRpY1Byb3BzKSBkZWZpbmVQcm9wZXJ0aWVzKENvbnN0cnVjdG9yLCBzdGF0aWNQcm9wcyk7IHJldHVybiBDb25zdHJ1Y3RvcjsgfTsgfSkoKTtcblxuZnVuY3Rpb24gX2NsYXNzQ2FsbENoZWNrKGluc3RhbmNlLCBDb25zdHJ1Y3RvcikgeyBpZiAoIShpbnN0YW5jZSBpbnN0YW5jZW9mIENvbnN0cnVjdG9yKSkgeyB0aHJvdyBuZXcgVHlwZUVycm9yKFwiQ2Fubm90IGNhbGwgYSBjbGFzcyBhcyBhIGZ1bmN0aW9uXCIpOyB9IH1cblxudmFyIExpc3RlbmVycyA9IChmdW5jdGlvbiAoKSB7XG4gICAgZnVuY3Rpb24gTGlzdGVuZXJzKCkge1xuICAgICAgICBfY2xhc3NDYWxsQ2hlY2sodGhpcywgTGlzdGVuZXJzKTtcbiAgICB9XG5cbiAgICBfY3JlYXRlQ2xhc3MoTGlzdGVuZXJzLCBudWxsLCBbe1xuICAgICAgICBrZXk6IFwiZHluYW1pY0J1aWxkZXJcIixcbiAgICAgICAgdmFsdWU6IGZ1bmN0aW9uIGR5bmFtaWNCdWlsZGVyKGNvbnRyb2xsZXIpIHtcbiAgICAgICAgICAgIHZhciBweWRpbyA9IGdsb2JhbC5weWRpbztcbiAgICAgICAgICAgIHZhciBNZXNzYWdlSGFzaCA9IHB5ZGlvLk1lc3NhZ2VIYXNoO1xuXG4gICAgICAgICAgICB2YXIgbiA9IHB5ZGlvLmdldFVzZXJTZWxlY3Rpb24oKS5nZXRVbmlxdWVOb2RlKCk7XG4gICAgICAgICAgICBpZiAoIW4pIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gW107XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHZhciBidWlsZGVyTWVudUl0ZW1zID0gW107XG4gICAgICAgICAgICB2YXIgbWV0YVZhbHVlID0gdW5kZWZpbmVkO1xuICAgICAgICAgICAgaWYgKG4uZ2V0TWV0YWRhdGEoKS5nZXQoXCJtZXRhX3dhdGNoZWRcIikpIHtcbiAgICAgICAgICAgICAgICBtZXRhVmFsdWUgPSBuLmdldE1ldGFkYXRhKCkuZ2V0KFwibWV0YV93YXRjaGVkXCIpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgYnVpbGRlck1lbnVJdGVtcy5wdXNoKHtcbiAgICAgICAgICAgICAgICBuYW1lOiBNZXNzYWdlSGFzaFtcIm1ldGEud2F0Y2guMTFcIl0sXG4gICAgICAgICAgICAgICAgYWx0OiBNZXNzYWdlSGFzaFtcIm1ldGEud2F0Y2guXCIgKyAobi5pc0xlYWYoKSA/IFwiMTJcIiA6IFwiMTJiXCIpXSxcbiAgICAgICAgICAgICAgICBpY29uX2NsYXNzOiBtZXRhVmFsdWUgJiYgbWV0YVZhbHVlID09PSBcIk1FVEFfV0FUQ0hfQ0hBTkdFXCIgPyAnbWRpIG1kaS1jaGVja2JveC1tYXJrZWQtY2lyY2xlLW91dGxpbmUnIDogJ21kaSBtZGktY2hlY2tib3gtYmxhbmstY2lyY2xlLW91dGxpbmUnLFxuICAgICAgICAgICAgICAgIGNhbGxiYWNrOiAoZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5hcHBseSgnd2F0Y2hfY2hhbmdlJyk7XG4gICAgICAgICAgICAgICAgfSkuYmluZCh0aGlzKVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBidWlsZGVyTWVudUl0ZW1zLnB1c2goe1xuICAgICAgICAgICAgICAgIG5hbWU6IE1lc3NhZ2VIYXNoW1wibWV0YS53YXRjaC45XCJdLFxuICAgICAgICAgICAgICAgIGFsdDogTWVzc2FnZUhhc2hbXCJtZXRhLndhdGNoLlwiICsgKG4uaXNMZWFmKCkgPyBcIjEwXCIgOiBcIjEwYlwiKV0sXG4gICAgICAgICAgICAgICAgaWNvbl9jbGFzczogbWV0YVZhbHVlICYmIG1ldGFWYWx1ZSA9PT0gXCJNRVRBX1dBVENIX1JFQURcIiA/ICdtZGkgbWRpLWNoZWNrYm94LW1hcmtlZC1jaXJjbGUtb3V0bGluZScgOiAnbWRpIG1kaS1jaGVja2JveC1ibGFuay1jaXJjbGUtb3V0bGluZScsXG4gICAgICAgICAgICAgICAgY2FsbGJhY2s6IChmdW5jdGlvbiAoZSkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmFwcGx5KCd3YXRjaF9yZWFkJyk7XG4gICAgICAgICAgICAgICAgfSkuYmluZCh0aGlzKVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBidWlsZGVyTWVudUl0ZW1zLnB1c2goe1xuICAgICAgICAgICAgICAgIG5hbWU6IE1lc3NhZ2VIYXNoW1wibWV0YS53YXRjaC4xM1wiXSxcbiAgICAgICAgICAgICAgICBhbHQ6IE1lc3NhZ2VIYXNoW1wibWV0YS53YXRjaC5cIiArIChuLmlzTGVhZigpID8gXCIxNFwiIDogXCIxNGJcIildLFxuICAgICAgICAgICAgICAgIGljb25fY2xhc3M6IG1ldGFWYWx1ZSAmJiBtZXRhVmFsdWUgPT09IFwiTUVUQV9XQVRDSF9CT1RIXCIgPyAnbWRpIG1kaS1jaGVja2JveC1tYXJrZWQtY2lyY2xlLW91dGxpbmUnIDogJ21kaSBtZGktY2hlY2tib3gtYmxhbmstY2lyY2xlLW91dGxpbmUnLFxuICAgICAgICAgICAgICAgIGNhbGxiYWNrOiAoZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5hcHBseSgnd2F0Y2hfYm90aCcpO1xuICAgICAgICAgICAgICAgIH0pLmJpbmQodGhpcylcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgaWYgKG1ldGFWYWx1ZSkge1xuICAgICAgICAgICAgICAgIGJ1aWxkZXJNZW51SXRlbXMucHVzaCh7XG4gICAgICAgICAgICAgICAgICAgIHNlcGFyYXRvcjogdHJ1ZVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIGJ1aWxkZXJNZW51SXRlbXMucHVzaCh7XG4gICAgICAgICAgICAgICAgICAgIG5hbWU6IE1lc3NhZ2VIYXNoWydtZXRhLndhdGNoLjMnXSxcbiAgICAgICAgICAgICAgICAgICAgYWx0OiBNZXNzYWdlSGFzaFtcIm1ldGEud2F0Y2guXCIgKyAobi5pc0xlYWYoKSA/IFwiOFwiIDogXCI0XCIpXSxcbiAgICAgICAgICAgICAgICAgICAgaWNvbl9jbGFzczogJ21kaSBtZGktY2xvc2UtY2lyY2xlLW91dGxpbmUnLFxuICAgICAgICAgICAgICAgICAgICBjYWxsYmFjazogKGZ1bmN0aW9uIChlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmFwcGx5KCd3YXRjaF9zdG9wJyk7XG4gICAgICAgICAgICAgICAgICAgIH0pLmJpbmQodGhpcylcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIGJ1aWxkZXJNZW51SXRlbXM7XG4gICAgICAgIH1cbiAgICB9XSk7XG5cbiAgICByZXR1cm4gTGlzdGVuZXJzO1xufSkoKTtcblxuZXhwb3J0c1tcImRlZmF1bHRcIl0gPSBMaXN0ZW5lcnM7XG5tb2R1bGUuZXhwb3J0cyA9IGV4cG9ydHNbXCJkZWZhdWx0XCJdO1xuIiwiLypcbiAqIENvcHlyaWdodCAyMDA3LTIwMTkgQ2hhcmxlcyBkdSBKZXUgLSBBYnN0cml1bSBTQVMgPHRlYW0gKGF0KSBweWQuaW8+XG4gKiBUaGlzIGZpbGUgaXMgcGFydCBvZiBQeWRpby5cbiAqXG4gKiBQeWRpbyBpcyBmcmVlIHNvZnR3YXJlOiB5b3UgY2FuIHJlZGlzdHJpYnV0ZSBpdCBhbmQvb3IgbW9kaWZ5XG4gKiBpdCB1bmRlciB0aGUgdGVybXMgb2YgdGhlIEdOVSBBZmZlcm8gR2VuZXJhbCBQdWJsaWMgTGljZW5zZSBhcyBwdWJsaXNoZWQgYnlcbiAqIHRoZSBGcmVlIFNvZnR3YXJlIEZvdW5kYXRpb24sIGVpdGhlciB2ZXJzaW9uIDMgb2YgdGhlIExpY2Vuc2UsIG9yXG4gKiAoYXQgeW91ciBvcHRpb24pIGFueSBsYXRlciB2ZXJzaW9uLlxuICpcbiAqIFB5ZGlvIGlzIGRpc3RyaWJ1dGVkIGluIHRoZSBob3BlIHRoYXQgaXQgd2lsbCBiZSB1c2VmdWwsXG4gKiBidXQgV0lUSE9VVCBBTlkgV0FSUkFOVFk7IHdpdGhvdXQgZXZlbiB0aGUgaW1wbGllZCB3YXJyYW50eSBvZlxuICogTUVSQ0hBTlRBQklMSVRZIG9yIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFLiAgU2VlIHRoZVxuICogR05VIEFmZmVybyBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlIGZvciBtb3JlIGRldGFpbHMuXG4gKlxuICogWW91IHNob3VsZCBoYXZlIHJlY2VpdmVkIGEgY29weSBvZiB0aGUgR05VIEFmZmVybyBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlXG4gKiBhbG9uZyB3aXRoIFB5ZGlvLiAgSWYgbm90LCBzZWUgPGh0dHA6Ly93d3cuZ251Lm9yZy9saWNlbnNlcy8+LlxuICpcbiAqIFRoZSBsYXRlc3QgY29kZSBjYW4gYmUgZm91bmQgYXQgPGh0dHBzOi8vcHlkaW8uY29tPi5cbiAqL1xuJ3VzZSBzdHJpY3QnO1xuXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7XG4gICAgdmFsdWU6IHRydWVcbn0pO1xuXG52YXIgX2V4dGVuZHMgPSBPYmplY3QuYXNzaWduIHx8IGZ1bmN0aW9uICh0YXJnZXQpIHsgZm9yICh2YXIgaSA9IDE7IGkgPCBhcmd1bWVudHMubGVuZ3RoOyBpKyspIHsgdmFyIHNvdXJjZSA9IGFyZ3VtZW50c1tpXTsgZm9yICh2YXIga2V5IGluIHNvdXJjZSkgeyBpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKHNvdXJjZSwga2V5KSkgeyB0YXJnZXRba2V5XSA9IHNvdXJjZVtrZXldOyB9IH0gfSByZXR1cm4gdGFyZ2V0OyB9O1xuXG52YXIgX2NyZWF0ZUNsYXNzID0gKGZ1bmN0aW9uICgpIHsgZnVuY3Rpb24gZGVmaW5lUHJvcGVydGllcyh0YXJnZXQsIHByb3BzKSB7IGZvciAodmFyIGkgPSAwOyBpIDwgcHJvcHMubGVuZ3RoOyBpKyspIHsgdmFyIGRlc2NyaXB0b3IgPSBwcm9wc1tpXTsgZGVzY3JpcHRvci5lbnVtZXJhYmxlID0gZGVzY3JpcHRvci5lbnVtZXJhYmxlIHx8IGZhbHNlOyBkZXNjcmlwdG9yLmNvbmZpZ3VyYWJsZSA9IHRydWU7IGlmICgndmFsdWUnIGluIGRlc2NyaXB0b3IpIGRlc2NyaXB0b3Iud3JpdGFibGUgPSB0cnVlOyBPYmplY3QuZGVmaW5lUHJvcGVydHkodGFyZ2V0LCBkZXNjcmlwdG9yLmtleSwgZGVzY3JpcHRvcik7IH0gfSByZXR1cm4gZnVuY3Rpb24gKENvbnN0cnVjdG9yLCBwcm90b1Byb3BzLCBzdGF0aWNQcm9wcykgeyBpZiAocHJvdG9Qcm9wcykgZGVmaW5lUHJvcGVydGllcyhDb25zdHJ1Y3Rvci5wcm90b3R5cGUsIHByb3RvUHJvcHMpOyBpZiAoc3RhdGljUHJvcHMpIGRlZmluZVByb3BlcnRpZXMoQ29uc3RydWN0b3IsIHN0YXRpY1Byb3BzKTsgcmV0dXJuIENvbnN0cnVjdG9yOyB9OyB9KSgpO1xuXG52YXIgX2dldCA9IGZ1bmN0aW9uIGdldChfeCwgX3gyLCBfeDMpIHsgdmFyIF9hZ2FpbiA9IHRydWU7IF9mdW5jdGlvbjogd2hpbGUgKF9hZ2FpbikgeyB2YXIgb2JqZWN0ID0gX3gsIHByb3BlcnR5ID0gX3gyLCByZWNlaXZlciA9IF94MzsgX2FnYWluID0gZmFsc2U7IGlmIChvYmplY3QgPT09IG51bGwpIG9iamVjdCA9IEZ1bmN0aW9uLnByb3RvdHlwZTsgdmFyIGRlc2MgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKG9iamVjdCwgcHJvcGVydHkpOyBpZiAoZGVzYyA9PT0gdW5kZWZpbmVkKSB7IHZhciBwYXJlbnQgPSBPYmplY3QuZ2V0UHJvdG90eXBlT2Yob2JqZWN0KTsgaWYgKHBhcmVudCA9PT0gbnVsbCkgeyByZXR1cm4gdW5kZWZpbmVkOyB9IGVsc2UgeyBfeCA9IHBhcmVudDsgX3gyID0gcHJvcGVydHk7IF94MyA9IHJlY2VpdmVyOyBfYWdhaW4gPSB0cnVlOyBkZXNjID0gcGFyZW50ID0gdW5kZWZpbmVkOyBjb250aW51ZSBfZnVuY3Rpb247IH0gfSBlbHNlIGlmICgndmFsdWUnIGluIGRlc2MpIHsgcmV0dXJuIGRlc2MudmFsdWU7IH0gZWxzZSB7IHZhciBnZXR0ZXIgPSBkZXNjLmdldDsgaWYgKGdldHRlciA9PT0gdW5kZWZpbmVkKSB7IHJldHVybiB1bmRlZmluZWQ7IH0gcmV0dXJuIGdldHRlci5jYWxsKHJlY2VpdmVyKTsgfSB9IH07XG5cbmZ1bmN0aW9uIF9pbnRlcm9wUmVxdWlyZURlZmF1bHQob2JqKSB7IHJldHVybiBvYmogJiYgb2JqLl9fZXNNb2R1bGUgPyBvYmogOiB7ICdkZWZhdWx0Jzogb2JqIH07IH1cblxuZnVuY3Rpb24gX2NsYXNzQ2FsbENoZWNrKGluc3RhbmNlLCBDb25zdHJ1Y3RvcikgeyBpZiAoIShpbnN0YW5jZSBpbnN0YW5jZW9mIENvbnN0cnVjdG9yKSkgeyB0aHJvdyBuZXcgVHlwZUVycm9yKCdDYW5ub3QgY2FsbCBhIGNsYXNzIGFzIGEgZnVuY3Rpb24nKTsgfSB9XG5cbmZ1bmN0aW9uIF9pbmhlcml0cyhzdWJDbGFzcywgc3VwZXJDbGFzcykgeyBpZiAodHlwZW9mIHN1cGVyQ2xhc3MgIT09ICdmdW5jdGlvbicgJiYgc3VwZXJDbGFzcyAhPT0gbnVsbCkgeyB0aHJvdyBuZXcgVHlwZUVycm9yKCdTdXBlciBleHByZXNzaW9uIG11c3QgZWl0aGVyIGJlIG51bGwgb3IgYSBmdW5jdGlvbiwgbm90ICcgKyB0eXBlb2Ygc3VwZXJDbGFzcyk7IH0gc3ViQ2xhc3MucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZShzdXBlckNsYXNzICYmIHN1cGVyQ2xhc3MucHJvdG90eXBlLCB7IGNvbnN0cnVjdG9yOiB7IHZhbHVlOiBzdWJDbGFzcywgZW51bWVyYWJsZTogZmFsc2UsIHdyaXRhYmxlOiB0cnVlLCBjb25maWd1cmFibGU6IHRydWUgfSB9KTsgaWYgKHN1cGVyQ2xhc3MpIE9iamVjdC5zZXRQcm90b3R5cGVPZiA/IE9iamVjdC5zZXRQcm90b3R5cGVPZihzdWJDbGFzcywgc3VwZXJDbGFzcykgOiBzdWJDbGFzcy5fX3Byb3RvX18gPSBzdXBlckNsYXNzOyB9XG5cbnZhciBfcmVhY3QgPSByZXF1aXJlKCdyZWFjdCcpO1xuXG52YXIgX3JlYWN0MiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX3JlYWN0KTtcblxudmFyIF9tYXRlcmlhbFVpID0gcmVxdWlyZSgnbWF0ZXJpYWwtdWknKTtcblxudmFyIF9tYXRlcmlhbFVpU3R5bGVzID0gcmVxdWlyZSgnbWF0ZXJpYWwtdWkvc3R5bGVzJyk7XG5cbnZhciBfQ2xpZW50ID0gcmVxdWlyZSgnLi9DbGllbnQnKTtcblxudmFyIF9DbGllbnQyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfQ2xpZW50KTtcblxudmFyIF9BY3Rpdml0eUxpc3QgPSByZXF1aXJlKCcuL0FjdGl2aXR5TGlzdCcpO1xuXG52YXIgX0FjdGl2aXR5TGlzdDIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9BY3Rpdml0eUxpc3QpO1xuXG52YXIgX2xvZGFzaERlYm91bmNlID0gcmVxdWlyZSgnbG9kYXNoLmRlYm91bmNlJyk7XG5cbnZhciBfbG9kYXNoRGVib3VuY2UyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfbG9kYXNoRGVib3VuY2UpO1xuXG52YXIgX2NvbG9yID0gcmVxdWlyZSgnY29sb3InKTtcblxudmFyIF9jb2xvcjIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9jb2xvcik7XG5cbnZhciBVc2VyUGFuZWwgPSAoZnVuY3Rpb24gKF9SZWFjdCRDb21wb25lbnQpIHtcbiAgICBfaW5oZXJpdHMoVXNlclBhbmVsLCBfUmVhY3QkQ29tcG9uZW50KTtcblxuICAgIGZ1bmN0aW9uIFVzZXJQYW5lbChwcm9wcykge1xuICAgICAgICBfY2xhc3NDYWxsQ2hlY2sodGhpcywgVXNlclBhbmVsKTtcblxuICAgICAgICBfZ2V0KE9iamVjdC5nZXRQcm90b3R5cGVPZihVc2VyUGFuZWwucHJvdG90eXBlKSwgJ2NvbnN0cnVjdG9yJywgdGhpcykuY2FsbCh0aGlzLCBwcm9wcyk7XG4gICAgICAgIHRoaXMuc3RhdGUgPSB7XG4gICAgICAgICAgICB1bnJlYWRTdGF0dXM6IDAsXG4gICAgICAgICAgICBvcGVuOiBmYWxzZSxcbiAgICAgICAgICAgIGRhdGE6IFtdXG4gICAgICAgIH07XG4gICAgICAgIHRoaXMucmVsb2FkRGF0YSA9ICgwLCBfbG9kYXNoRGVib3VuY2UyWydkZWZhdWx0J10pKHRoaXMucmVsb2FkRGF0YS5iaW5kKHRoaXMpLCA1MDApO1xuICAgICAgICB0aGlzLnJlbG9hZFVucmVhZCA9ICgwLCBfbG9kYXNoRGVib3VuY2UyWydkZWZhdWx0J10pKHRoaXMucmVsb2FkVW5yZWFkLmJpbmQodGhpcyksIDUwMCk7XG4gICAgfVxuXG4gICAgX2NyZWF0ZUNsYXNzKFVzZXJQYW5lbCwgW3tcbiAgICAgICAga2V5OiAncmVsb2FkRGF0YScsXG4gICAgICAgIHZhbHVlOiBmdW5jdGlvbiByZWxvYWREYXRhKCkge1xuICAgICAgICAgICAgdmFyIF90aGlzID0gdGhpcztcblxuICAgICAgICAgICAgX0NsaWVudDJbJ2RlZmF1bHQnXS5sb2FkQWN0aXZpdHlTdHJlYW1zKCdVU0VSX0lEJywgdGhpcy5wcm9wcy5weWRpby51c2VyLmlkLCAnaW5ib3gnKS50aGVuKGZ1bmN0aW9uIChqc29uKSB7XG4gICAgICAgICAgICAgICAgX3RoaXMuc2V0U3RhdGUoeyBkYXRhOiBqc29uIH0pO1xuICAgICAgICAgICAgfSlbJ2NhdGNoJ10oZnVuY3Rpb24gKG1zZykge1xuICAgICAgICAgICAgICAgIF90aGlzLnNldFN0YXRlKHsgZXJyb3I6IG1zZyB9KTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgfSwge1xuICAgICAgICBrZXk6ICdyZWxvYWRVbnJlYWQnLFxuICAgICAgICB2YWx1ZTogZnVuY3Rpb24gcmVsb2FkVW5yZWFkKCkge1xuICAgICAgICAgICAgdmFyIF90aGlzMiA9IHRoaXM7XG5cbiAgICAgICAgICAgIF9DbGllbnQyWydkZWZhdWx0J10uVW5yZWFkSW5ib3godGhpcy5wcm9wcy5weWRpby51c2VyLmlkKS50aGVuKGZ1bmN0aW9uIChjb3VudCkge1xuICAgICAgICAgICAgICAgIF90aGlzMi5zZXRTdGF0ZSh7IHVucmVhZFN0YXR1czogY291bnQgfSk7XG4gICAgICAgICAgICB9KVsnY2F0Y2gnXShmdW5jdGlvbiAobXNnKSB7fSk7XG4gICAgICAgIH1cbiAgICB9LCB7XG4gICAgICAgIGtleTogJ29uU3RhdHVzQ2hhbmdlJyxcbiAgICAgICAgdmFsdWU6IGZ1bmN0aW9uIG9uU3RhdHVzQ2hhbmdlKCkge1xuICAgICAgICAgICAgaWYgKHRoaXMucHJvcHMub25VbnJlYWRTdGF0dXNDaGFuZ2UpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnByb3BzLm9uVW5yZWFkU3RhdHVzQ2hhbmdlKHRoaXMuc3RhdGUudW5yZWFkU3RhdHVzKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH0sIHtcbiAgICAgICAga2V5OiAnaGFuZGxlVG91Y2hUYXAnLFxuICAgICAgICB2YWx1ZTogZnVuY3Rpb24gaGFuZGxlVG91Y2hUYXAoZXZlbnQpIHtcbiAgICAgICAgICAgIC8vIFRoaXMgcHJldmVudHMgZ2hvc3QgY2xpY2suXG4gICAgICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgLy9pZih0aGlzLnN0YXRlLnVucmVhZFN0YXR1cyl7XG4gICAgICAgICAgICAvL3RoaXMudXBkYXRlQWxlcnRzTGFzdFJlYWQoKTtcbiAgICAgICAgICAgIC8vfVxuICAgICAgICAgICAgdGhpcy5yZWxvYWREYXRhKCk7XG4gICAgICAgICAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgICAgICAgICAgICBvcGVuOiB0cnVlLFxuICAgICAgICAgICAgICAgIGFuY2hvckVsOiBldmVudC5jdXJyZW50VGFyZ2V0LFxuICAgICAgICAgICAgICAgIHVucmVhZFN0YXR1czogMFxuICAgICAgICAgICAgfSwgdGhpcy5vblN0YXR1c0NoYW5nZS5iaW5kKHRoaXMpKTtcbiAgICAgICAgfVxuICAgIH0sIHtcbiAgICAgICAga2V5OiAnaGFuZGxlUmVxdWVzdENsb3NlJyxcbiAgICAgICAgdmFsdWU6IGZ1bmN0aW9uIGhhbmRsZVJlcXVlc3RDbG9zZSgpIHtcbiAgICAgICAgICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgICAgICAgICAgIG9wZW46IGZhbHNlXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgIH0sIHtcbiAgICAgICAga2V5OiAnY29tcG9uZW50V2lsbE1vdW50JyxcbiAgICAgICAgdmFsdWU6IGZ1bmN0aW9uIGNvbXBvbmVudFdpbGxNb3VudCgpIHtcbiAgICAgICAgICAgIHZhciBfdGhpczMgPSB0aGlzO1xuXG4gICAgICAgICAgICB0aGlzLnJlbG9hZFVucmVhZCgpO1xuICAgICAgICAgICAgdGhpcy5wcm9wcy5weWRpby5vYnNlcnZlKCd3ZWJzb2NrZXRfZXZlbnQ6YWN0aXZpdHknLCBmdW5jdGlvbiAoZXZlbnQpIHtcbiAgICAgICAgICAgICAgICBpZiAoX3RoaXMzLnN0YXRlLm9wZW4pIHtcbiAgICAgICAgICAgICAgICAgICAgX3RoaXMzLnJlbG9hZERhdGEoKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBfdGhpczMucmVsb2FkVW5yZWFkKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICB9LCB7XG4gICAgICAgIGtleTogJ3JlbmRlcicsXG4gICAgICAgIHZhbHVlOiBmdW5jdGlvbiByZW5kZXIoKSB7XG4gICAgICAgICAgICB2YXIgX3Byb3BzID0gdGhpcy5wcm9wcztcbiAgICAgICAgICAgIHZhciBweWRpbyA9IF9wcm9wcy5weWRpbztcbiAgICAgICAgICAgIHZhciBpY29uU3R5bGUgPSBfcHJvcHMuaWNvblN0eWxlO1xuICAgICAgICAgICAgdmFyIG11aVRoZW1lID0gX3Byb3BzLm11aVRoZW1lO1xuICAgICAgICAgICAgdmFyIF9zdGF0ZSA9IHRoaXMuc3RhdGU7XG4gICAgICAgICAgICB2YXIgb3BlbiA9IF9zdGF0ZS5vcGVuO1xuICAgICAgICAgICAgdmFyIGFuY2hvckVsID0gX3N0YXRlLmFuY2hvckVsO1xuICAgICAgICAgICAgdmFyIHVucmVhZFN0YXR1cyA9IF9zdGF0ZS51bnJlYWRTdGF0dXM7XG5cbiAgICAgICAgICAgIHZhciBidXR0b25TdHlsZSA9IHsgYm9yZGVyUmFkaXVzOiAnNTAlJyB9O1xuICAgICAgICAgICAgaWYgKG9wZW4gJiYgaWNvblN0eWxlICYmIGljb25TdHlsZS5jb2xvcikge1xuICAgICAgICAgICAgICAgIGJ1dHRvblN0eWxlID0gX2V4dGVuZHMoe30sIGJ1dHRvblN0eWxlLCB7IGJhY2tncm91bmRDb2xvcjogKDAsIF9jb2xvcjJbJ2RlZmF1bHQnXSkoaWNvblN0eWxlLmNvbG9yKS5mYWRlKDAuOSkudG9TdHJpbmcoKSB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBfcmVhY3QyWydkZWZhdWx0J10uY3JlYXRlRWxlbWVudChcbiAgICAgICAgICAgICAgICAnc3BhbicsXG4gICAgICAgICAgICAgICAgbnVsbCxcbiAgICAgICAgICAgICAgICBfcmVhY3QyWydkZWZhdWx0J10uY3JlYXRlRWxlbWVudChcbiAgICAgICAgICAgICAgICAgICAgJ2RpdicsXG4gICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHN0eWxlOiB7IHBvc2l0aW9uOiAncmVsYXRpdmUnLCBkaXNwbGF5OiAnaW5saW5lLWJsb2NrJyB9LFxuXG4gICAgICAgICAgICAgICAgICAgICAgICBiYWRnZUNvbnRlbnQ6IHRoaXMuc3RhdGUudW5yZWFkU3RhdHVzLFxuICAgICAgICAgICAgICAgICAgICAgICAgc2Vjb25kYXJ5OiB0cnVlLFxuICAgICAgICAgICAgICAgICAgICAgICAgYmFkZ2VTdHlsZTogdGhpcy5zdGF0ZS51bnJlYWRTdGF0dXMgPyBudWxsIDogeyBkaXNwbGF5OiAnbm9uZScgfVxuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICBfcmVhY3QyWydkZWZhdWx0J10uY3JlYXRlRWxlbWVudChfbWF0ZXJpYWxVaS5JY29uQnV0dG9uLCB7XG4gICAgICAgICAgICAgICAgICAgICAgICBvblRvdWNoVGFwOiB0aGlzLmhhbmRsZVRvdWNoVGFwLmJpbmQodGhpcyksXG4gICAgICAgICAgICAgICAgICAgICAgICBpY29uQ2xhc3NOYW1lOiB0aGlzLnByb3BzLmljb25DbGFzc05hbWUgfHwgXCJpY29uLWJlbGxcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIHRvb2x0aXA6ICh1bnJlYWRTdGF0dXMgPyB1bnJlYWRTdGF0dXMgKyAnICcgOiAnJykgKyB0aGlzLnByb3BzLnB5ZGlvLk1lc3NhZ2VIYXNoWydub3RpZmljYXRpb25fY2VudGVyLjQnXSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZTogJ3VzZXJBY3Rpb25CdXR0b24gYWxlcnRzQnV0dG9uJyxcbiAgICAgICAgICAgICAgICAgICAgICAgIGljb25TdHlsZTogaWNvblN0eWxlLFxuICAgICAgICAgICAgICAgICAgICAgICAgc3R5bGU6IGJ1dHRvblN0eWxlXG4gICAgICAgICAgICAgICAgICAgIH0pLFxuICAgICAgICAgICAgICAgICAgICB1bnJlYWRTdGF0dXMgPiAwICYmIF9yZWFjdDJbJ2RlZmF1bHQnXS5jcmVhdGVFbGVtZW50KCdkaXYnLCB7IHN0eWxlOiB7IHdpZHRoOiA2LCBoZWlnaHQ6IDYsIGJvcmRlclJhZGl1czogJzUwJScsIHRvcDogOSwgcmlnaHQ6IDYsIHBvc2l0aW9uOiAnYWJzb2x1dGUnLCBiYWNrZ3JvdW5kQ29sb3I6IG11aVRoZW1lLnBhbGV0dGUuYWNjZW50MUNvbG9yIH0gfSlcbiAgICAgICAgICAgICAgICApLFxuICAgICAgICAgICAgICAgIF9yZWFjdDJbJ2RlZmF1bHQnXS5jcmVhdGVFbGVtZW50KFxuICAgICAgICAgICAgICAgICAgICBfbWF0ZXJpYWxVaS5Qb3BvdmVyLFxuICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICBvcGVuOiBvcGVuLFxuICAgICAgICAgICAgICAgICAgICAgICAgYW5jaG9yRWw6IGFuY2hvckVsLFxuICAgICAgICAgICAgICAgICAgICAgICAgYW5jaG9yT3JpZ2luOiB7IGhvcml6b250YWw6ICdsZWZ0JywgdmVydGljYWw6ICdib3R0b20nIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICB0YXJnZXRPcmlnaW46IHsgaG9yaXpvbnRhbDogJ2xlZnQnLCB2ZXJ0aWNhbDogJ3RvcCcgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgIG9uUmVxdWVzdENsb3NlOiB0aGlzLmhhbmRsZVJlcXVlc3RDbG9zZS5iaW5kKHRoaXMpLFxuICAgICAgICAgICAgICAgICAgICAgICAgc3R5bGU6IHsgd2lkdGg6IDMyMCB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgekRlcHRoOiAyXG5cbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgX3JlYWN0MlsnZGVmYXVsdCddLmNyZWF0ZUVsZW1lbnQoXG4gICAgICAgICAgICAgICAgICAgICAgICAnZGl2JyxcbiAgICAgICAgICAgICAgICAgICAgICAgIHsgc3R5bGU6IHsgZGlzcGxheTogJ2ZsZXgnLCBhbGlnbkl0ZW1zOiAnY2VudGVyJywgYm9yZGVyUmFkaXVzOiAnMnB4IDJweCAwIDAnLCBwYWRkaW5nOiAnMTJweCAxNnB4Jywgd2lkdGg6ICcxMDAlJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYmFja2dyb3VuZENvbG9yOiAncmdiKDIzOCwgMjM4LCAyMzgpJywgYm9yZGVyQm90dG9tOiAnMXB4IHNvbGlkIHJnYigyMjQsIDIyNCwgMjI0KScgfSB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgcHlkaW8uTWVzc2FnZUhhc2hbJ25vdGlmaWNhdGlvbl9jZW50ZXIuMSddXG4gICAgICAgICAgICAgICAgICAgICksXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc3RhdGUuZGF0YSAmJiBfcmVhY3QyWydkZWZhdWx0J10uY3JlYXRlRWxlbWVudChfQWN0aXZpdHlMaXN0MlsnZGVmYXVsdCddLCB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpdGVtczogdGhpcy5zdGF0ZS5kYXRhLml0ZW1zLFxuICAgICAgICAgICAgICAgICAgICAgICAgc3R5bGU6IHsgb3ZlcmZsb3dZOiAnc2Nyb2xsJywgbWF4SGVpZ2h0OiAzMzAsIHBhZGRpbmdUb3A6IDIwIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICBncm91cEJ5RGF0ZTogdHJ1ZSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGRpc3BsYXlDb250ZXh0OiBcInBvcG92ZXJcIlxuICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgIClcbiAgICAgICAgICAgICk7XG4gICAgICAgIH1cbiAgICB9XSk7XG5cbiAgICByZXR1cm4gVXNlclBhbmVsO1xufSkoX3JlYWN0MlsnZGVmYXVsdCddLkNvbXBvbmVudCk7XG5cbmV4cG9ydHNbJ2RlZmF1bHQnXSA9IFVzZXJQYW5lbCA9ICgwLCBfbWF0ZXJpYWxVaVN0eWxlcy5tdWlUaGVtZWFibGUpKCkoVXNlclBhbmVsKTtcblxuZXhwb3J0c1snZGVmYXVsdCddID0gVXNlclBhbmVsO1xubW9kdWxlLmV4cG9ydHMgPSBleHBvcnRzWydkZWZhdWx0J107XG4iLCIndXNlIHN0cmljdCc7XG5cbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHtcbiAgICB2YWx1ZTogdHJ1ZVxufSk7XG5cbnZhciBfY3JlYXRlQ2xhc3MgPSAoZnVuY3Rpb24gKCkgeyBmdW5jdGlvbiBkZWZpbmVQcm9wZXJ0aWVzKHRhcmdldCwgcHJvcHMpIHsgZm9yICh2YXIgaSA9IDA7IGkgPCBwcm9wcy5sZW5ndGg7IGkrKykgeyB2YXIgZGVzY3JpcHRvciA9IHByb3BzW2ldOyBkZXNjcmlwdG9yLmVudW1lcmFibGUgPSBkZXNjcmlwdG9yLmVudW1lcmFibGUgfHwgZmFsc2U7IGRlc2NyaXB0b3IuY29uZmlndXJhYmxlID0gdHJ1ZTsgaWYgKCd2YWx1ZScgaW4gZGVzY3JpcHRvcikgZGVzY3JpcHRvci53cml0YWJsZSA9IHRydWU7IE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0YXJnZXQsIGRlc2NyaXB0b3Iua2V5LCBkZXNjcmlwdG9yKTsgfSB9IHJldHVybiBmdW5jdGlvbiAoQ29uc3RydWN0b3IsIHByb3RvUHJvcHMsIHN0YXRpY1Byb3BzKSB7IGlmIChwcm90b1Byb3BzKSBkZWZpbmVQcm9wZXJ0aWVzKENvbnN0cnVjdG9yLnByb3RvdHlwZSwgcHJvdG9Qcm9wcyk7IGlmIChzdGF0aWNQcm9wcykgZGVmaW5lUHJvcGVydGllcyhDb25zdHJ1Y3Rvciwgc3RhdGljUHJvcHMpOyByZXR1cm4gQ29uc3RydWN0b3I7IH07IH0pKCk7XG5cbnZhciBfZ2V0ID0gZnVuY3Rpb24gZ2V0KF94MiwgX3gzLCBfeDQpIHsgdmFyIF9hZ2FpbiA9IHRydWU7IF9mdW5jdGlvbjogd2hpbGUgKF9hZ2FpbikgeyB2YXIgb2JqZWN0ID0gX3gyLCBwcm9wZXJ0eSA9IF94MywgcmVjZWl2ZXIgPSBfeDQ7IF9hZ2FpbiA9IGZhbHNlOyBpZiAob2JqZWN0ID09PSBudWxsKSBvYmplY3QgPSBGdW5jdGlvbi5wcm90b3R5cGU7IHZhciBkZXNjID0gT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcihvYmplY3QsIHByb3BlcnR5KTsgaWYgKGRlc2MgPT09IHVuZGVmaW5lZCkgeyB2YXIgcGFyZW50ID0gT2JqZWN0LmdldFByb3RvdHlwZU9mKG9iamVjdCk7IGlmIChwYXJlbnQgPT09IG51bGwpIHsgcmV0dXJuIHVuZGVmaW5lZDsgfSBlbHNlIHsgX3gyID0gcGFyZW50OyBfeDMgPSBwcm9wZXJ0eTsgX3g0ID0gcmVjZWl2ZXI7IF9hZ2FpbiA9IHRydWU7IGRlc2MgPSBwYXJlbnQgPSB1bmRlZmluZWQ7IGNvbnRpbnVlIF9mdW5jdGlvbjsgfSB9IGVsc2UgaWYgKCd2YWx1ZScgaW4gZGVzYykgeyByZXR1cm4gZGVzYy52YWx1ZTsgfSBlbHNlIHsgdmFyIGdldHRlciA9IGRlc2MuZ2V0OyBpZiAoZ2V0dGVyID09PSB1bmRlZmluZWQpIHsgcmV0dXJuIHVuZGVmaW5lZDsgfSByZXR1cm4gZ2V0dGVyLmNhbGwocmVjZWl2ZXIpOyB9IH0gfTtcblxuZnVuY3Rpb24gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChvYmopIHsgcmV0dXJuIG9iaiAmJiBvYmouX19lc01vZHVsZSA/IG9iaiA6IHsgJ2RlZmF1bHQnOiBvYmogfTsgfVxuXG5mdW5jdGlvbiBfY2xhc3NDYWxsQ2hlY2soaW5zdGFuY2UsIENvbnN0cnVjdG9yKSB7IGlmICghKGluc3RhbmNlIGluc3RhbmNlb2YgQ29uc3RydWN0b3IpKSB7IHRocm93IG5ldyBUeXBlRXJyb3IoJ0Nhbm5vdCBjYWxsIGEgY2xhc3MgYXMgYSBmdW5jdGlvbicpOyB9IH1cblxuZnVuY3Rpb24gX2luaGVyaXRzKHN1YkNsYXNzLCBzdXBlckNsYXNzKSB7IGlmICh0eXBlb2Ygc3VwZXJDbGFzcyAhPT0gJ2Z1bmN0aW9uJyAmJiBzdXBlckNsYXNzICE9PSBudWxsKSB7IHRocm93IG5ldyBUeXBlRXJyb3IoJ1N1cGVyIGV4cHJlc3Npb24gbXVzdCBlaXRoZXIgYmUgbnVsbCBvciBhIGZ1bmN0aW9uLCBub3QgJyArIHR5cGVvZiBzdXBlckNsYXNzKTsgfSBzdWJDbGFzcy5wcm90b3R5cGUgPSBPYmplY3QuY3JlYXRlKHN1cGVyQ2xhc3MgJiYgc3VwZXJDbGFzcy5wcm90b3R5cGUsIHsgY29uc3RydWN0b3I6IHsgdmFsdWU6IHN1YkNsYXNzLCBlbnVtZXJhYmxlOiBmYWxzZSwgd3JpdGFibGU6IHRydWUsIGNvbmZpZ3VyYWJsZTogdHJ1ZSB9IH0pOyBpZiAoc3VwZXJDbGFzcykgT2JqZWN0LnNldFByb3RvdHlwZU9mID8gT2JqZWN0LnNldFByb3RvdHlwZU9mKHN1YkNsYXNzLCBzdXBlckNsYXNzKSA6IHN1YkNsYXNzLl9fcHJvdG9fXyA9IHN1cGVyQ2xhc3M7IH1cblxudmFyIF9yZWFjdCA9IHJlcXVpcmUoJ3JlYWN0Jyk7XG5cbnZhciBfcmVhY3QyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfcmVhY3QpO1xuXG52YXIgX3B5ZGlvID0gcmVxdWlyZSgncHlkaW8nKTtcblxudmFyIF9weWRpbzIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9weWRpbyk7XG5cbnZhciBfbWF0ZXJpYWxVaSA9IHJlcXVpcmUoJ21hdGVyaWFsLXVpJyk7XG5cbnZhciBfcHlkaW9IdHRwQXBpID0gcmVxdWlyZSgncHlkaW8vaHR0cC9hcGknKTtcblxudmFyIF9weWRpb0h0dHBBcGkyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfcHlkaW9IdHRwQXBpKTtcblxudmFyIF9weWRpb0h0dHBSZXN0QXBpID0gcmVxdWlyZSgncHlkaW8vaHR0cC9yZXN0LWFwaScpO1xuXG52YXIgX1B5ZGlvJHJlcXVpcmVMaWIgPSBfcHlkaW8yWydkZWZhdWx0J10ucmVxdWlyZUxpYignaG9jJyk7XG5cbnZhciBNb2Rlcm5TZWxlY3RGaWVsZCA9IF9QeWRpbyRyZXF1aXJlTGliLk1vZGVyblNlbGVjdEZpZWxkO1xuXG52YXIgV2F0Y2hTZWxlY3RvciA9IChmdW5jdGlvbiAoX1JlYWN0JENvbXBvbmVudCkge1xuICAgIF9pbmhlcml0cyhXYXRjaFNlbGVjdG9yLCBfUmVhY3QkQ29tcG9uZW50KTtcblxuICAgIGZ1bmN0aW9uIFdhdGNoU2VsZWN0b3IocHJvcHMpIHtcbiAgICAgICAgX2NsYXNzQ2FsbENoZWNrKHRoaXMsIFdhdGNoU2VsZWN0b3IpO1xuXG4gICAgICAgIF9nZXQoT2JqZWN0LmdldFByb3RvdHlwZU9mKFdhdGNoU2VsZWN0b3IucHJvdG90eXBlKSwgJ2NvbnN0cnVjdG9yJywgdGhpcykuY2FsbCh0aGlzLCBwcm9wcyk7XG4gICAgICAgIHZhciBub2RlcyA9IHRoaXMucHJvcHMubm9kZXM7XG5cbiAgICAgICAgdGhpcy5zdGF0ZSA9IHRoaXMudmFsdWVGcm9tTm9kZXMobm9kZXMpO1xuICAgIH1cblxuICAgIF9jcmVhdGVDbGFzcyhXYXRjaFNlbGVjdG9yLCBbe1xuICAgICAgICBrZXk6ICd2YWx1ZUZyb21Ob2RlcycsXG4gICAgICAgIHZhbHVlOiBmdW5jdGlvbiB2YWx1ZUZyb21Ob2RlcygpIHtcbiAgICAgICAgICAgIHZhciBub2RlcyA9IGFyZ3VtZW50cy5sZW5ndGggPD0gMCB8fCBhcmd1bWVudHNbMF0gPT09IHVuZGVmaW5lZCA/IFtdIDogYXJndW1lbnRzWzBdO1xuXG4gICAgICAgICAgICB2YXIgbWl4ZWQgPSBmYWxzZSxcbiAgICAgICAgICAgICAgICB2YWx1ZSA9IHVuZGVmaW5lZDtcbiAgICAgICAgICAgIG5vZGVzLmZvckVhY2goZnVuY3Rpb24gKG4pIHtcbiAgICAgICAgICAgICAgICB2YXIgblZhbCA9IG4uZ2V0TWV0YWRhdGEoKS5nZXQoJ21ldGFfd2F0Y2hlZCcpIHx8ICcnO1xuICAgICAgICAgICAgICAgIGlmICh2YWx1ZSAhPT0gdW5kZWZpbmVkICYmIG5WYWwgIT09IHZhbHVlKSB7XG4gICAgICAgICAgICAgICAgICAgIG1peGVkID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgdmFsdWUgPSBuVmFsO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICByZXR1cm4geyB2YWx1ZTogdmFsdWUsIG1peGVkOiBtaXhlZCB9O1xuICAgICAgICB9XG4gICAgfSwge1xuICAgICAgICBrZXk6ICdvblNlbGVjdG9yQ2hhbmdlJyxcbiAgICAgICAgdmFsdWU6IGZ1bmN0aW9uIG9uU2VsZWN0b3JDaGFuZ2UodmFsdWUpIHtcbiAgICAgICAgICAgIHZhciBfdGhpcyA9IHRoaXM7XG5cbiAgICAgICAgICAgIGlmICh2YWx1ZSA9PT0gJ21peGVkJykge1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdmFyIF9wcm9wcyA9IHRoaXMucHJvcHM7XG4gICAgICAgICAgICB2YXIgcHlkaW8gPSBfcHJvcHMucHlkaW87XG4gICAgICAgICAgICB2YXIgbm9kZXMgPSBfcHJvcHMubm9kZXM7XG5cbiAgICAgICAgICAgIHRoaXMuc2V0U3RhdGUoeyBzYXZpbmc6IHRydWUgfSk7XG5cbiAgICAgICAgICAgIHZhciBwcm9tcyA9IG5vZGVzLm1hcChmdW5jdGlvbiAobm9kZSkge1xuICAgICAgICAgICAgICAgIHZhciBub2RlVXVpZCA9IG5vZGUuZ2V0TWV0YWRhdGEoKS5nZXQoJ3V1aWQnKTtcbiAgICAgICAgICAgICAgICB2YXIgdXNlcklkID0gcHlkaW8udXNlci5pZDtcbiAgICAgICAgICAgICAgICB2YXIgc3Vic2NyaXB0aW9uID0gbmV3IF9weWRpb0h0dHBSZXN0QXBpLkFjdGl2aXR5U3Vic2NyaXB0aW9uKCk7XG4gICAgICAgICAgICAgICAgdmFyIHR5cGUgPSBuZXcgX3B5ZGlvSHR0cFJlc3RBcGkuQWN0aXZpdHlPd25lclR5cGUoKTtcbiAgICAgICAgICAgICAgICBzdWJzY3JpcHRpb24uVXNlcklkID0gdXNlcklkO1xuICAgICAgICAgICAgICAgIHN1YnNjcmlwdGlvbi5PYmplY3RJZCA9IG5vZGVVdWlkO1xuICAgICAgICAgICAgICAgIHN1YnNjcmlwdGlvbi5PYmplY3RUeXBlID0gdHlwZS5OT0RFO1xuICAgICAgICAgICAgICAgIHZhciBldmVudHMgPSBbXTtcbiAgICAgICAgICAgICAgICBpZiAodmFsdWUgPT09ICdNRVRBX1dBVENIX0NIQU5HRScgfHwgdmFsdWUgPT09ICdNRVRBX1dBVENIX0JPVEgnKSB7XG4gICAgICAgICAgICAgICAgICAgIGV2ZW50cy5wdXNoKCdjaGFuZ2UnKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKHZhbHVlID09PSAnTUVUQV9XQVRDSF9SRUFEJyB8fCB2YWx1ZSA9PT0gJ01FVEFfV0FUQ0hfQk9USCcpIHtcbiAgICAgICAgICAgICAgICAgICAgZXZlbnRzLnB1c2goJ3JlYWQnKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgc3Vic2NyaXB0aW9uLkV2ZW50cyA9IGV2ZW50cztcbiAgICAgICAgICAgICAgICB2YXIgYXBpID0gbmV3IF9weWRpb0h0dHBSZXN0QXBpLkFjdGl2aXR5U2VydmljZUFwaShfcHlkaW9IdHRwQXBpMlsnZGVmYXVsdCddLmdldFJlc3RDbGllbnQoKSk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGFwaS5zdWJzY3JpYmUoc3Vic2NyaXB0aW9uKS50aGVuKGZ1bmN0aW9uIChvdXRTdWIpIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIG92ZXJsYXkgPSBub2RlLmdldE1ldGFkYXRhKCkuZ2V0KCdvdmVybGF5X2NsYXNzJykgfHwgJyc7XG4gICAgICAgICAgICAgICAgICAgIGlmICh2YWx1ZSA9PT0gJycpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIG5vZGUuZ2V0TWV0YWRhdGEoKVsnZGVsZXRlJ10oJ21ldGFfd2F0Y2hlZCcpO1xuICAgICAgICAgICAgICAgICAgICAgICAgbm9kZS5nZXRNZXRhZGF0YSgpLnNldCgnb3ZlcmxheV9jbGFzcycsIG92ZXJsYXkucmVwbGFjZSgnbWRpIG1kaS1iZWxsJywgJycpKTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIG5vZGUuZ2V0TWV0YWRhdGEoKS5zZXQoJ21ldGFfd2F0Y2hlZCcsIHZhbHVlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBvdmVybGF5cyA9IG92ZXJsYXkucmVwbGFjZSgnbWRpIG1kaS1iZWxsJywgJycpLnNwbGl0KCcsJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICBvdmVybGF5cy5wdXNoKCdtZGkgbWRpLWJlbGwnKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIG5vZGUuZ2V0TWV0YWRhdGEoKS5zZXQoJ292ZXJsYXlfY2xhc3MnLCBvdmVybGF5cy5qb2luKCcsJykpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIG5vZGUubm90aWZ5KCdub2RlX3JlcGxhY2VkJyk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIFByb21pc2UuYWxsKHByb21zKS50aGVuKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICBfdGhpcy5zZXRTdGF0ZSh7IHZhbHVlOiB2YWx1ZSwgbWl4ZWQ6IGZhbHNlIH0pO1xuICAgICAgICAgICAgICAgIHdpbmRvdy5zZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgX3RoaXMuc2V0U3RhdGUoeyBzYXZpbmc6IGZhbHNlIH0pO1xuICAgICAgICAgICAgICAgIH0sIDI1MCk7XG4gICAgICAgICAgICB9KVsnY2F0Y2gnXShmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgX3RoaXMuc2V0U3RhdGUoeyBzYXZpbmc6IGZhbHNlIH0pO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICB9LCB7XG4gICAgICAgIGtleTogJ3JlbmRlcicsXG4gICAgICAgIHZhbHVlOiBmdW5jdGlvbiByZW5kZXIoKSB7XG4gICAgICAgICAgICB2YXIgX3RoaXMyID0gdGhpcztcblxuICAgICAgICAgICAgdmFyIF9zdGF0ZSA9IHRoaXMuc3RhdGU7XG4gICAgICAgICAgICB2YXIgdmFsdWUgPSBfc3RhdGUudmFsdWU7XG4gICAgICAgICAgICB2YXIgbWl4ZWQgPSBfc3RhdGUubWl4ZWQ7XG4gICAgICAgICAgICB2YXIgc2F2aW5nID0gX3N0YXRlLnNhdmluZztcblxuICAgICAgICAgICAgaWYgKHNhdmluZykge1xuICAgICAgICAgICAgICAgIHJldHVybiBfcmVhY3QyWydkZWZhdWx0J10uY3JlYXRlRWxlbWVudChcbiAgICAgICAgICAgICAgICAgICAgTW9kZXJuU2VsZWN0RmllbGQsXG4gICAgICAgICAgICAgICAgICAgIHsgdmFsdWU6IFwic2F2aW5nXCIsIG9uQ2hhbmdlOiBmdW5jdGlvbiAoZSwgaSwgdikge30sIGRpc2FibGVkOiB0cnVlIH0sXG4gICAgICAgICAgICAgICAgICAgIF9yZWFjdDJbJ2RlZmF1bHQnXS5jcmVhdGVFbGVtZW50KF9tYXRlcmlhbFVpLk1lbnVJdGVtLCB7IHZhbHVlOiBcInNhdmluZ1wiLCBwcmltYXJ5VGV4dDogXCJTYXZpbmcgc3RhdHVzLi4uXCIgfSlcbiAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4gX3JlYWN0MlsnZGVmYXVsdCddLmNyZWF0ZUVsZW1lbnQoXG4gICAgICAgICAgICAgICAgTW9kZXJuU2VsZWN0RmllbGQsXG4gICAgICAgICAgICAgICAgeyB2YWx1ZTogbWl4ZWQgPyAnbWl4ZWQnIDogdmFsdWUsIG9uQ2hhbmdlOiBmdW5jdGlvbiAoZSwgaSwgdikge1xuICAgICAgICAgICAgICAgICAgICAgICAgX3RoaXMyLm9uU2VsZWN0b3JDaGFuZ2Uodik7XG4gICAgICAgICAgICAgICAgICAgIH0gfSxcbiAgICAgICAgICAgICAgICBtaXhlZCAmJiBfcmVhY3QyWydkZWZhdWx0J10uY3JlYXRlRWxlbWVudChfbWF0ZXJpYWxVaS5NZW51SXRlbSwgeyB2YWx1ZTogXCJtaXhlZFwiLCBwcmltYXJ5VGV4dDogXCJNaXhlZCB2YWx1ZXMuLi5cIiB9KSxcbiAgICAgICAgICAgICAgICBfcmVhY3QyWydkZWZhdWx0J10uY3JlYXRlRWxlbWVudChfbWF0ZXJpYWxVaS5NZW51SXRlbSwgeyB2YWx1ZTogXCJcIiwgcHJpbWFyeVRleHQ6IFwiSWdub3JlXCIgfSksXG4gICAgICAgICAgICAgICAgX3JlYWN0MlsnZGVmYXVsdCddLmNyZWF0ZUVsZW1lbnQoX21hdGVyaWFsVWkuTWVudUl0ZW0sIHsgdmFsdWU6IFwiTUVUQV9XQVRDSF9SRUFEXCIsIHByaW1hcnlUZXh0OiBcIk9uIGNvbnN1bHRhdGlvblwiIH0pLFxuICAgICAgICAgICAgICAgIF9yZWFjdDJbJ2RlZmF1bHQnXS5jcmVhdGVFbGVtZW50KF9tYXRlcmlhbFVpLk1lbnVJdGVtLCB7IHZhbHVlOiBcIk1FVEFfV0FUQ0hfQ0hBTkdFXCIsIHByaW1hcnlUZXh0OiBcIk9uIG1vZGlmaWNhdGlvblwiIH0pLFxuICAgICAgICAgICAgICAgIF9yZWFjdDJbJ2RlZmF1bHQnXS5jcmVhdGVFbGVtZW50KF9tYXRlcmlhbFVpLk1lbnVJdGVtLCB7IHZhbHVlOiBcIk1FVEFfV0FUQ0hfQk9USFwiLCBwcmltYXJ5VGV4dDogXCJPbiBjb25zdWx0YXRpb24gb3IgbW9kaWZpY2F0aW9uXCIgfSlcbiAgICAgICAgICAgICk7XG4gICAgICAgIH1cbiAgICB9XSk7XG5cbiAgICByZXR1cm4gV2F0Y2hTZWxlY3Rvcjtcbn0pKF9yZWFjdDJbJ2RlZmF1bHQnXS5Db21wb25lbnQpO1xuXG5leHBvcnRzWydkZWZhdWx0J10gPSBXYXRjaFNlbGVjdG9yO1xubW9kdWxlLmV4cG9ydHMgPSBleHBvcnRzWydkZWZhdWx0J107XG4iLCIvKlxuICogQ29weXJpZ2h0IDIwMDctMjAxNyBDaGFybGVzIGR1IEpldSAtIEFic3RyaXVtIFNBUyA8dGVhbSAoYXQpIHB5ZC5pbz5cbiAqIFRoaXMgZmlsZSBpcyBwYXJ0IG9mIFB5ZGlvLlxuICpcbiAqIFB5ZGlvIGlzIGZyZWUgc29mdHdhcmU6IHlvdSBjYW4gcmVkaXN0cmlidXRlIGl0IGFuZC9vciBtb2RpZnlcbiAqIGl0IHVuZGVyIHRoZSB0ZXJtcyBvZiB0aGUgR05VIEFmZmVybyBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlIGFzIHB1Ymxpc2hlZCBieVxuICogdGhlIEZyZWUgU29mdHdhcmUgRm91bmRhdGlvbiwgZWl0aGVyIHZlcnNpb24gMyBvZiB0aGUgTGljZW5zZSwgb3JcbiAqIChhdCB5b3VyIG9wdGlvbikgYW55IGxhdGVyIHZlcnNpb24uXG4gKlxuICogUHlkaW8gaXMgZGlzdHJpYnV0ZWQgaW4gdGhlIGhvcGUgdGhhdCBpdCB3aWxsIGJlIHVzZWZ1bCxcbiAqIGJ1dCBXSVRIT1VUIEFOWSBXQVJSQU5UWTsgd2l0aG91dCBldmVuIHRoZSBpbXBsaWVkIHdhcnJhbnR5IG9mXG4gKiBNRVJDSEFOVEFCSUxJVFkgb3IgRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UuICBTZWUgdGhlXG4gKiBHTlUgQWZmZXJvIEdlbmVyYWwgUHVibGljIExpY2Vuc2UgZm9yIG1vcmUgZGV0YWlscy5cbiAqXG4gKiBZb3Ugc2hvdWxkIGhhdmUgcmVjZWl2ZWQgYSBjb3B5IG9mIHRoZSBHTlUgQWZmZXJvIEdlbmVyYWwgUHVibGljIExpY2Vuc2VcbiAqIGFsb25nIHdpdGggUHlkaW8uICBJZiBub3QsIHNlZSA8aHR0cDovL3d3dy5nbnUub3JnL2xpY2Vuc2VzLz4uXG4gKlxuICogVGhlIGxhdGVzdCBjb2RlIGNhbiBiZSBmb3VuZCBhdCA8aHR0cHM6Ly9weWRpby5jb20+LlxuICovXG5cblwidXNlIHN0cmljdFwiO1xuXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHtcbiAgdmFsdWU6IHRydWVcbn0pO1xuXG5mdW5jdGlvbiBfaW50ZXJvcFJlcXVpcmUob2JqKSB7IHJldHVybiBvYmogJiYgb2JqLl9fZXNNb2R1bGUgPyBvYmpbXCJkZWZhdWx0XCJdIDogb2JqOyB9XG5cbnZhciBfSW5mb1BhbmVsID0gcmVxdWlyZShcIi4vSW5mb1BhbmVsXCIpO1xuXG5leHBvcnRzLkluZm9QYW5lbCA9IF9pbnRlcm9wUmVxdWlyZShfSW5mb1BhbmVsKTtcblxudmFyIF9Vc2VyUGFuZWwgPSByZXF1aXJlKFwiLi9Vc2VyUGFuZWxcIik7XG5cbmV4cG9ydHMuVXNlclBhbmVsID0gX2ludGVyb3BSZXF1aXJlKF9Vc2VyUGFuZWwpO1xuXG52YXIgX0NsaWVudCA9IHJlcXVpcmUoXCIuL0NsaWVudFwiKTtcblxuZXhwb3J0cy5BU0NsaWVudCA9IF9pbnRlcm9wUmVxdWlyZShfQ2xpZW50KTtcblxudmFyIF9BY3Rpdml0eSA9IHJlcXVpcmUoXCIuL0FjdGl2aXR5XCIpO1xuXG5leHBvcnRzLkFjdGl2aXR5ID0gX2ludGVyb3BSZXF1aXJlKF9BY3Rpdml0eSk7XG5cbnZhciBfQWN0aXZpdHlMaXN0ID0gcmVxdWlyZShcIi4vQWN0aXZpdHlMaXN0XCIpO1xuXG5leHBvcnRzLkFjdGl2aXR5TGlzdCA9IF9pbnRlcm9wUmVxdWlyZShfQWN0aXZpdHlMaXN0KTtcblxudmFyIF9MaXN0ZW5lciA9IHJlcXVpcmUoJy4vTGlzdGVuZXInKTtcblxuZXhwb3J0cy5MaXN0ZW5lciA9IF9pbnRlcm9wUmVxdWlyZShfTGlzdGVuZXIpO1xuXG52YXIgX0NhbGxiYWNrcyA9IHJlcXVpcmUoJy4vQ2FsbGJhY2tzJyk7XG5cbmV4cG9ydHMuQ2FsbGJhY2tzID0gX2ludGVyb3BSZXF1aXJlKF9DYWxsYmFja3MpO1xuXG52YXIgX1dhdGNoU2VsZWN0b3IgPSByZXF1aXJlKCcuL1dhdGNoU2VsZWN0b3InKTtcblxuZXhwb3J0cy5XYXRjaFNlbGVjdG9yID0gX2ludGVyb3BSZXF1aXJlKF9XYXRjaFNlbGVjdG9yKTtcbiJdfQ==
