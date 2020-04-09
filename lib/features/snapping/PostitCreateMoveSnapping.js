import inherits from 'inherits';

import CreateMoveSnapping from 'diagram-js/lib/features/snapping/CreateMoveSnapping';

import {
  isSnapped,
  setSnapped,
} from 'diagram-js/lib/features/snapping/SnapUtil';

import {
  asTRBL,
  getMid
} from 'diagram-js/lib/layout/LayoutUtil';

import { getBoundaryAttachment } from './PostitSnappingUtil';

import { forEach } from 'min-dash';

var HIGH_PRIORITY = 1500;


/**
 * Snap during create and move.
 *
 * @param {EventBus} eventBus
 * @param {Injector} injector
 */
export default function PostitCreateMoveSnapping(eventBus, injector) {
  injector.invoke(CreateMoveSnapping, this);

  // creating first participant
  eventBus.on([ 'create.move', 'create.end' ], HIGH_PRIORITY, setSnappedIfConstrained);

  // snap boundary events
  eventBus.on([
    'create.move',
    'create.end',
    'shape.move.move',
    'shape.move.end'
  ], HIGH_PRIORITY, function(event) {
    var context = event.context,
        canExecute = context.canExecute,
        target = context.target;

    var canAttach = canExecute && (canExecute === 'attach' || canExecute.attach);

    if (canAttach && !isSnapped(event)) {
      snapBoundaryEvent(event, target);
    }
  });
}

inherits(PostitCreateMoveSnapping, CreateMoveSnapping);

PostitCreateMoveSnapping.$inject = [
  'eventBus',
  'injector'
];

PostitCreateMoveSnapping.prototype.initSnap = function(event) {
  var snapContext = CreateMoveSnapping.prototype.initSnap.call(this, event);

  var shape = event.shape;

  var isMove = !!this._elementRegistry.get(shape.id);

  // snap to docking points
  forEach(shape.outgoing, function(connection) {
    var docking = connection.waypoints[0];

    docking = docking.original || docking;

    snapContext.setSnapOrigin(connection.id + '-docking', getDockingSnapOrigin(docking, isMove, event));
  });

  forEach(shape.incoming, function(connection) {
    var docking = connection.waypoints[connection.waypoints.length - 1];

    docking = docking.original || docking;

    snapContext.setSnapOrigin(connection.id + '-docking', getDockingSnapOrigin(docking, isMove, event));
  });

  return snapContext;
};

PostitCreateMoveSnapping.prototype.addSnapTargetPoints = function(snapPoints, shape, target) {
  CreateMoveSnapping.prototype.addSnapTargetPoints.call(this, snapPoints, shape, target);

  var snapTargets = this.getSnapTargets(shape, target);

  var elementRegistry = this._elementRegistry;

  // snap to docking points if not create mode
  forEach(shape.incoming, function(connection) {
    if (elementRegistry.get(shape.id)) {

      if (!includes(snapTargets, connection.source)) {
        snapPoints.add('mid', getMid(connection.source));
      }

      var docking = connection.waypoints[0];
      snapPoints.add(connection.id + '-docking', docking.original || docking);
    }
  });

  forEach(shape.outgoing, function(connection) {
    if (elementRegistry.get(shape.id)) {

      if (!includes(snapTargets, connection.target)) {
        snapPoints.add('mid', getMid(connection.target));
      }

      var docking = connection.waypoints[ connection.waypoints.length - 1 ];

      snapPoints.add(connection.id + '-docking', docking.original || docking);
    }
  });

  return snapPoints;
};

PostitCreateMoveSnapping.prototype.getSnapTargets = function(shape, target) {
  return CreateMoveSnapping.prototype.getSnapTargets.call(this, shape, target);
};

// helpers //////////

function snapBoundaryEvent(event, target) {
  var targetTRBL = asTRBL(target);

  var direction = getBoundaryAttachment(event, target);

  var context = event.context,
      shape = context.shape;

  var offset;

  if (shape.parent) {
    offset = { x: 0, y: 0 };
  } else {
    offset = getMid(shape);
  }

  if (/top/.test(direction)) {
    setSnapped(event, 'y', targetTRBL.top - offset.y);
  } else if (/bottom/.test(direction)) {
    setSnapped(event, 'y', targetTRBL.bottom - offset.y);
  }

  if (/left/.test(direction)) {
    setSnapped(event, 'x', targetTRBL.left - offset.x);
  } else if (/right/.test(direction)) {
    setSnapped(event, 'x', targetTRBL.right - offset.x);
  }
}

function setSnappedIfConstrained(event) {
  var context = event.context,
      createConstraints = context.createConstraints;

  if (!createConstraints) {
    return;
  }

  var top = createConstraints.top,
      right = createConstraints.right,
      bottom = createConstraints.bottom,
      left = createConstraints.left;

  if ((left && left >= event.x) || (right && right <= event.x)) {
    setSnapped(event, 'x', event.x);
  }

  if ((top && top >= event.y) || (bottom && bottom <= event.y)) {
    setSnapped(event, 'y', event.y);
  }
}

function includes(array, value) {
  return array.indexOf(value) !== -1;
}

function getDockingSnapOrigin(docking, isMove, event) {
  return isMove ? (
    {
      x: docking.x - event.x,
      y: docking.y - event.y
    }
  ) : {
    x: docking.x,
    y: docking.y
  };
}
