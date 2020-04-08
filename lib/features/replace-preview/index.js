import PreviewSupportModule from 'diagram-js/lib/features/preview-support';

import PostitReplacePreview from './PostitReplacePreview';

export default {
  __depends__: [
    PreviewSupportModule
  ],
  __init__: [ 'postitReplacePreview' ],
  postitReplacePreview: [ 'type', PostitReplacePreview ]
};
