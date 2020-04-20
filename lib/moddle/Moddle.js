import { isString, isFunction, assign } from 'min-dash';

import { Moddle } from 'moddle';

import { Reader, Writer } from 'moddle-xml';

/**
 * A sub class of {@link Moddle} with support for import and export of Postit-js xml files.
 *
 * @class PostitModdle
 *
 * @extends Moddle
 *
 * @param {Object|Array} packages to use for instantiating the model
 * @param {Object} [options] additional options to pass over
 */
export default function PostitModdle(packages, options) {
  Moddle.call(this, packages, options);
}

PostitModdle.prototype = Object.create(Moddle.prototype);

/**
 * The fromXML result.
 *
 * @typedef {Object} ParseResult
 *
 * @property {ModdleElement} rootElement
 * @property {Array<Object>} references
 * @property {Array<Error>} warnings
 * @property {Object} elementsById - a mapping containing each ID -> ModdleElement
 */

/**
 * The fromXML error.
 *
 * @typedef {Error} ParseError
 *
 * @property {Array<Error>} warnings
 */

/**
 * Instantiates a Postit model tree from a given xml string.
 *
 * @param {String}   xmlStr
 * @param {String}   [typeName='postit:Definitions'] name of the root element
 * @param {Object}   [options]  options to pass to the underlying reader
 * @param {Function} done       callback that is invoked with (err, result, parseContext)
 *                              once the import completes
 */
PostitModdle.prototype.fromXML = function(xmlStr, typeName, options, done) {
  if (!isString(typeName)) {
    done = options;
    options = typeName;
    typeName = 'postit:Definitions';
  }

  if (isFunction(options)) {
    done = options;
    options = {};
  }


  var reader = new Reader(assign({ model: this, lax: true }, options));
  var rootHandler = reader.handler(typeName);

  return reader.fromXML(xmlStr, rootHandler, done);
};

/**
 * The toXML result.
 *
 * @typedef {Object} SerializationResult
 *
 * @property {String} xml
 */

/**
 * Serializes a Postit object tree to XML.
 *
 * @param {String}   element    the root element, typically an instance of `postit:Definitions`
 * @param {Object}   [options]  to pass to the underlying writer
 * @param {Function} done       callback invoked with (err, xmlStr) once the import completes
 */
PostitModdle.prototype.toXML = function(element, options, done) {
  if (isFunction(options)) {
    done = options;
    options = {};
  }

  var writer = new Writer(options);

  var result;
  var err;

  try {
    result = writer.toXML(element);
  } catch (e) {
    err = e;
  }

  return done(err, result);
};
