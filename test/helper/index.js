/**
 * A helper file that may be used in test cases for postit-js and extensions.
 *
 * Provides the globals
 *
 * * bootstrapModeler(): bootstrap a modeler instance
 * * bootstrapViewer(): bootstrap a viewer instance
 * * inject(function(a, b) {}): inject the postit-js services in the given function
 *
 *
 * In addition it provides the utilities
 *
 * * insertCSS(name, css): add a CSS file to be used in test cases
 *
 *
 * It is recommended to expose the helper through a per-project utility and
 * and perform custom bootstrapping (CSS, ...) in that utility.
 *
 * ```
 * export * from 'postit-js-core/test/helper';
 *
 * import {
 *   insertCSS
 * } from 'postit-js-core/test/helper';
 *
 * var fs = require('fs');
 *
 * // insert postit-js.css
 * insertCSS('postit-js.css', require('postit-js-core/assets/postit-js.css'));
 * ```
 */

import {
  isFunction,
  forEach,
  merge
} from 'min-dash';

import TestContainer from 'mocha-test-container-support';

import Modeler from '../../lib/Modeler';

var OPTIONS, POSTIT_JS;

export function boostrapPostitJS(PostitJS, diagram, options, locals) {

  return function() {
    var testContainer;

    // Make sure the test container is an optional dependency and we fall back
    // to an empty <div> if it does not exist.
    //
    // This is needed if other libraries rely on this helper for testing
    // while not adding the mocha-test-container-support as a dependency.
    try {

      // 'this' is the current test context
      testContainer = TestContainer.get(this);
    } catch (e) {
      testContainer = document.createElement('div');
      testContainer.classList.add('test-content-container');

      document.body.appendChild(testContainer);
    }

    var _options = options,
        _locals = locals;

    if (_locals === undefined && isFunction(_options)) {
      _locals = _options;
      _options = null;
    }

    if (isFunction(_options)) {
      _options = _options();
    }

    if (isFunction(_locals)) {
      _locals = _locals();
    }

    _options = merge({
      container: testContainer,
      canvas: {
        deferUpdate: false
      }
    }, OPTIONS, _options);

    if (_locals) {
      var mockModule = {};

      forEach(_locals, function(v, k) {
        mockModule[k] = ['value', v];
      });

      _options.modules = [].concat(_options.modules || [], [ mockModule ]);
    }

    if (_options.modules && !_options.modules.length) {
      _options.modules = undefined;
    }

    clearPostitJS();

    var instance = new PostitJS(_options);

    setPostitJS(instance);

    return instance.importXML(diagram).then(function(result) {
      return { error: null, warnings: result.warnings };
    }).catch(function(err) {
      return { error: err, warnings: err.warnings };
    });
  };
}


export function bootstrapModeler(diagram, options, locals) {
  return boostrapPostitJS(Modeler, diagram, options, locals);
}

export function inject(fn) {
  return function() {

    if (!POSTIT_JS) {
      throw new Error(
        'no bootstraped bpmn-js instance, ' +
        'ensure you created it via #boostrap(Modeler|Viewer)'
      );
    }

    POSTIT_JS.invoke(fn);
  };
}

export function getPostitJS() {
  return POSTIT_JS;
}

export function clearPostitJS() {

  // clean up old bpmn-js instance
  if (POSTIT_JS) {
    POSTIT_JS.destroy();

    POSTIT_JS = null;
  }
}

export function setPostitJS(instance) {
  POSTIT_JS = instance;
}

export function insertCSS(name, css) {
  if (document.querySelector('[data-css-file="' + name + '"]')) {
    return;
  }

  var head = document.head || document.getElementsByTagName('head')[0],
      style = document.createElement('style');
  style.setAttribute('data-css-file', name);

  style.type = 'text/css';
  if (style.styleSheet) {
    style.styleSheet.cssText = css;
  } else {
    style.appendChild(document.createTextNode(css));
  }

  head.appendChild(style);
}