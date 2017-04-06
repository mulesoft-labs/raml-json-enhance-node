'use strict';

const TestRamlLoader = require('./api-loader').TestRamlLoader;
const assert = require('chai').assert;

describe('raml-json-enhance-node', () => {
  describe('basic tests', () => {
    var json;
    before(function() {
      this.timeout(20000);
      const loader = new TestRamlLoader();
      return loader.arcExampleApi()
      .then(function(spec) {
        json = spec;
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

    it('annotationTypes should be an object', function() {
      assert.isObject(json.annotationTypes);
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
