/**
 * This file must not be changed or exchanged.
 *
 * @see http://bpmn.io/license for more information.
 */

import {
  domify,
  delegate as domDelegate
} from 'min-dom';


var BPMNIO_LOGO_SVG = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 53 21"><path fill="currentColor" d="M49.3 0c-2.3 0-3.6 1.4-3.6 3.8v7.7c0 2.4 1.3 3.7 3.6 3.7s3.6-1.3 3.6-3.7V3.8c0-2.4-1.3-3.8-3.6-3.8zM0 0v15h3.7c2.4 0 3.6-1.2 3.6-3.5v-1.2c0-1.6-.5-2.8-1.7-3.3C6.6 6.5 7 5.5 7 4v-.6C7 1.2 6 0 3.6 0zm8.7 0v15h2.4V9.5h1.1c2.4 0 3.5-1.3 3.5-3.8v-2c0-2.3-1.1-3.6-3.4-3.6zM17 0v15H19V4.5L20.8 15H23l1.6-10.8V15H27V0h-3.3L22 10.6 20.2 0zm11.7 0v15h2.1V4.2l3 11H36V0H34V9l-2.5-9zm13.2 0v15h2.4V0zm7.5 2.1c.7 0 1.2.4 1.2 1.5v8c0 1-.5 1.5-1.2 1.5-.8 0-1.3-.4-1.3-1.5v-8c0-1 .5-1.5 1.3-1.5zm-47 0h1.2c.9 0 1.2.5 1.2 1.6v.8c0 1.2-.5 1.6-1.4 1.6h-1zm8.8 0h1.1c.8 0 1.2.4 1.2 1.5v2.2c0 1.1-.4 1.4-1.2 1.4h-1zM2.3 8.4h1.1c1 0 1.5.4 1.5 1.8v1.3c0 1.1-.4 1.5-1.2 1.5H2.3zm35.5 4.5V15H40v-2.3zM0 17V21h52.9v-4z"/></svg>';

var BPMNIO_LOGO_URL = 'data:image/svg+xml,' + encodeURIComponent(BPMNIO_LOGO_SVG);

export var BPMNIO_IMG = '<img width="52" height="52" src="' + BPMNIO_LOGO_URL + '" />';

function css(attrs) {
  return attrs.join(';');
}

var LIGHTBOX_STYLES = css([
  'z-index: 1001',
  'position: fixed',
  'top: 0',
  'left: 0',
  'right: 0',
  'bottom: 0'
]);

var BACKDROP_STYLES = css([
  'width: 100%',
  'height: 100%',
  'background: rgba(0,0,0,0.2)'
]);

var NOTICE_STYLES = css([
  'position: absolute',
  'left: 50%',
  'top: 40%',
  'margin: 0 -130px',
  'width: 260px',
  'padding: 10px',
  'background: white',
  'border: solid 1px #AAA',
  'border-radius: 3px',
  'font-family: Helvetica, Arial, sans-serif',
  'font-size: 14px',
  'line-height: 1.2em'
]);

var LIGHTBOX_MARKUP =
  '<div class="bjs-powered-by-lightbox" style="' + LIGHTBOX_STYLES + '">' +
    '<div class="backdrop" style="' + BACKDROP_STYLES + '"></div>' +
    '<div class="notice" style="' + NOTICE_STYLES + '">' +
      '<a href="http://bpmn.io" target="_blank" style="float: left; margin-right: 10px">' +
        BPMNIO_IMG +
      '</a>' +
      'Web-based tooling for BPMN, DMN and CMMN diagrams ' +
      'powered by <a href="http://bpmn.io" target="_blank">bpmn.io</a>.' +
    '</div>' +
  '</div>';


var lightbox;

export function open() {

  if (!lightbox) {
    lightbox = domify(LIGHTBOX_MARKUP);

    domDelegate.bind(lightbox, '.backdrop', 'click', function(event) {
      document.body.removeChild(lightbox);
    });
  }

  document.body.appendChild(lightbox);
}