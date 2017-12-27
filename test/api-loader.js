'use strict';

const parser = require('raml-1-parser');
const {RamlJsonEnhancer} = require('..');

class TestRamlLoader {
  constructor() {
    this.urls = {
      'drive': './test/drive-raml-api-v2/api.raml',
      'arc-example': 'https://cdn.rawgit.com/advanced-rest-client/raml-example-api/master/api.raml',
      'inline-types': './test/inline-types.raml'
    };
  }

  getJson(url) {
    return parser.loadApi(url)
    .then(api => {
      return api.expand(true)
      .toJSON({
        dumpSchemaContents: false,
        rootNodeDetails: true,
        serializeMetadata: false
      }).specification;
    })
    .then(spec => {
      const enhancer = new RamlJsonEnhancer();
      return enhancer.enhance(spec);
    });
  }

  driveApi() {
    var url = this.urls.drive;
    return this.getJson(url);
  }

  arcExampleApi() {
    var url = this.urls['arc-example'];
    return this.getJson(url);
  }

  inlineTypes() {
    var url = this.urls['inline-types'];
    return this.getJson(url);
  }
}

module.exports.TestRamlLoader = TestRamlLoader;
