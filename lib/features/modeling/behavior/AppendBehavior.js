import inherits from 'inherits-browser';

import CommandInterceptor from 'diagram-js/lib/command/CommandInterceptor';


export default function AppendBehavior(eventBus) {

  CommandInterceptor.call(this, eventBus);

  // assign correct shape position unless already set

  this.preExecute('shape.append', function(context) {

    var source = context.source,
        shape = context.shape;

    if (!context.position) {

      context.position = {
        x: source.x + source.width + 80 + shape.width / 2,
        y: source.y + source.height / 2
      };

    }
  }, true);
}

inherits(AppendBehavior, CommandInterceptor);

AppendBehavior.$inject = [
  'eventBus'
];