import {
  every,
  find,
  forEach,
} from 'min-dash';

import inherits from 'inherits';

import {
  is,
  getBusinessObject
} from '../../util/ModelUtil';

import {
  isAny
} from '../modeling/util/ModelingUtil';

import {
  isLabel
} from '../../util/LabelUtil';

import {
  isExpanded,
  isEventSubProcess,
  isInterrupting,
  hasErrorEventDefinition,
  hasEscalationEventDefinition,
  hasCompensateEventDefinition
} from '../../util/DiUtil';

import RuleProvider from 'diagram-js/lib/features/rules/RuleProvider';

import {
  getBoundaryAttachment as isBoundaryAttachment
} from '../snapping/BpmnSnappingUtil';


/**
 * BPMN specific modeling rule
 */
export default function PostitRules(eventBus) {
  RuleProvider.call(this, eventBus);
}

inherits(PostitRules, RuleProvider);

PostitRules.$inject = [ 'eventBus' ];

PostitRules.prototype.init = function() {

  this.addRule('shape.resize', function(context) {

    var shape = context.shape,
        newBounds = context.newBounds;

    return canResize(shape, newBounds);
  });

  this.addRule('elements.create', function(context) {
    var elements = context.elements,
        position = context.position,
        target = context.target;

    return every(elements, function(element) {
      if (element.host) {
        return canAttach(element, element.host, null, position);
      }

      return canCreate(element, target, null, position);
    });
  });

  this.addRule('elements.move', function(context) {

    var target = context.target,
        shapes = context.shapes,
        position = context.position;

    return canAttach(shapes, target, null, position) ||
           canReplace(shapes, target, position) ||
           canMove(shapes, target, position) ||
           canInsert(shapes, target, position);
  });

  this.addRule('shape.create', function(context) {
    return canCreate(
      context.shape,
      context.target,
      context.source,
      context.position
    );
  });

  this.addRule('shape.attach', function(context) {

    return canAttach(
      context.shape,
      context.target,
      null,
      context.position
    );
  });

  this.addRule('element.copy', function(context) {
    var element = context.element,
        elements = context.elements;

    return canCopy(elements, element);
  });
};

PostitRules.prototype.canMove = canMove;

PostitRules.prototype.canAttach = canAttach;

PostitRules.prototype.canReplace = canReplace;

PostitRules.prototype.canDrop = canDrop;

PostitRules.prototype.canInsert = canInsert;

PostitRules.prototype.canCreate = canCreate;

PostitRules.prototype.canResize = canResize;

PostitRules.prototype.canCopy = canCopy;

/**
 * Utility functions for rule checking
 */

function isSame(a, b) {
  return a === b;
}

function isTextAnnotation(element) {
  return is(element, 'bpmn:TextAnnotation');
}

function hasEventDefinition(element, eventDefinition) {
  var bo = getBusinessObject(element);

  return !!find(bo.eventDefinitions || [], function(definition) {
    return is(definition, eventDefinition);
  });
}

function getParents(element) {

  var parents = [];

  while (element) {
    element = element.parent;

    if (element) {
      parents.push(element);
    }
  }

  return parents;
}

function isParent(possibleParent, element) {
  var allParents = getParents(element);
  return allParents.indexOf(possibleParent) !== -1;
}

/**
 * Can an element be dropped into the target element
 *
 * @return {Boolean}
 */
function canDrop(element, target) {

  // can move labels
  if (isLabel(element)) {
    return true;
  }

  // drop flow elements onto flow element containers
  if (is(element, 'bpmn:FlowElement') && is(target, 'bpmn:FlowElementsContainer')) {
    return true;
  }

  return false;
}


function canAttach(elements, target, source, position) {

  if (!Array.isArray(elements)) {
    elements = [ elements ];
  }

  // only (re-)attach one element at a time
  if (elements.length !== 1) {
    return false;
  }

  var element = elements[0];

  // do not attach labels
  if (isLabel(element)) {
    return false;
  }

  // disallow drop on event sub processes
  if (isEventSubProcess(target)) {
    return false;
  }

  if (!is(target, 'bpmn:Activity')) {
    return false;
  }

  // only attach to subprocess border
  if (position && !isBoundaryAttachment(position, target)) {
    return false;
  }

  return 'attach';
}


