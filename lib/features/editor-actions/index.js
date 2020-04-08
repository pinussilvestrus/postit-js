import EditorActionsModule from 'diagram-js/lib/features/editor-actions';

import PostitEditorActions from './PostitEditorActions';

export default {
  __depends__: [
    EditorActionsModule
  ],
  editorActions: [ 'type', PostitEditorActions ]
};
