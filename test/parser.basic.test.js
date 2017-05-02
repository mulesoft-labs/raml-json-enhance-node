'use strict';

const {RamlJsonGenerator} = require('..');
const assert = require('chai').assert;

describe('raml-json-enhance-node', () => {
  describe('parser basic', () => {
    var json;
    before(function(done) {
      this.timeout(20000);
      var apiUrl = 'https://cdn.rawgit.com/advanced-rest-client/raml-example-api/master/api.raml';
      const enhancer = new RamlJsonGenerator(apiUrl);
      enhancer.generate()
      .then((data) => {
        json = data;
        done();
      })
      .catch((cause) => {
        done(new Error(cause.message));
      });
    });

    it('should produce a JSON', function() {
      assert.isObject(json);
    });

    it('Types should be an object', function() {
      assert.isObject(json.types);
    });

    it('Traits should be an object', function() {
      assert.isObject(json.traits);
    });

    it('SecuritySchemes should be an object', function() {
      assert.isObject(json.securitySchemes);
    });

    it('resourceTypes should be an object', function() {
      assert.isObject(json.resourceTypes);
    });

    it('securedBy should be an array', function() {
      assert.isArray(json.securedBy);
    });

    it('resources should be an array', function() {
      assert.isArray(json.resources);
    });

    it('protocols should be an array', function() {
      assert.isArray(json.protocols);
    });

    it('documentation should be an array', function() {
      assert.isArray(json.documentation);
    });

    it('baseUriParameters should be an array', function() {
      assert.isArray(json.baseUriParameters);
    });
  });
});
