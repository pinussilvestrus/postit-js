import translate from 'diagram-js/lib/i18n/translate';

import PostitOrderingProvider from './PostitOrderingProvider';

export default {
  __depends__: [
    translate
  ],
  __init__: [ 'postitOrderingProvider' ],
  postitOrderingProvider: [ 'type', PostitOrderingProvider ]
};