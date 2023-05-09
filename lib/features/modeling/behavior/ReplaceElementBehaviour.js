import inherits from 'inherits-browser';

import { forEach } from 'min-dash';

import CommandInterceptor from 'diagram-js/lib/command/CommandInterceptor';


/**
 * postit-specific replace behavior.
 */
export default function ReplaceElementBehaviour(
    postitReplace,
    postitRules,
    elementRegistry,
    injector,
    modeling,
    selection
) {
  injector.invoke(CommandInterceptor, this);

  this._postitReplace = postitReplace;
  this._elementRegistry = elementRegistry;
  this._selection = selection;

  // replace elements on move
  this.postExecuted([ 'elements.move' ], 500, function(event) {
    var context = event.context,
        target = context.newParent,
        newHost = context.newHost,
        elements = [];

    forEach(context.closure.topLevel, function(topLevelElements) {
      elements = elements.concat(topLevelElements);
    });

    // set target to host if attaching
    if (elements.length === 1 && newHost) {
      target = newHost;
    }

    var canReplace = postitRules.canReplace(elements, target);

    if (canReplace) {
      this.replaceElements(elements, canReplace.replacements, newHost);
    }
  }, this);

  // update attachments on host replace
  this.postExecute([ 'shape.replace' ], 1500, function(e) {
    var context = e.context,
        oldShape = context.oldShape,
        newShape = context.newShape,
        attachers = oldShape.attachers,
        canReplace;

    if (attachers && attachers.length) {
      canReplace = postitRules.canReplace(attachers, newShape);

      this.replaceElements(attachers, canReplace.replacements);
    }

  }, this);

  // keep ID on shape replace
  this.postExecuted([ 'shape.replace' ], 1500, function(e) {
    var context = e.context,
        oldShape = context.oldShape,
        newShape = context.newShape;

    modeling.unclaimId(oldShape.businessObject.id, oldShape.businessObject);
    modeling.updateProperties(newShape, { id: oldShape.id });
  });
}

inherits(ReplaceElementBehaviour, CommandInterceptor);

ReplaceElementBehaviour.prototype.replaceElements = function(elements, newElements) {
  var elementRegistry = this._elementRegistry,
      postitReplace = this._postitReplace,
      selection = this._selection;

  forEach(newElements, function(replacement) {
    var newElement = {
      type: replacement.newElementType
    };

    var oldElement = elementRegistry.get(replacement.oldElementId);

    var idx = elements.indexOf(oldElement);

    elements[idx] = postitReplace.replaceElement(oldElement, newElement, { select: false });
  });

  if (newElements) {
    selection.select(elements);
  }
};

ReplaceElementBehaviour.$inject = [
  'postitReplace',
  'postitRules',
  'elementRegistry',
  'injector',
  'modeling',
  'selection'
];
