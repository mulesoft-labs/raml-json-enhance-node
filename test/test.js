const {RamlJsonGenerator} = require('..');

const apiUrl = 'https://cdn.rawgit.com/advanced-rest-client/raml-example-api/master/api.raml';
const enhancer = new RamlJsonGenerator(apiUrl);
enhancer.generate()
.then((data) => {
  console.log(data);
})
.catch((data) => {
  console.error(data);
});