/**
 * Defines how to replace elements for a given target.
 *
 * Returns an array containing all elements which will be replaced.
 *
 * @example
 *
 *  [{ id: 'IntermediateEvent_2',
 *     type: 'bpmn:StartEvent'
 *   },
 *   { id: 'IntermediateEvent_5',
 *     type: 'bpmn:EndEvent'
 *   }]
 *
 * @param  {Array} elements
 * @param  {Object} target
 *
 * @return {Object} an object containing all elements which have to be replaced
 */
function canReplace(elements, target, position) {

  if (!target) {
    return false;
  }

  var canExecute = {
    replacements: []
  };

  forEach(elements, function(element) {

    if (!isEventSubProcess(target)) {

      if (is(element, 'bpmn:StartEvent') &&
          element.type !== 'label' &&
          canDrop(element, target)) {

        // replace a non-interrupting start event by a blank interrupting start event
        // when the target is not an event sub process
        if (!isInterrupting(element)) {
          canExecute.replacements.push({
            oldElementId: element.id,
            newElementType: 'bpmn:StartEvent'
          });
        }

        // replace an error/escalation/compensate start event by a blank interrupting start event
        // when the target is not an event sub process
        if (hasErrorEventDefinition(element) ||
            hasEscalationEventDefinition(element) ||
            hasCompensateEventDefinition(element)) {
          canExecute.replacements.push({
            oldElementId: element.id,
            newElementType: 'bpmn:StartEvent'
          });
        }
      }
    }

    if (!is(target, 'bpmn:Transaction')) {
      if (hasEventDefinition(element, 'bpmn:CancelEventDefinition') &&
          element.type !== 'label') {

        if (is(element, 'bpmn:EndEvent') && canDrop(element, target)) {
          canExecute.replacements.push({
            oldElementId: element.id,
            newElementType: 'bpmn:EndEvent'
          });
        }

        if (is(element, 'bpmn:BoundaryEvent') && canAttach(element, target, null, position)) {
          canExecute.replacements.push({
            oldElementId: element.id,
            newElementType: 'bpmn:BoundaryEvent'
          });
        }
      }
    }
  });

  return canExecute.replacements.length ? canExecute : false;
}

function canMove(elements, target) {

  // allow default move check to start move operation
  if (!target) {
    return true;
  }

  return elements.every(function(element) {
    return canDrop(element, target);
  });
}

function canCreate(shape, target, source, position) {

  if (!target) {
    return false;
  }

  if (isLabel(shape)) {
    return true;
  }

  if (isSame(source, target)) {
    return false;
  }

  // ensure we do not drop the element
  // into source
  if (source && isParent(source, target)) {
    return false;
  }

  return canDrop(shape, target, position) || canInsert(shape, target, position);
}

function canResize(shape, newBounds) {
  if (is(shape, 'bpmn:SubProcess')) {
    return (
      isExpanded(shape) && (
        !newBounds || (newBounds.width >= 100 && newBounds.height >= 80)
      )
    );
  }

  if (is(shape, 'bpmn:Lane')) {
    return !newBounds || (newBounds.width >= 130 && newBounds.height >= 60);
  }

  if (is(shape, 'bpmn:Participant')) {
    return !newBounds || (newBounds.width >= 250 && newBounds.height >= 50);
  }

  if (isTextAnnotation(shape)) {
    return true;
  }

  return false;
}

function canInsert(shape, flow, position) {

  if (!flow) {
    return false;
  }

  if (Array.isArray(shape)) {
    if (shape.length !== 1) {
      return false;
    }

    shape = shape[0];
  }

  if (flow.source === shape ||
      flow.target === shape) {
    return false;
  }

  // return true if we can drop on the
  // underlying flow parent
  //
  // at this point we are not really able to talk
  // about connection rules (yet)

  return (
    isAny(flow, [ 'bpmn:SequenceFlow', 'bpmn:MessageFlow' ]) &&
    !isLabel(flow) &&
    is(shape, 'bpmn:FlowNode') &&
    !is(shape, 'bpmn:BoundaryEvent') &&
    canDrop(shape, flow.parent, position));
}

function includes(elements, element) {
  return (elements && element) && elements.indexOf(element) !== -1;
}

function canCopy(elements, element) {
  if (isLabel(element)) {
    return true;
  }

  if (is(element, 'bpmn:Lane') && !includes(elements, element.parent)) {
    return false;
  }

  return true;
}
