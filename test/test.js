const {RamlJsonGenerator} = require('..');
const fs = require('fs');

// const apiUrl = 'test/address-1.0.0-raml-fragment/address.raml';
// const apiUrl = 'test/employment-1.0.0-raml-fragment/employment.raml';
// const apiUrl = 'test/phone-1.0.0-raml-fragment/phone.raml';
const apiUrl = 'test/drive-raml-api-v2/api.raml';
const enhancer = new RamlJsonGenerator(apiUrl);
enhancer.generate()
.then((data) => {
  fs.writeFileSync('build.json', JSON.stringify(data, null, 2), 'utf8');
})
.catch((data) => {
  console.error(data);
});
