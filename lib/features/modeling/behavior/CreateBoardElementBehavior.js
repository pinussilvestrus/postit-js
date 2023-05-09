import inherits from 'inherits-browser';

import {
  assign
} from 'min-dash';

import {
  getBusinessObject,
  is
} from '../../../util/ModelUtil';

import CommandInterceptor from 'diagram-js/lib/command/CommandInterceptor';


export default function CreateBoardElementBehavior(eventBus) {

  CommandInterceptor.call(this, eventBus);

  // ensure properties were set in business object

  this.execute('shape.create', function(context) {

    var shape = context.context.shape;

    if (is(shape, 'postit:Postit')) {
      const businessObject = getBusinessObject(shape);
      !businessObject.color && assign(businessObject, { color: shape.color });
    }

    if (is(shape, 'postit:Image')) {
      const businessObject = getBusinessObject(shape);
      !businessObject.source && assign(businessObject, { source: shape.source });
    }
  });
}

inherits(CreateBoardElementBehavior, CommandInterceptor);

CreateBoardElementBehavior.$inject = [
  'eventBus'
];