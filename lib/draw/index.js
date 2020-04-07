import PostitRenderer from './PostitRenderer';
import TextRenderer from './TextRenderer';

import PathMap from './PathMap';

export default {
  __init__: [ 'postitRenderer' ],
  postitRenderer: [ 'type', PostitRenderer ],
  textRenderer: [ 'type', TextRenderer ],
  pathMap: [ 'type', PathMap ]
};
