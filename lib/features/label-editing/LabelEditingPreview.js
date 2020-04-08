import {
  remove as svgRemove
} from 'tiny-svg';

import {
  is
} from '../../util/ModelUtil';

var MARKER_HIDDEN = 'djs-element-hidden',
    MARKER_LABEL_HIDDEN = 'djs-label-hidden';


export default function LabelEditingPreview(
    eventBus, canvas, elementRegistry,
    pathMap) {


  var element, gfx;

  eventBus.on('directEditing.activate', function(context) {
    var activeProvider = context.active;

    element = activeProvider.element.label || activeProvider.element;


    if (element.labelTarget) {
      canvas.addMarker(element, MARKER_HIDDEN);
    } else if (is(element, 'postit:Postit')) {
      canvas.addMarker(element, MARKER_LABEL_HIDDEN);
    }
  });


  eventBus.on([ 'directEditing.complete', 'directEditing.cancel' ], function(context) {
    var activeProvider = context.active;

    if (activeProvider) {
      canvas.removeMarker(activeProvider.element.label || activeProvider.element, MARKER_HIDDEN);
      canvas.removeMarker(element, MARKER_LABEL_HIDDEN);
    }

    element = undefined;

    if (gfx) {
      svgRemove(gfx);

      gfx = undefined;
    }
  });
}

LabelEditingPreview.$inject = [
  'eventBus',
  'canvas',
  'elementRegistry',
  'pathMap'
];