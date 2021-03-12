import inherits from 'inherits';

import {
  is,
  getBusinessObject
} from '../../../util/ModelUtil';

import CommandInterceptor from 'diagram-js/lib/command/CommandInterceptor';


export default function EmptyTextBoxBehavior(eventBus, modeling, directEditing) {

  CommandInterceptor.call(this, eventBus);

  // delete text box if it has no text
  this.postExecute('element.updateLabel', function(context) {

    var element = context.element,
        newLabel = context.newLabel;

    if (is(element, 'postit:TextBox') && isEmpty(newLabel)) {
      modeling.removeElements([ element ]);
    }
  }, true);

  eventBus.on('directEditing.cancel', 1001, function(event) {
    var active = event.active,
        element = active.element;

    if (is(element, 'postit:TextBox') && isEmpty(getBusinessObject(element).name)) {
      directEditing._active = false;
      modeling.removeElements([ element ]);
    }
  });
}

inherits(EmptyTextBoxBehavior, CommandInterceptor);

EmptyTextBoxBehavior.$inject = [
  'eventBus',
  'modeling',
  'directEditing'
];


// helpers //////////

function isEmpty(label) {
  return !label || label === '';
}