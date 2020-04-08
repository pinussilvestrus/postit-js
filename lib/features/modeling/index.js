import BehaviorModule from './behavior';
import RulesModule from '../rules';
import DiOrderingModule from '../di-ordering';
import OrderingModule from '../ordering';
import ReplaceModule from '../replace';

import CommandModule from 'diagram-js/lib/command';
import TooltipsModule from 'diagram-js/lib/features/tooltips';
import LabelSupportModule from 'diagram-js/lib/features/label-support';
import AttachSupportModule from 'diagram-js/lib/features/attach-support';
import SelectionModule from 'diagram-js/lib/features/selection';
import ChangeSupportModule from 'diagram-js/lib/features/change-support';
import SpaceToolModule from 'diagram-js/lib/features/space-tool';

import PositFactory from './PostitFactory';
import PostitUpdater from './PostitUpdater';
import ElementFactory from './ElementFactory';
import Modeling from './Modeling';
import Layouter from 'diagram-js/lib/layout/BaseLayouter';
import CroppingConnectionDocking from 'diagram-js/lib/layout/CroppingConnectionDocking';


export default {
  __init__: [
    'modeling',
    'postitUpdater'
  ],
  __depends__: [
    BehaviorModule,
    RulesModule,
    DiOrderingModule,
    OrderingModule,
    ReplaceModule,
    CommandModule,
    TooltipsModule,
    LabelSupportModule,
    AttachSupportModule,
    SelectionModule,
    ChangeSupportModule,
    SpaceToolModule
  ],
  postitFactory: [ 'type', PositFactory ],
  postitUpdater: [ 'type', PostitUpdater ],
  elementFactory: [ 'type', ElementFactory ],
  modeling: [ 'type', Modeling ],
  layouter: [ 'type', Layouter ],
  connectionDocking: [ 'type', CroppingConnectionDocking ]
};