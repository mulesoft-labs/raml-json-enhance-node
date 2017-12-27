/* eslint-env node, mocha */
const TestRamlLoader = require('./api-loader').TestRamlLoader;
const assert = require('chai').assert;

describe('raml2obj', () => {
  describe('inline-types.raml', () => {

    let response;
    before(function() {
      this.timeout(20000);
      const loader = new TestRamlLoader();
      return loader.inlineTypes()
      .then(function(spec) {
        response = spec.resources[1].methods[0].responses[0].body[0];
      });
    });

    it('Response\'s type is object', () => {
      assert.equal(response.type, 'object');
    });

    it('Response has properties', () => {
      assert.typeOf(response.properties, 'array');
      assert.lengthOf(response.properties, 3);
    });

    it('Meta property has properties', function() {
      assert.typeOf(response.properties[0].properties, 'array');
      assert.lengthOf(response.properties[0].properties, 1);
    });

    it('Meta property has array property', function() {
      assert.equal(response.properties[0].properties[0].type, 'array');
    });
  });
});
