import {
  getBusinessObject,
  is
} from '../../util/ModelUtil';

import {
  forEach
} from 'min-dash';

import * as replaceOptions from '../replace/ReplaceOptions';


/**
 * This module is an element agnostic replace menu provider for the popup menu.
 */
export default function ReplaceMenuProvider(
    popupMenu, modeling, moddle,
    postitReplace, rules, translate) {

  this._popupMenu = popupMenu;
  this._modeling = modeling;
  this._moddle = moddle;
  this._postitReplace = postitReplace;
  this._rules = rules;
  this._translate = translate;

  this.register();
}

ReplaceMenuProvider.$inject = [
  'popupMenu',
  'modeling',
  'moddle',
  'postitReplace',
  'rules',
  'translate'
];


/**
 * Register replace menu provider in the popup menu
 */
ReplaceMenuProvider.prototype.register = function() {
  this._popupMenu.registerProvider('postit-replace', this);
};


/**
 * Get all entries from replaceOptions for the given element and apply filters
 * on them. Get for example only elements, which are different from the current one.
 *
 * @param {djs.model.Base} element
 *
 * @return {Array<Object>} a list of menu entry items
 */
ReplaceMenuProvider.prototype.getEntries = function(element) {

  var businessObject = element.businessObject;

  var rules = this._rules;

  var entries;

  if (!rules.allowed('shape.replace', { element: element })) {
    return [];
  }

  return [];
};


/**
 * Get a list of header items for the given element. This includes buttons
 * for multi instance markers and for the ad hoc marker.
 *
 * @param {djs.model.Base} element
 *
 * @return {Array<Object>} a list of menu entry items
 */
ReplaceMenuProvider.prototype.getHeaderEntries = function(element) {

  var headerEntries = [];

  return headerEntries;
};


/**
 * Creates an array of menu entry objects for a given element and filters the replaceOptions
 * according to a filter function.
 *
 * @param  {djs.model.Base} element
 * @param  {Object} replaceOptions
 *
 * @return {Array<Object>} a list of menu items
 */
ReplaceMenuProvider.prototype._createEntries = function(element, replaceOptions) {
  var menuEntries = [];

  var self = this;

  forEach(replaceOptions, function(definition) {
    var entry = self._createMenuEntry(definition, element);

    menuEntries.push(entry);
  });

  return menuEntries;
};

/**
 * Creates an array of menu entry objects for a given sequence flow.
 *
 * @param  {djs.model.Base} element
 * @param  {Object} replaceOptions

 * @return {Array<Object>} a list of menu items
 */
ReplaceMenuProvider.prototype._createSequenceFlowEntries = function(element, replaceOptions) {

  var businessObject = getBusinessObject(element);

  var menuEntries = [];

  var modeling = this._modeling,
      moddle = this._moddle;

  var self = this;

  forEach(replaceOptions, function(entry) {

    switch (entry.actionName) {
    case 'replace-with-default-flow':
      if (businessObject.sourceRef.default !== businessObject &&
            (is(businessObject.sourceRef, 'bpmn:ExclusiveGateway') ||
             is(businessObject.sourceRef, 'bpmn:InclusiveGateway') ||
             is(businessObject.sourceRef, 'bpmn:ComplexGateway') ||
             is(businessObject.sourceRef, 'bpmn:Activity'))) {

        menuEntries.push(self._createMenuEntry(entry, element, function() {
          modeling.updateProperties(element.source, { default: businessObject });
        }));
      }
      break;
    case 'replace-with-conditional-flow':
      if (!businessObject.conditionExpression && is(businessObject.sourceRef, 'bpmn:Activity')) {

        menuEntries.push(self._createMenuEntry(entry, element, function() {
          var conditionExpression = moddle.create('bpmn:FormalExpression', { body: '' });

          modeling.updateProperties(element, { conditionExpression: conditionExpression });
        }));
      }
      break;
    default:

      // default flows
      if (is(businessObject.sourceRef, 'bpmn:Activity') && businessObject.conditionExpression) {
        return menuEntries.push(self._createMenuEntry(entry, element, function() {
          modeling.updateProperties(element, { conditionExpression: undefined });
        }));
      }

      // conditional flows
      if ((is(businessObject.sourceRef, 'bpmn:ExclusiveGateway') ||
           is(businessObject.sourceRef, 'bpmn:InclusiveGateway') ||
           is(businessObject.sourceRef, 'bpmn:ComplexGateway') ||
           is(businessObject.sourceRef, 'bpmn:Activity')) &&
           businessObject.sourceRef.default === businessObject) {

        return menuEntries.push(self._createMenuEntry(entry, element, function() {
          modeling.updateProperties(element.source, { default: undefined });
        }));
      }
    }
  });

  return menuEntries;
};


/**
 * Creates and returns a single menu entry item.
 *
 * @param  {Object} definition a single replace options definition object
 * @param  {djs.model.Base} element
 * @param  {Function} [action] an action callback function which gets called when
 *                             the menu entry is being triggered.
 *
 * @return {Object} menu entry item
 */
ReplaceMenuProvider.prototype._createMenuEntry = function(definition, element, action) {
  var translate = this._translate;
  var replaceElement = this._postitReplace.replaceElement;

  var replaceAction = function() {
    return replaceElement(element, definition.target);
  };

  action = action || replaceAction;

  var menuEntry = {
    label: translate(definition.label),
    className: definition.className,
    id: definition.actionName,
    action: action
  };

  return menuEntry;
};
