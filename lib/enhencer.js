'use strict';

const expancionLib = require('datatype-expansion');
// No destructors in Node 4.0
const arraysToObjects = require('./arrays-objects').arraysToObjects;
const recursiveObjectToArray = require('./arrays-objects').recursiveObjectToArray;
const makeConsistent = require('./consistency-helpers');
const fs = require('fs');
/**
 * The RAML JSON enhancer library for node.
 *
 * This library is inspired by the raml2object library
 * (https://github.com/raml2html/raml2obj) and uses some of it's code.
 * However it was adjusted to work with Advanced REST Client elements
 * to create the API console (by Mulesoft).
 *
 * Use this library to "enhance" JSON output of the raml-js-parser-2
 * that can be used with the API console or any other RAML related ARC element.
 */
class RamlJsonEnhancer {
  /**
   * Enchances RAML's JSON parser output by normalizing data type structure and
   * by expanding types definition useing the datatype_expansion library.
   *
   * @param {Object} json The JSON output from the raml-js-parser-2
   * @return {Promise} Fulfilled object with enhanced JSON structure.
   */
  enhance(json) {
    if (json.specification) {
      json = json.specification;
    }
    arraysToObjects(json);
    return this._expandRootTypes(json.types)
    .then((expanded) => {
      const types = makeConsistent(expanded);
      delete json.types;
      makeConsistent(json, types);
      recursiveObjectToArray(json);
      this.securitySchemes = json.securitySchemes;
      this._enhaceJson(json);
      if (types) {
        json.types = types;
      }
      return json;
    });
  }

  /**
   * Enchances RAML's JSON parser output by normalizing data type structure and
   * by expanding types definition useing the datatype_expansion library.
   * The result of the operation will be saved to a file.
   *
   * @param {Object} json The JSON output from the raml-js-parser-2
   * @param {String} file Path to a file where to save the data.
   * @return {Promise} Fulfilled object with enhanced JSON structure.
   */
  enhanceToFile(json, file) {
    return this.enhance(json)
    .then((data) => this._writeFile(JSON.stringify(data, null, 2), file));
  }

  /**
   * Writes `data` to a `file`.
   *
   * @param {String} data A data to write
   * @param {String} file Path to a file where to save the data.
   */
  _writeFile(data, file) {
    return new Promise((resolve, reject) => {
      fs.writeFile(file, data, function(err) {
        if (err) {
          return reject(err);
        }
        resolve(data);
      });
    });
  }

  /**
   * Applies security schemas properties to the resources and methods.
   * If the security scheme has a `describedBy` field the corresponding fields
   * will be updated.
   *
   * This function should be called once per object since it won't check
   * if the properties from the security schema was already applied.
   *
   * This function returns nothing. Changes are made deep inside the object
   * so it is resolved by referewnce.
   *
   * @param {Object} object resource or method definition
   */
  _applySecuritySchemes(object) {
    if (!object.queryParameters) {
      object.queryParameters = [];
    }
    if (!object.headers) {
      object.headers = [];
    }
    if (!object.securedBy) {
      object.securedBy = [];
    }
    var responses = [];
    object.securedBy.forEach(function(scheme) {
      if (!scheme || typeof scheme === 'string') {
        return;
      }
      if (scheme.describedBy) {
        if (scheme.describedBy.queryParameters) {
          object.queryParameters = object.queryParameters
            .concat(scheme.describedBy.queryParameters);
        }
        if (scheme.describedBy.headers) {
          object.headers = object.headers.concat(scheme.describedBy.headers);
        }
        if (scheme.describedBy.responses) {
          responses = responses.concat(scheme.describedBy.responses);
        }
      }
    });
    if (object.responses) {
      responses = responses.concat(object.responses);
    }
    responses.sort(function(a, b) {
      var aCode = Number(a.code);
      var bCode = Number(b.code);
      if (aCode > bCode) {
        return 1;
      }
      if (aCode < bCode) {
        return -1;
      }
      return 0;
    });
    object.responses = responses;
  }

  // Checks if given `obj` is an Object.
  isObject(obj) {
    return obj === Object(obj);
  }

