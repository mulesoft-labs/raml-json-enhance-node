'use strict';

const parser = require('raml-1-parser');
const {RamlJsonEnhancer} = require('..');

class TestRamlLoader {
  constructor() {
    this.urls = {
      'drive': './test/drive-raml-api-v2/api.raml',
      'arc-example': 'https://cdn.rawgit.com/advanced-rest-client/raml-example-api/master/api.raml',
      'inline-types': './test/inline-types.raml',
      'types-with-types': './test/types-with-types.raml',
      'recursive-types': './test/SE-9616/loop.raml'
    };
  }

  getJson(url) {
    return parser.loadApi(url)
    .then((api) => {
      return api.expand(true)
      .toJSON({
        dumpSchemaContents: false,
        rootNodeDetails: true,
        serializeMetadata: false
      }).specification;
    })
    .then((spec) => {
      const enhancer = new RamlJsonEnhancer();
      return enhancer.enhance(spec);
    });
  }

  driveApi() {
    const url = this.urls.drive;
    return this.getJson(url);
  }

  arcExampleApi() {
    const url = this.urls['arc-example'];
    return this.getJson(url);
  }

  inlineTypes() {
    const url = this.urls['inline-types'];
    return this.getJson(url);
  }

  typesWithTypes() {
    const url = this.urls['types-with-types'];
    return this.getJson(url);
  }

  recursiveTypes() {
    const url = this.urls['recursive-types'];
    return this.getJson(url);
  }
}

module.exports.TestRamlLoader = TestRamlLoader;
