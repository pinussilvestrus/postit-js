import AdaptiveLabelPositioningBehavior from './AdaptiveLabelPositioningBehavior';
import AppendBehavior from './AppendBehavior';
import RootElementReferenceBehavior from './RootElementReferenceBehavior';
import FixHoverBehavior from './FixHoverBehavior';
import ImportDockingFix from './ImportDockingFix';
import IsHorizontalFix from './IsHorizontalFix';
import LabelBehavior from './LabelBehavior';
import ReplaceElementBehaviour from './ReplaceElementBehaviour';
import UnclaimIdBehavior from './UnclaimIdBehavior';
import GroupBehavior from './GroupBehavior';
import CreatePostitBehavior from './CreatePostitBehavior';

export default {
  __init__: [
    'adaptiveLabelPositioningBehavior',
    'appendBehavior',
    'rootElementReferenceBehavior',
    'fixHoverBehavior',
    'importDockingFix',
    'isHorizontalFix',
    'labelBehavior',
    'replaceElementBehaviour',
    'unclaimIdBehavior',
    'groupBehavior',
    'createPostitBehavior'
  ],
  adaptiveLabelPositioningBehavior: [ 'type', AdaptiveLabelPositioningBehavior ],
  appendBehavior: [ 'type', AppendBehavior ],
  rootElementReferenceBehavior: [ 'type', RootElementReferenceBehavior ],
  fixHoverBehavior: [ 'type', FixHoverBehavior ],
  importDockingFix: [ 'type', ImportDockingFix ],
  isHorizontalFix: [ 'type', IsHorizontalFix ],
  labelBehavior: [ 'type', LabelBehavior ],
  replaceElementBehaviour: [ 'type', ReplaceElementBehaviour ],
  unclaimIdBehavior: [ 'type', UnclaimIdBehavior ],
  groupBehavior: [ 'type', GroupBehavior ],
  createPostitBehavior: [ 'type', CreatePostitBehavior ]
};
