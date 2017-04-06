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

    it('Example in method body', function() {
      assert.isArray(json.resources[0].methods[0].body[0].examples);
    });

    it('Example in method headers', function() {
      assert.isArray(json.resources[0].methods[0].headers[0].examples);
    });

    it('Example in method responses', function() {
      assert.isArray(json.resources[0].methods[0].responses[0].body[0].examples);
    });
  });
});
