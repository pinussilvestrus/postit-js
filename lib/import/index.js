import translate from 'diagram-js/lib/i18n/translate';

import PostitImporter from './PostitImporter';

export default {
  __depends__: [
    translate
  ],
  postitImporter: [ 'type', PostitImporter ]
};