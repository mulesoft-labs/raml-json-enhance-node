/* eslint-env node, mocha */
const TestRamlLoader = require('./api-loader').TestRamlLoader;
const assert = require('chai').assert;

describe('types-with-types.raml', () => {

  let props;
  before(function() {
    this.timeout(20000);
    const loader = new TestRamlLoader();
    return loader.typesWithTypes()
    .then(function(spec) {
      props = spec.types.myType.properties;
    });
  });

  it('Contains 3 properties', () => {
    assert.lengthOf(props, 3);
  });

  it('All properties are objects', () => {
    const nonObject = props.find((prop) => typeof prop !== 'object');
    assert.isUndefined(nonObject);
  });
});
