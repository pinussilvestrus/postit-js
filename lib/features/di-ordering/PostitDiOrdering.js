import { getDi } from '../../draw/PostitRendererUtil';
import { getBusinessObject } from '../../util/ModelUtil';

import {
  filter,
  map
} from 'min-dash';

import { selfAndAllChildren } from 'diagram-js/lib/util/Elements';


var HIGH_PRIORITY = 2000;

export default function PostitDiOrdering(eventBus, canvas) {

  eventBus.on('saveXML.start', HIGH_PRIORITY, orderDi);

  function orderDi() {
    var root = canvas.getRootElement(),
        rootDi = getBusinessObject(root).di,
        elements,
        diElements;

    elements = selfAndAllChildren([ root ], false);

    // only postitDi:Shape can be direct children of postitDi:Plane
    elements = filter(elements, function(element) {
      return element !== root && !element.labelTarget;
    });

    diElements = map(elements, getDi);

    rootDi.set('planeElement', diElements);
  }
}

PostitDiOrdering.$inject = [ 'eventBus', 'canvas' ];
