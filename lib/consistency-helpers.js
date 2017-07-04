/**
 * This code is from https://github.com/raml2html/raml2obj
 */

/**
 * @license
 * The MIT License (MIT)
 *
 * Copyright (c) 2014 Kevin Renskers
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */
function _isObject(obj) {
  return obj === Object(obj);
}

function makeConsistent(obj, types) {
  if (Array.isArray(obj)) {
    obj.forEach((value) => {
      makeConsistent(value, types);
    });
  } else if (_isObject(obj)) {
    if (obj.type) {
      if (Array.isArray(obj.type)) {
        obj.type = obj.type[0];
      }

      if (types && types[obj.type]) {
        let typedef = types[obj.type];
        // Examples should be merged instead of being overriden.
        var objectExamples = [];
        if (obj.examples && typedef.examples) {
          objectExamples = obj.examples;
        }
        if (obj.example && typedef.example) {
          objectExamples.push(obj.example);
        }
        let objectProperties = obj.properties;
        let objectItems = obj.items;
        let objectDefault = obj.default;
        // let objectDisplayName = obj.displayName; // Don't do this or body will have ugly name.
        let objectDescription = obj.description;
        let objectEnum = obj.enum;
        // First remember current value of the object properties
        // and then override type's value.
        Object.assign(obj, types[obj.type]);
        if (objectExamples.length) {
          if (!obj.examples || !obj.examples.length) {
            obj.examples = [];
          }
          objectExamples.forEach(function(item) {
            obj.examples.push(item);
          });
        }
        if (objectProperties) {
          Object.assign(obj.properties, objectProperties);
        }
        if (objectItems) {
          Object.assign(obj.items, objectItems);
        }
        if (objectDefault) {
          obj.default = objectDefault;
        }
        // if (objectDisplayName) {
        //   obj.displayName = objectDisplayName;
        // }
        if (objectDescription) {
          obj.description = objectDescription;
        }
        if (objectEnum) {
          obj.enum = objectEnum;
        }
      }
    }

    if (obj.items && types && types[obj.items]) {
      obj.items = types[obj.items];
    }

    if (obj.examples && obj.examples.length) {
      obj.examples = obj.examples.map(example => (example.value ? example.value : example));
    }

    if (obj.structuredExample) {
      if (typeof obj.examples === 'undefined') {
        obj.examples = [];
      }

      obj.examples.push(obj.structuredExample.value);
      delete obj.example;
      delete obj.structuredExample;
    }

    Object.keys(obj).forEach((key) => {
      makeConsistent(obj[key], types);
    });
  }

  return obj;
}

module.exports = makeConsistent;
