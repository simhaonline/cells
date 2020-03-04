/**
 * Pydio Cells Rest API
 * No description provided (generated by Swagger Codegen https://github.com/swagger-api/swagger-codegen)
 *
 * OpenAPI spec version: 1.0
 * 
 *
 * NOTE: This class is auto generated by the swagger code generator program.
 * https://github.com/swagger-api/swagger-codegen.git
 * Do not edit the class manually.
 *
 */

'use strict';

exports.__esModule = true;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _ApiClient = require('../ApiClient');

var _ApiClient2 = _interopRequireDefault(_ApiClient);

var _TreeGeoQuery = require('./TreeGeoQuery');

var _TreeGeoQuery2 = _interopRequireDefault(_TreeGeoQuery);

var _TreeNodeType = require('./TreeNodeType');

var _TreeNodeType2 = _interopRequireDefault(_TreeNodeType);

/**
* The TreeQuery model module.
* @module model/TreeQuery
* @version 1.0
*/

var TreeQuery = (function () {
    /**
    * Constructs a new <code>TreeQuery</code>.
    * @alias module:model/TreeQuery
    * @class
    */

    function TreeQuery() {
        _classCallCheck(this, TreeQuery);

        this.Paths = undefined;
        this.PathPrefix = undefined;
        this.MinSize = undefined;
        this.MaxSize = undefined;
        this.MinDate = undefined;
        this.MaxDate = undefined;
        this.Type = undefined;
        this.FileName = undefined;
        this.Content = undefined;
        this.FreeString = undefined;
        this.Extension = undefined;
        this.GeoQuery = undefined;
        this.PathDepth = undefined;
        this.UUIDs = undefined;
        this.Not = undefined;
    }

    /**
    * Constructs a <code>TreeQuery</code> from a plain JavaScript object, optionally creating a new instance.
    * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
    * @param {Object} data The plain JavaScript object bearing properties of interest.
    * @param {module:model/TreeQuery} obj Optional instance to populate.
    * @return {module:model/TreeQuery} The populated <code>TreeQuery</code> instance.
    */

    TreeQuery.constructFromObject = function constructFromObject(data, obj) {
        if (data) {
            obj = obj || new TreeQuery();

            if (data.hasOwnProperty('Paths')) {
                obj['Paths'] = _ApiClient2['default'].convertToType(data['Paths'], ['String']);
            }
            if (data.hasOwnProperty('PathPrefix')) {
                obj['PathPrefix'] = _ApiClient2['default'].convertToType(data['PathPrefix'], ['String']);
            }
            if (data.hasOwnProperty('MinSize')) {
                obj['MinSize'] = _ApiClient2['default'].convertToType(data['MinSize'], 'String');
            }
            if (data.hasOwnProperty('MaxSize')) {
                obj['MaxSize'] = _ApiClient2['default'].convertToType(data['MaxSize'], 'String');
            }
            if (data.hasOwnProperty('MinDate')) {
                obj['MinDate'] = _ApiClient2['default'].convertToType(data['MinDate'], 'String');
            }
            if (data.hasOwnProperty('MaxDate')) {
                obj['MaxDate'] = _ApiClient2['default'].convertToType(data['MaxDate'], 'String');
            }
            if (data.hasOwnProperty('Type')) {
                obj['Type'] = _TreeNodeType2['default'].constructFromObject(data['Type']);
            }
            if (data.hasOwnProperty('FileName')) {
                obj['FileName'] = _ApiClient2['default'].convertToType(data['FileName'], 'String');
            }
            if (data.hasOwnProperty('Content')) {
                obj['Content'] = _ApiClient2['default'].convertToType(data['Content'], 'String');
            }
            if (data.hasOwnProperty('FreeString')) {
                obj['FreeString'] = _ApiClient2['default'].convertToType(data['FreeString'], 'String');
            }
            if (data.hasOwnProperty('Extension')) {
                obj['Extension'] = _ApiClient2['default'].convertToType(data['Extension'], 'String');
            }
            if (data.hasOwnProperty('GeoQuery')) {
                obj['GeoQuery'] = _TreeGeoQuery2['default'].constructFromObject(data['GeoQuery']);
            }
            if (data.hasOwnProperty('PathDepth')) {
                obj['PathDepth'] = _ApiClient2['default'].convertToType(data['PathDepth'], 'Number');
            }
            if (data.hasOwnProperty('UUIDs')) {
                obj['UUIDs'] = _ApiClient2['default'].convertToType(data['UUIDs'], ['String']);
            }
            if (data.hasOwnProperty('Not')) {
                obj['Not'] = _ApiClient2['default'].convertToType(data['Not'], 'Boolean');
            }
        }
        return obj;
    };

    /**
    * @member {Array.<String>} Paths
    */
    return TreeQuery;
})();

exports['default'] = TreeQuery;
module.exports = exports['default'];

/**
* @member {Array.<String>} PathPrefix
*/

/**
* @member {String} MinSize
*/

/**
* @member {String} MaxSize
*/

/**
* @member {String} MinDate
*/

/**
* @member {String} MaxDate
*/

/**
* @member {module:model/TreeNodeType} Type
*/

/**
* @member {String} FileName
*/

/**
* @member {String} Content
*/

/**
* @member {String} FreeString
*/

/**
* @member {String} Extension
*/

/**
* @member {module:model/TreeGeoQuery} GeoQuery
*/

/**
* @member {Number} PathDepth
*/

/**
* @member {Array.<String>} UUIDs
*/

/**
* @member {Boolean} Not
*/
