import DragDropImages from './DragDropImages';
import TopModalModule from '../top-modal';

export default {
  __depends__: [
    TopModalModule
  ],
  __init__: [ 'dragDropImages' ],
  dragDropImages: [ 'type', DragDropImages]
};
