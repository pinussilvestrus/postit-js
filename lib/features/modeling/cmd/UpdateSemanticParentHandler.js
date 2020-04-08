export default function UpdateSemanticParentHandler(postitUpdater) {
  this._postitUpdater = postitUpdater;
}

UpdateSemanticParentHandler.$inject = [ 'postitUpdater' ];


UpdateSemanticParentHandler.prototype.execute = function(context) {
  var dataStoreBo = context.dataStoreBo,
      newSemanticParent = context.newSemanticParent,
      newDiParent = context.newDiParent;

  context.oldSemanticParent = dataStoreBo.$parent;
  context.oldDiParent = dataStoreBo.di.$parent;

  // update semantic parent
  this._postitUpdater.updateSemanticParent(dataStoreBo, newSemanticParent);

  // update DI parent
  this._postitUpdater.updateDiParent(dataStoreBo.di, newDiParent);
};

UpdateSemanticParentHandler.prototype.revert = function(context) {
  var dataStoreBo = context.dataStoreBo,
      oldSemanticParent = context.oldSemanticParent,
      oldDiParent = context.oldDiParent;

  // update semantic parent
  this._postitUpdater.updateSemanticParent(dataStoreBo, oldSemanticParent);

  // update DI parent
  this._postitUpdater.updateDiParent(dataStoreBo.di, oldDiParent);
};

