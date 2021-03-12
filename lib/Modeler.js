import inherits from 'inherits';

import BaseModeler from './BaseModeler';

import Viewer from './Viewer';
import NavigatedViewer from './NavigatedViewer';

import KeyboardMoveModule from 'diagram-js/lib/navigation/keyboard-move';
import MoveCanvasModule from 'diagram-js/lib/navigation/movecanvas';
import TouchModule from 'diagram-js/lib/navigation/touch';
import ZoomScrollModule from 'diagram-js/lib/navigation/zoomscroll';

import AlignElementsModule from 'diagram-js/lib/features/align-elements';
import AutoScrollModule from 'diagram-js/lib/features/auto-scroll';
import BendpointsModule from 'diagram-js/lib/features/bendpoints';
import CanvasCreate from './features/canvas-create';
import ConnectModule from 'diagram-js/lib/features/connect';
import ConnectionPreviewModule from 'diagram-js/lib/features/connection-preview';
import ContextPadModule from './features/context-pad';
import CopyPasteModule from './features/copy-paste';
import CreateModule from 'diagram-js/lib/features/create';
import EditorActionsModule from './features/editor-actions';
import ImageSelectionModule from './features/image-selection';
import KeyboardModule from './features/keyboard';
import KeyboardMoveSelectionModule from 'diagram-js/lib/features/keyboard-move-selection';
import LabelEditingModule from './features/label-editing';
import ModelingModule from './features/modeling';
import MoveModule from 'diagram-js/lib/features/move';
import PaletteModule from './features/palette';
import ReplacePreviewModule from './features/replace-preview';
import ResizeModule from 'diagram-js/lib/features/resize';
import SnappingModule from './features/snapping';

var initialDiagram =
  `<?xml version="1.0" encoding="UTF-8"?>
  <postit:definitions xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:dc="http://www.omg.org/spec/DD/20100524/DC" xmlns:di="http://www.omg.org/spec/DD/20100524/DI" id="sample-diagram">
    <postit:PostitBoard id="Board_1">
    </postit:PostitBoard>
    <postitDi:PostitRootBoard id="RootBoard_1">
      <postitDi:PostitPlane id="PositPlane_1" boardElement="Board_1">
      </postitDi:PostitPlane>
    </postitDi:PostitRootBoard>
  </postit:definitions>`;

export default function Modeler(options) {
  BaseModeler.call(this, options);
}

inherits(Modeler, BaseModeler);


Modeler.Viewer = Viewer;
Modeler.NavigatedViewer = NavigatedViewer;

/**
* The createDiagram result.
*
* @typedef {Object} CreateDiagramResult
*
* @property {Array<string>} warnings
*/

/**
* The createDiagram error.
*
* @typedef {Error} CreateDiagramError
*
* @property {Array<string>} warnings
*/

/**
 * Create a new diagram to start modeling.
 *
 * @returns {Promise<CreateDiagramResult, CreateDiagramError>}
 *
 */
Modeler.prototype.createDiagram = function() {
  return this.importXML(initialDiagram);
};


Modeler.prototype._interactionModules = [

  // non-modeling components
  KeyboardMoveModule,
  MoveCanvasModule,
  TouchModule,
  ZoomScrollModule
];

Modeler.prototype._modelingModules = [

  // modeling components
  AlignElementsModule,
  AutoScrollModule,
  BendpointsModule,
  CanvasCreate,
  ConnectModule,
  ConnectionPreviewModule,
  ContextPadModule,
  CopyPasteModule,
  CreateModule,
  EditorActionsModule,
  ImageSelectionModule,
  KeyboardModule,
  KeyboardMoveSelectionModule,
  LabelEditingModule,
  ModelingModule,
  MoveModule,
  PaletteModule,
  ReplacePreviewModule,
  ResizeModule,
  SnappingModule,
];


// modules the modeler is composed of
//
// - viewer modules
// - interaction modules
// - modeling modules

Modeler.prototype._modules = [].concat(
  Viewer.prototype._modules,
  Modeler.prototype._interactionModules,
  Modeler.prototype._modelingModules
);
