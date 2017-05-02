'use strict';

const fs = require('fs');
const parser = require('raml-1-parser');
const {RamlJsonEnhancer} = require('./enhencer');

/**
 * Builds a JSON data / file with the API definition out from the RAML file.
 */
class JsonGenerator {

  /**
   * Constructs the builder.
   *
   * @param {String} raml Target RAML file to generate the JSON from.
   * @param {Object} opts Options passed from the command line.
   */
  constructor(raml, opts) {
    if (!raml) {
      throw new Error('The RAML argument is not specified.');
    }
    opts = opts || {};
    /**
     * The RAML source file.
     * It can be either local path or an URL to the RAML spec.
     */
    this._sourceFile = raml;
    /**
     * A JSON file name and path.
     * If set it will create a file with JSON data instead of returning the data.
     *
     * Defaults to `undefined`.
     */
    this._targetFile = opts.output || undefined;
    /**
     * If true, then the output JSON will be formatted.
     *
     * Defaults to `false`.
     */
    this.prettyPrint = opts.prettyPrint || false;
    /**
     * Print output messages.
     */
    this.verbose = opts.verbose || false;
  }

  // Prints arguments to the console.
  log() {
    if (this.verbose) {
      console.log.apply(console, arguments);
    }
  }

  /**
   * Runs the command.
   */
  generate() {
    this.log('Generating JSON file from %s', this._targetFile);
    return this.parse()
    .then((json) => this.enhance(json))
    .then((json) => this.save(json));
  }
  /**
   * Pasrses the RAML file and generates JSON.
   *
   * @return {Object} The `specification` property of RAML's JSON generator.
   */
  parse() {
    this.log('Parsing RAML...');
    return parser.loadApi(this._sourceFile)
    .then(api => {
      this.log('RAML loaded, generating JSON.');
      return api.expand(true)
      .toJSON({
        dumpSchemaContents: false,
        rootNodeDetails: true,
        serializeMetadata: false
      }).specification;
    });
  }

  enhance(json) {
    this.log('Enhancing JSON...');
    const enhancer = new RamlJsonEnhancer();
    return enhancer.enhance(json);
  }

  save(json) {
    if (!this._targetFile) {
      this.log('JSON ready.');
      return json;
    }
    this.log('Saving to %s...', this._targetFile);
    return new Promise((resolve, reject) => {
      if (this.prettyPrint) {
        json = JSON.stringify(json, null, 2);
      } else {
        json = JSON.stringify(json);
      }
      fs.writeFile(this._targetFile, json, 'utf8', function(err) {
        if (err) {
          reject(new Error(err.message));
          return;
        }
        resolve();
      });
    });
  }
}

exports.JsonGenerator = JsonGenerator;
