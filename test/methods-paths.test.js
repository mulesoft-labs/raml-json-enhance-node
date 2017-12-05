'use strict';

const TestRamlLoader = require('./api-loader').TestRamlLoader;
const assert = require('chai').assert;

describe('raml-json-enhance-node', () => {
  describe('Method pats test', () => {
    var json;
    before(function() {
      this.timeout(20000);
      const loader = new TestRamlLoader();
      return loader.arcExampleApi()
      .then(function(spec) {
        json = spec;
      });
    });

    it('Resource contains paths definitions', function() {
      const resource = json.resources[0];
      assert.equal(resource.relativeUri, '/test-parameters/{feature}');
      assert.equal(resource.absoluteUri,
        'http://{environment}.api.domain.com/{version}/test-parameters/{feature}');
      assert.equal(resource.parentUrl, '');
    });

    it('Child resource has parent Url', function() {
      const resource = json.resources[0].resources[0];
      assert.equal(resource.parentUrl, '/test-parameters/{feature}');
    });

    it('Method has paths definitions', function() {
      const method = json.resources[0].methods[0];
      assert.equal(method.relativeUri, '/test-parameters/{feature}');
      assert.equal(method.absoluteUri,
        'http://{environment}.api.domain.com/{version}/test-parameters/{feature}');
      assert.equal(method.baseUri, 'http://{environment}.api.domain.com/{version}/');
    });
  });
});
