# raml-json-enhance-node

A RAML's JSON enhancer node package to enhance JSON output of the RAML parser.

## Introduction

The project is based on the [raml2object](https://github.com/raml2html/raml2obj) node library but adjusted to work with the API Console.
API Console is composed of web components from the Advanced REST Client elements ecosystem. The elements (and therefore the API Console) requires this enhancement in order to display documentation for the API spec.

## Affected properties

This is the list of properties in the JavaScript object returned by the RAL JS parser affected by the enhancement process
- `types`, `traits`, `resourceTypes`, `annotationTypes`, `securitySchemes` - Becomes an object instead of array, keys are object name (with library variable name if applicable)
- `responses`, `body`, `queryParameters`, `headers`, `properties`, `baseUriParameters`, `annotations`, `uriParameters` are recusively transformed into the arrays
- types/{object} - Expanded form for a RAML type and a canonical form with computed inheritance and pushed unions to the top level of the type structure. See documantaion for the [expansion library](https://github.com/raml-org/raml-parser-toolbelt/tree/master/tools/datatype-expansion).
- resource/parentUrl - a full URL of the parent resource
- resource/allUriParameters - list of all URI parameters that apply to this resource (computed from the root down to current resource)
- resource/securedBy - Replaces security schema name with schema's definition.
- method/allUriParameters - The same as for a resource but applied to a method that is direct child of the resource.
- method/absoluteUri - Full, absolute URL to the method containg URI parametes in their RAML's form, eg `/{fileId}`
- method/securedBy - The same as for the resource
- method/\*/headers - Full list of all possible headers compured from traits, security schemes etc
- method/\*/queryParameters - Full list of all possible queryParameters compured from traits, security schemes etc
- method/responses - Full list of all possible response compured from traits, security schemes etc
- type/properties/items - replaces type name with type definition
- \*/example(s) - always produces `examples` as an array of example contents
- \*/structuredExample - content is moved to the \*.example array

## Installation

```
npm install --save raml-json-enhance-node
```

## Usage

### Basic

```javascript
const {RamlJsonEnhancer} = require('raml-json-enhance-node');

const enhancer = new RamlJsonEnhancer();
enhancer.enhance(ramlJsonOutput.specification)
.then((json) => {
  console.log(json);
})
.catch((cause) => console.error(cause));
```

### From RAML file

```javascript
const {RamlJsonGenerator} = require('raml-json-enhance-node');

const enhancer = new RamlJsonGenerator('./api.raml', {
  prettyPrint: true
});
enhancer.generate()
.then((json) => {
  console.log(json); // formatted JSON with `prettyPrint` option.
});
```

### Saving output to file

#### Enhancer only

```javascript
const {RamlJsonEnhancer} = require('raml-json-enhance-node');

const enhancer = new RamlJsonEnhancer();
enhancer.enhanceToFile(ramlJsonOutput.specification, './api.json')
.then((json) => {
  // JSON is now saved in api.json file.
  console.log(json);
})
.catch((cause) => console.error(cause));
```

#### From RAML file

```javascript
const {RamlJsonGenerator} = require('raml-json-enhance-node');

const enhancer = new RamlJsonGenerator('./api.raml', {
  output: './api.json'
});
enhancer.generate()
.then((json) => {
  // The file is saved now.
  console.log(json); // And JS object is available to use.
});
```
