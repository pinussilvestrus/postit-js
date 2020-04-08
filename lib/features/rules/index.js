import RulesModule from 'diagram-js/lib/features/rules';

import PostitRules from './PostitRules';

export default {
  __depends__: [
    RulesModule
  ],
  __init__: [ 'postitRules' ],
  postitRules: [ 'type', PostitRules ]
};
