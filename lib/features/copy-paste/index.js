import CopyPasteModule from 'diagram-js/lib/features/copy-paste';

import PostitCopyPaste from './PostitCopyPaste';
import ModdleCopy from './ModdleCopy';

export default {
  __depends__: [
    CopyPasteModule
  ],
  __init__: [ 'postitCopyPaste', 'moddleCopy' ],
  postitCopyPaste: [ 'type', PostitCopyPaste ],
  moddleCopy: [ 'type', ModdleCopy ]
};
