const {RamlJsonGenerator} = require('..');
const fs = require('fs');

const apiUrl = 'https://cdn.rawgit.com/advanced-rest-client/raml-example-api/master/api.raml';
const enhancer = new RamlJsonGenerator(apiUrl);
enhancer.generate()
.then((data) => {
  fs.writeFileSync('build.json', JSON.stringify(data, null, 2), 'utf8');
})
.catch((data) => {
  console.error(data);
});
