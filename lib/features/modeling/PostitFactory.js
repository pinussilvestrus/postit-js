import {
  map,
  assign,
  pick
} from 'min-dash';

import {
  isAny
} from './util/ModelingUtil';

import {
  is
} from '../../util/ModelUtil';


export default function PositFactory(moddle) {
  this._model = moddle;
}

PositFactory.$inject = [ 'moddle' ];


PositFactory.prototype._needsId = function(element) {
  return isAny(element, [
    'bpmn:RootElement',
    'postit:Postit'
  ]);
};

PositFactory.prototype._ensureId = function(element) {

  // generate semantic ids for elements
  // postit:Postit -> Positit_ID
  var prefix;

  if (is(element, 'bpmn:Postit')) {
    prefix = 'Activity';
  } else {
    prefix = (element.$type || '').replace(/^[^:]*:/g, '');
  }

  prefix += '_';

  if (!element.id && this._needsId(element)) {
    element.id = this._model.ids.nextPrefixed(prefix, element);
  }
};


PositFactory.prototype.create = function(type, attrs) {
  var element = this._model.create(type, attrs || {});

  this._ensureId(element);

  return element;
};


PositFactory.prototype.createDiLabel = function() {
  return this.create('bpmndi:BPMNLabel', {
    bounds: this.createDiBounds()
  });
};


PositFactory.prototype.createDiShape = function(semantic, bounds, attrs) {

  return this.create('bpmndi:BPMNShape', assign({
    bpmnElement: semantic,
    bounds: this.createDiBounds(bounds)
  }, attrs));
};


PositFactory.prototype.createDiBounds = function(bounds) {
  return this.create('dc:Bounds', bounds);
};


PositFactory.prototype.createDiWaypoints = function(waypoints) {
  var self = this;

  return map(waypoints, function(pos) {
    return self.createDiWaypoint(pos);
  });
};

PositFactory.prototype.createDiWaypoint = function(point) {
  return this.create('dc:Point', pick(point, [ 'x', 'y' ]));
};


PositFactory.prototype.createDiEdge = function(semantic, waypoints, attrs) {
  return this.create('bpmndi:BPMNEdge', assign({
    bpmnElement: semantic
  }, attrs));
};

PositFactory.prototype.createDiPlane = function(semantic) {
  return this.create('bpmndi:BPMNPlane', {
    bpmnElement: semantic
  });
};