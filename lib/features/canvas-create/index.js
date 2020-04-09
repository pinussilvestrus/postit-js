import CanvasCreate from './CanvasCreate';
import DirectEditingModule from 'diagram-js-direct-editing';

export default {
  __depends__: [
    DirectEditingModule
  ],
  __init__: [ 'canvasCreate' ],
  canvasCreate: [ 'type', CanvasCreate ]
};