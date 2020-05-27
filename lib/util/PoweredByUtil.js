/**
 * This file must not be changed or exchanged.
 *
 * @see http://bpmn.io/license for more information.
 */

import {
  domify,
  delegate as domDelegate
} from 'min-dom';


var BPMNIO_LOGO_SVG = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 58 23"><path fill="currentColor" d="M7.75 3.8v.58c0 1.7-.52 2.78-1.67 3.32C7.46 8.24 8 9.5 8 11.24v1.34c0 2.54-1.35 3.9-3.93 3.9H0V0h3.91c2.68 0 3.84 1.25 3.84 3.8zM2.59 2.35V6.7H3.6c.97 0 1.56-.42 1.56-1.74v-.92c0-1.18-.4-1.7-1.32-1.7zm0 6.7v5.07h1.48c.87 0 1.34-.4 1.34-1.63v-1.43c0-1.53-.5-2-1.67-2H2.6zm14.65-4.98v2.14c0 2.64-1.27 4.08-3.87 4.08h-1.22v6.2H9.56V0h3.82c2.59 0 3.86 1.44 3.86 4.07zm-5.09-1.71v5.57h1.22c.83 0 1.28-.37 1.28-1.55V3.91c0-1.18-.45-1.56-1.28-1.56h-1.22zm11.89 9.34L25.81 0h3.6v16.48h-2.44V4.66l-1.8 11.82h-2.45L20.8 4.83v11.65h-2.26V0h3.6zm9.56-7.15v11.93h-2.33V0h3.25l2.66 9.87V0h2.31v16.48h-2.66zm10.25 9.44v2.5h-2.5v-2.5zM50 4.16C50 1.52 51.38.02 53.93.02c2.54 0 3.93 1.5 3.93 4.14v8.37c0 2.64-1.4 4.14-3.93 4.14-2.55 0-3.93-1.5-3.93-4.14zm2.58 8.53c0 1.18.52 1.63 1.35 1.63.82 0 1.34-.45 1.34-1.63V4c0-1.17-.52-1.62-1.34-1.62-.83 0-1.35.45-1.35 1.62zM0 18.7h57.86V23H0zM45.73 0h2.6v2.58h-2.6zm2.59 16.48V4.16h-2.59v12.32z"></path></svg>';

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