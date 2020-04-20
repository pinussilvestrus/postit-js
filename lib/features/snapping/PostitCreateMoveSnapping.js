import inherits from 'inherits';

import CreateMoveSnapping from 'diagram-js/lib/features/snapping/CreateMoveSnapping';

/**
 * Snap during create and move.
 *
 * @param {EventBus} eventBus
 * @param {Injector} injector
 */
export default function PostitCreateMoveSnapping(injector) {
  injector.invoke(CreateMoveSnapping, this);
}

inherits(PostitCreateMoveSnapping, CreateMoveSnapping);

PostitCreateMoveSnapping.$inject = [
  'injector'
];

PostitCreateMoveSnapping.prototype.initSnap = function(event) {
  return CreateMoveSnapping.prototype.initSnap.call(this, event);
};

PostitCreateMoveSnapping.prototype.addSnapTargetPoints = function(snapPoints, shape, target) {
  return CreateMoveSnapping.prototype.addSnapTargetPoints.call(this, snapPoints, shape, target);
};

PostitCreateMoveSnapping.prototype.getSnapTargets = function(shape, target) {
  return CreateMoveSnapping.prototype.getSnapTargets.call(this, shape, target);
};
