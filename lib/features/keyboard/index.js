import KeyboardModule from 'diagram-js/lib/features/keyboard';

import PostitKeyboardBindings from './PostitKeyboardBindings';

export default {
  __depends__: [
    KeyboardModule
  ],
  __init__: [ 'keyboardBindings' ],
  keyboardBindings: [ 'type', PostitKeyboardBindings ]
};
