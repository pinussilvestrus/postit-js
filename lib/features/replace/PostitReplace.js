import {
  pick,
  assign,
  forEach,
  isArray,
  isUndefined
} from 'min-dash';

import { getPropertyNames } from '../copy-paste/ModdleCopy';

function copyProperties(source, target, properties) {
  if (!isArray(properties)) {
    properties = [ properties ];
  }

  forEach(properties, function(property) {
    if (!isUndefined(source[property])) {
      target[property] = source[property];
    }
  });
}

var CUSTOM_PROPERTIES = [
  'cancelActivity',
  'instantiate',
  'eventGatewayType',
  'triggeredByEvent',
  'isInterrupting'
];



/**
 * This module takes care of replacing postit elements
 */
export default function PostitReplace(
    postitFactory,
    elementFactory,
    moddleCopy,
    modeling,
    replace,
    selection
) {

  /**
   * Prepares a new business object for the replacement element
   * and triggers the replace operation.
   *
   * @param  {djs.model.Base} element
   * @param  {Object} target
   * @param  {Object} [hints]
   *
   * @return {djs.model.Base} the newly created element
   */
  function replaceElement(element, target, hints) {

    hints = hints || {};

    var type = target.type,
        oldBusinessObject = element.businessObject;

    var newBusinessObject = postitFactory.create(type);

    var newElement = {
      type: type,
      businessObject: newBusinessObject
    };

    var elementProps = getPropertyNames(oldBusinessObject.$descriptor),
        newElementProps = getPropertyNames(newBusinessObject.$descriptor, true),
        copyProps = intersection(elementProps, newElementProps);

    // initialize special properties defined in target definition
    assign(newBusinessObject, pick(target, CUSTOM_PROPERTIES));

    var properties = copyProps;

    newBusinessObject = moddleCopy.copyElement(
      oldBusinessObject,
      newBusinessObject,
      properties
    );

    newBusinessObject.name = oldBusinessObject.name;

    newElement.di = {};

    // fill and stroke will be set to DI
    copyProperties(oldBusinessObject.di, newElement.di, [
      'fill',
      'stroke'
    ]);

    newElement = replace.replaceElement(element, newElement, hints);

    if (hints.select !== false) {
      selection.select(newElement);
    }

    return newElement;
  }

  this.replaceElement = replaceElement;
}

PostitReplace.$inject = [
  'postitFactory',
  'elementFactory',
  'moddleCopy',
  'modeling',
  'replace',
  'selection'
];

/**
 * Compute intersection between two arrays.
 */
function intersection(a1, a2) {
  return a1.filter(function(el) {
    return a2.indexOf(el) !== -1;
  });
}
