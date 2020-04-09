import {
  forEach
} from 'min-dash';

import COLOR from '../../../util/ColorUtil';


var DEFAULT_COLOR = COLOR.GREEN;


export default function SetColorHandler(commandStack) {
  this._commandStack = commandStack;
}

SetColorHandler.$inject = [
  'commandStack'
];


SetColorHandler.prototype.postExecute = function(context) {
  var elements = context.elements,
      color = context.color || DEFAULT_COLOR;

  var self = this;

  forEach(elements, function(element) {

    self._commandStack.execute('element.updateProperties', {
      element: element,
      properties: {
        color: color
      }
    });
  });

};