  /**
   * Detect and add security scheme definitions to the object.
   * It replaces the id of the security scheme on a resource / method level with
   * Security Scheme type definition.
   *
   * @param {Object} object An object where security schemes should be applied. Either RAML method
   * or resource
   * @param {Object} rootSchemes Defined on a root level security schemes.
   */
  _addSecuritSchemes(object) {
    var rootSchemes = this.securitySchemes;
    if (!rootSchemes || !Object.keys(rootSchemes).length) {
      return;
    }

    if (!object || !object.securedBy || !object.securedBy.length) {
      return;
    }

    var added = false;
    object.securedBy.forEach((item, i) => {
      if (typeof item === 'string') {
        if (item in rootSchemes) {
          added = true;
          object.securedBy[i] = Object.assign({}, rootSchemes[item]);
        }
      } else if (this.isObject(item)) {
        let keys = Object.keys(item);
        let key = keys[0];
        if (key in rootSchemes) {
          added = true;
          let schema = Object.assign({}, rootSchemes[key]);
          let params = item[key];
          schema.settings = Object.assign({}, schema.settings, params);
          object.securedBy[i] = schema;
        }
      }
    });
    if (added) {
      this._applySecuritySchemes(object);
    }
  }

  /**
   * Recursevily adds the URI parameters to methods and resources.
   * It also applies security schemas definitions on a resource and method level.
   *
   * Affected properties:
   * - resource/parentUrl - a full URL of the parent resource
   * - resource/allUriParameters - list of all URI parameters that apply to this
   * resource (computed from the root down to current resource)
   * - resource/securedBy - Replaces security schema name with schema's
   * definition.
   * - method/allUriParameters - The same as for a resource but applied to a
   * method that is direct child of the resource.
   * - method/absoluteUri - Full, absolute URL to the method containg URI
   * parametes in their RAML's form, eg `/{fileId}`
   * - method/securedBy - The same as for the resource
   */
  _enhaceJson(ramlObj, parentUrl, allUriParameters) {
    if (!ramlObj.resources) {
      return;
    }

    ramlObj.resources.forEach((resource) => {
      resource.parentUrl = parentUrl || '';
      resource.allUriParameters = ramlObj.baseUriParameters || [];

      if (allUriParameters) {
        resource.allUriParameters = resource.allUriParameters.concat(allUriParameters);
      }

      if (resource.uriParameters) {
        resource.allUriParameters = resource.allUriParameters.concat(resource.uriParameters);
      }

      if (resource.methods) {
        resource.methods.forEach((method) => {
          method.allUriParameters = resource.allUriParameters;
          method.absoluteUri = resource.absoluteUri;
          this._addSecuritSchemes(method);
        });
      }
      this._addSecuritSchemes(resource);

      this._enhaceJson(resource, resource.parentUrl + resource.relativeUri,
        resource.allUriParameters);
    });
  }

  /**
   * The RAML expanded form for a RAML type, resolves references and fills
   * missing information to compute a fully expanded representation of the type.
   *
   * The canonical form computes inheritance and pushes unions to the top
   * level of the type structure of an expanded RAML type.
   *
   * More info:
   * https://github.com/raml-org/raml-parser-toolbelt/tree/master/tools/datatype-expansion
   *
   * @param {Object} types A map of RAML types
   * @return {Promise} Resolved to expanded canonical form of RAML types.
   */
  _expandRootTypes(types) {
    if (!types) {
      return Promise.resolve(types);
    }
    var promises = Object.keys(types).map((key) => this._expandType(types, key));
    return Promise.all(promises)
      .then((results) => {
        results.forEach((result) => {
          types[result[0]] = result[1];
        });
        return types;
      });
  }
  /**
   * Expands a single type.
   *
   * @param {Object} types A map of RAML types
   * @param {String} key A key of currently processed type.
   * @return {Promise} Resolved to expanded canonical form of the type.
   */
  _expandType(types, key) {
    return new Promise((resolve) => {
      expancionLib.expandedForm(types[key], types, (err, expanded) => {
        if (expanded) {
          expancionLib.canonicalForm(expanded, (err2, canonical) => {
            if (canonical) {
              resolve([key, canonical]);
            } else {
              resolve([key, types[key]]);
            }
          });
        } else {
          resolve([key, types[key]]);
        }
      });
    });
  }
}
module.exports.RamlJsonEnhancer = RamlJsonEnhancer;
