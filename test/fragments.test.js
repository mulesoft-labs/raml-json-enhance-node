'use strict';

const {RamlJsonGenerator} = require('..');
const assert = require('chai').assert;

describe('raml-json-enhance-node', () => {
  describe('fragment tests', () => {
    var type;
    before(function(done) {
      this.timeout(20000);
      var apiUrl = './test/fragments/address.raml';
      const enhancer = new RamlJsonGenerator(apiUrl);
      enhancer.generate({
        prettyPrint: true
      })
      .then((data) => {
        type = data;
        done();
      })
      .catch((cause) => {
        done(new Error(cause.message));
      });
    });

    it('should produce a JSON', function() {
      assert.isObject(type);
    });

    it('Should contain namespace', function() {
      assert.equal(type.namespace, 'ObjectTypeDeclaration');
    });

    it('Should contain type property', function() {
      assert.equal(type.type, 'object');
    });

    it('Should contain properties', function() {
      assert.ok(type.properties);
    });

    it('Properties should be an array', function() {
      assert.typeOf(type.properties, 'array');
    });
  });

  describe('fragments expansion', () => {
    var type;
    before(function(done) {
      this.timeout(20000);
      var apiUrl = './test/fragments/person.raml';
      const enhancer = new RamlJsonGenerator(apiUrl);
      enhancer.generate({
        prettyPrint: true
      })
      .then((data) => {
        type = data;
        done();
      })
      .catch((cause) => {
        done(new Error(cause.message));
      });
    });

    it('should produce a JSON', function() {
      assert.isObject(type);
    });

    it('Expanded address property', function() {
      var property = type.properties[1];
      assert.isObject(property);
      assert.isArray(property.properties);
      assert.lengthOf(property.properties, 6);
    });

    it('Expanded phone property', function() {
      var property = type.properties[2];
      assert.isObject(property);
      assert.isArray(property.properties);
      assert.lengthOf(property.properties, 2);
    });

    it('Expanded employment property', function() {
      var property = type.properties[3];
      assert.isObject(property);
      assert.isArray(property.properties);
      assert.lengthOf(property.properties, 3);
    });
  });
});
