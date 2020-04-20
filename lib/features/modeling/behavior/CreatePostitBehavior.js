import inherits from 'inherits';

import {
  assign
} from 'min-dash';

import {
  getBusinessObject,
  is
} from '../../../util/ModelUtil';

import CommandInterceptor from 'diagram-js/lib/command/CommandInterceptor';


export default function CreatePostitBehavior(eventBus) {

  CommandInterceptor.call(this, eventBus);

  // ensure color was set in business object

  this.execute('shape.create', function(context) {

    var shape = context.context.shape;

    if (is(shape, 'postit:Postit')) {
      const businessObject = getBusinessObject(shape);
      !businessObject.color && assign(businessObject, { color: shape.color });
    }
  });
}

inherits(CreatePostitBehavior, CommandInterceptor);

CreatePostitBehavior.$inject = [
  'eventBus'
];