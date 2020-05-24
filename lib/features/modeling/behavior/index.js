import AdaptiveLabelPositioningBehavior from './AdaptiveLabelPositioningBehavior';
import AppendBehavior from './AppendBehavior';
import FixHoverBehavior from './FixHoverBehavior';
import ImportDockingFix from './ImportDockingFix';
import LabelBehavior from './LabelBehavior';
import ReplaceElementBehaviour from './ReplaceElementBehaviour';
import UnclaimIdBehavior from './UnclaimIdBehavior';
import CreateBoardElementBehavior from './CreateBoardElementBehavior';
import EmptyTextBoxBehavior from './EmptyTextBoxBehavior';

export default {
  __init__: [
    'adaptiveLabelPositioningBehavior',
    'appendBehavior',
    'fixHoverBehavior',
    'importDockingFix',
    'labelBehavior',
    'replaceElementBehaviour',
    'unclaimIdBehavior',
    'createBoardElementBehavior',
    'emptyTextBoxBehavior'
  ],
  adaptiveLabelPositioningBehavior: [ 'type', AdaptiveLabelPositioningBehavior ],
  appendBehavior: [ 'type', AppendBehavior ],
  fixHoverBehavior: [ 'type', FixHoverBehavior ],
  importDockingFix: [ 'type', ImportDockingFix ],
  labelBehavior: [ 'type', LabelBehavior ],
  replaceElementBehaviour: [ 'type', ReplaceElementBehaviour ],
  unclaimIdBehavior: [ 'type', UnclaimIdBehavior ],
  createBoardElementBehavior: [ 'type', CreateBoardElementBehavior ],
  emptyTextBoxBehavior: [ 'type', EmptyTextBoxBehavior ]
};
