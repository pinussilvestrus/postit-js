import AdaptiveLabelPositioningBehavior from './AdaptiveLabelPositioningBehavior';
import AppendBehavior from './AppendBehavior';
import AssociationBehavior from './AssociationBehavior';
import AttachEventBehavior from './AttachEventBehavior';
import BoundaryEventBehavior from './BoundaryEventBehavior';
import RootElementReferenceBehavior from './RootElementReferenceBehavior';
import CreateBehavior from './CreateBehavior';
import FixHoverBehavior from './FixHoverBehavior';
import ImportDockingFix from './ImportDockingFix';
import IsHorizontalFix from './IsHorizontalFix';
import LabelBehavior from './LabelBehavior';
import ModelingFeedback from './ModelingFeedback';
import ReplaceElementBehaviour from './ReplaceElementBehaviour';
import RemoveElementBehavior from './RemoveElementBehavior';
import UnclaimIdBehavior from './UnclaimIdBehavior';

export default {
  __init__: [
    'adaptiveLabelPositioningBehavior',
    'appendBehavior',
    'associationBehavior',
    'attachEventBehavior',
    'boundaryEventBehavior',
    'rootElementReferenceBehavior',
    'createBehavior',
    'fixHoverBehavior',
    'importDockingFix',
    'isHorizontalFix',
    'labelBehavior',
    'modelingFeedback',
    'removeElementBehavior',
    'replaceElementBehaviour',
    'unclaimIdBehavior'
  ],
  adaptiveLabelPositioningBehavior: [ 'type', AdaptiveLabelPositioningBehavior ],
  appendBehavior: [ 'type', AppendBehavior ],
  associationBehavior: [ 'type', AssociationBehavior ],
  attachEventBehavior: [ 'type', AttachEventBehavior ],
  boundaryEventBehavior: [ 'type', BoundaryEventBehavior ],
  rootElementReferenceBehavior: [ 'type', RootElementReferenceBehavior ],
  createBehavior: [ 'type', CreateBehavior ],
  fixHoverBehavior: [ 'type', FixHoverBehavior ],
  importDockingFix: [ 'type', ImportDockingFix ],
  isHorizontalFix: [ 'type', IsHorizontalFix ],
  labelBehavior: [ 'type', LabelBehavior ],
  modelingFeedback: [ 'type', ModelingFeedback ],
  replaceElementBehaviour: [ 'type', ReplaceElementBehaviour ],
  removeElementBehavior: [ 'type', RemoveElementBehavior ],
  unclaimIdBehavior: [ 'type', UnclaimIdBehavior ]
};
