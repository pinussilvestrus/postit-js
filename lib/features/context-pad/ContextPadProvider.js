import {
  assign,
  isArray
} from 'min-dash';

import {
  hasPrimaryModifier
} from 'diagram-js/lib/util/Mouse';


/**
 * A provider for BPMN 2.0 elements context pad
 */
export default function ContextPadProvider(
    config, injector, eventBus,
    contextPad, modeling, elementFactory,
    connect, create, popupMenu,
    canvas, rules, translate) {

  config = config || {};

  contextPad.registerProvider(this);

  this._contextPad = contextPad;

  this._modeling = modeling;

  this._elementFactory = elementFactory;
  this._connect = connect;
  this._create = create;
  this._popupMenu = popupMenu;
  this._canvas = canvas;
  this._rules = rules;
  this._translate = translate;

  if (config.autoPlace !== false) {
    this._autoPlace = injector.get('autoPlace', false);
  }

  eventBus.on('create.end', 250, function(event) {
    var context = event.context,
        shape = context.shape;

    if (!hasPrimaryModifier(event) || !contextPad.isOpen(shape)) {
      return;
    }

    var entries = contextPad.getEntries(shape);

    if (entries.replace) {
      entries.replace.action.click(event, shape);
    }
  });
}

ContextPadProvider.$inject = [
  'config.contextPad',
  'injector',
  'eventBus',
  'contextPad',
  'modeling',
  'elementFactory',
  'connect',
  'create',
  'popupMenu',
  'canvas',
  'rules',
  'translate'
];


ContextPadProvider.prototype.getContextPadEntries = function(element) {

  const {
    _rules: rules,
    _modeling: modeling,
    _translate: translate
  } = this;

  let actions = {};

  function removeElement(e) {
    modeling.removeElements([ element ]);
  }

  if (element.type === 'label') {
    return actions;
  }

  // delete element entry, only show if allowed by rules
  let deleteAllowed = rules.allowed('elements.delete', { elements: [ element ] });

  if (isArray(deleteAllowed)) {

    // was the element returned as a deletion candidate?
    deleteAllowed = deleteAllowed[0] === element;
  }

  if (deleteAllowed) {
    assign(actions, {
      'delete': {
        group: 'edit',
        className: 'bpmn-icon-trash',
        title: translate('Remove'),
        action: {
          click: removeElement
        }
      }
    });
  }

  return actions;
};
