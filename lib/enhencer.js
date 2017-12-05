'use strict';

const fs = require('fs');
const arcRaml2obj = require('raml2obj');
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
    return arcRaml2obj.parse({
      json: json
    })
    .then(result => result.json);
  }

  /**
   * Enchances RAML's JSON parser output by normalizing data type structure and
   * by expanding types definition useing the datatype_expansion library.
   * The result of the operation will be saved to a file.
   *
   * @param {Object} json The JSON output from the raml-js-parser-2
   * @param {String} file Path to a file where to save the data.
   * @param {Object} opts Additional options:
   * - pretty - pretty print output
   * @return {Promise} Fulfilled object with enhanced JSON structure.
   */
  enhanceToFile(json, file, opts) {
    opts = opts || {};
    return this.enhance(json)
    .then(data => {
      data = data.json;
      if (opts.pretty) {
        data = JSON.stringify(data, null, 2);
      }
      return this._writeFile(data, file);
    });
  }

  /**
   * Writes `data` to a `file`.
   *
   * @param {String} data A data to write
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
}
module.exports.RamlJsonEnhancer = RamlJsonEnhancer;
