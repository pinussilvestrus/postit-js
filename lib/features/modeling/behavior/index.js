import AdaptiveLabelPositioningBehavior from './AdaptiveLabelPositioningBehavior';
import AppendBehavior from './AppendBehavior';
import AssociationBehavior from './AssociationBehavior';
import AttachEventBehavior from './AttachEventBehavior';
import BoundaryEventBehavior from './BoundaryEventBehavior';
import RootElementReferenceBehavior from './RootElementReferenceBehavior';
import FixHoverBehavior from './FixHoverBehavior';
import ImportDockingFix from './ImportDockingFix';
import IsHorizontalFix from './IsHorizontalFix';
import LabelBehavior from './LabelBehavior';
import ModelingFeedback from './ModelingFeedback';
import ReplaceElementBehaviour from './ReplaceElementBehaviour';
import UnclaimIdBehavior from './UnclaimIdBehavior';

export default {
  __init__: [
    'adaptiveLabelPositioningBehavior',
    'appendBehavior',
    'associationBehavior',
    'attachEventBehavior',
    'boundaryEventBehavior',
    'rootElementReferenceBehavior',
    'fixHoverBehavior',
    'importDockingFix',
    'isHorizontalFix',
    'labelBehavior',
    'modelingFeedback',
    'replaceElementBehaviour',
    'unclaimIdBehavior'
  ],
  adaptiveLabelPositioningBehavior: [ 'type', AdaptiveLabelPositioningBehavior ],
  appendBehavior: [ 'type', AppendBehavior ],
  associationBehavior: [ 'type', AssociationBehavior ],
  attachEventBehavior: [ 'type', AttachEventBehavior ],
  boundaryEventBehavior: [ 'type', BoundaryEventBehavior ],
  rootElementReferenceBehavior: [ 'type', RootElementReferenceBehavior ],
  fixHoverBehavior: [ 'type', FixHoverBehavior ],
  importDockingFix: [ 'type', ImportDockingFix ],
  isHorizontalFix: [ 'type', IsHorizontalFix ],
  labelBehavior: [ 'type', LabelBehavior ],
  modelingFeedback: [ 'type', ModelingFeedback ],
  replaceElementBehaviour: [ 'type', ReplaceElementBehaviour ],
  unclaimIdBehavior: [ 'type', UnclaimIdBehavior ]
};
