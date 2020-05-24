import inherits from 'inherits';

import {
  is
} from '../../../util/ModelUtil';

import CommandInterceptor from 'diagram-js/lib/command/CommandInterceptor';


export default function EmptyTextBoxBehavior(eventBus, modeling) {

  CommandInterceptor.call(this, eventBus);

  // delete text box if it has no text
  this.postExecute('element.updateLabel', function(context) {

    var element = context.element,
        newLabel = context.newLabel;

    if (is(element, 'postit:TextBox') && isEmpty(newLabel)) {
      modeling.removeElements([ element ]);
    }
  }, true);
}

inherits(EmptyTextBoxBehavior, CommandInterceptor);

EmptyTextBoxBehavior.$inject = [
  'eventBus',
  'modeling'
];


// helpers //////////

function isEmpty(label) {
  return !label || label === '';
}