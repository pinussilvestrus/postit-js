import {
  delegate as domDelegate
} from 'min-dom';

import {
  assign
} from 'min-dash';

import {
  getBusinessObject
} from '../../util/ModelUtil';

import COLORS from '../../util/ColorUtil';

import {
  toPoint
} from 'diagram-js/lib/util/Event';
import { isAny } from '../modeling/util/ModelingUtil';

var DEFAULT_SHAPE = {
  type: 'postit:SquarePostit',
  color: COLORS.GREEN,
  $instanceOf: function() { return true; }
};

export default function CanvasCreate(eventBus, elementFactory, canvas, directEditing) {

  var lastCreatedShape = DEFAULT_SHAPE;

  function _getNewShapePosition(event) {
    var eventPoint = toPoint(event);

    var defaultSize = elementFactory._getDefaultSize(lastCreatedShape);

    return {
      x: eventPoint.x - defaultSize.width / 2,
      y: eventPoint.y - defaultSize.height / 2
    };
  }

  function _activateDirectEdit(element) {
    if (isAny(element, [ 'postit:Postit', 'postit:Group', 'postit:TextBox' ])) {

      directEditing.activate(element);
    }
  }

  function _createShapeOnCanvas(event) {
    var position = _getNewShapePosition(event);

    var newShape = elementFactory.createPostitElement(
      'shape', assign(lastCreatedShape, position));

    var root = canvas.getRootElement();
    canvas.addShape(newShape, root);

    _activateDirectEdit(newShape);
  }

  function _saveLastCreatedShape(shape) {
    if (!shape) {
      lastCreatedShape = DEFAULT_SHAPE;
      return;
    }

    lastCreatedShape = {
      type: shape.type,
      color: shape.color,
      $instanceOf: function(type) {
        const bo = getBusinessObject(shape);
        return (typeof bo.$instanceOf === 'function') && bo.$instanceOf(type);
      }
    };
  }


  eventBus.on('canvas.init', function(context) {
    var svg = context.svg;

    domDelegate.bind(svg, 'svg', 'dblclick', function(event) {
      if (event.target !== svg) {
        return;
      }

      _createShapeOnCanvas(event);
    });

    eventBus.on('create.end', function(context) {
      var shape = context.shape;
      _saveLastCreatedShape(shape);
    });
  });
}

CanvasCreate.prototype.$inject = [
  'eventBus',
  'elementFactory',
  'canvas',
  'directEditing'
];