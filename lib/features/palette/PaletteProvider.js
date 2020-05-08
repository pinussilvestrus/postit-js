import {
  assign
} from 'min-dash';

import COLORS from '../../util/ColorUtil';


/**
 * A palette provider for postit elements.
 */
export default function PaletteProvider(
    palette, create, elementFactory,
    spaceTool, lassoTool, handTool, translate) {

  this._palette = palette;
  this._create = create;
  this._elementFactory = elementFactory;
  this._spaceTool = spaceTool;
  this._lassoTool = lassoTool;
  this._handTool = handTool;
  this._translate = translate;

  palette.registerProvider(this);
}

PaletteProvider.$inject = [
  'palette',
  'create',
  'elementFactory',
  'spaceTool',
  'lassoTool',
  'handTool',
  'translate'
];


PaletteProvider.prototype.getPaletteEntries = function(element) {

  var actions = {},
      create = this._create,
      elementFactory = this._elementFactory,
      spaceTool = this._spaceTool,
      lassoTool = this._lassoTool,
      handTool = this._handTool,
      translate = this._translate;

  function createAction(type, group, className, title, options) {

    function createListener(event) {
      var shape = elementFactory.createShape(assign({ type: type }, options));
      create.start(event, shape);
    }

    var shortType = type.replace(/^postit:/, '');

    return {
      group: group,
      className: className,
      title: title || translate('Create {type}', { type: shortType }),
      action: {
        dragstart: createListener,
        click: createListener
      }
    };
  }

  function createImage() {

    // todo: open popup


  }

  assign(actions, {
    'hand-tool': {
      group: 'tools',
      className: 'bpmn-icon-hand-tool',
      title: translate('Activate the hand tool'),
      action: {
        click: function(event) {
          handTool.activateHand(event);
        }
      }
    },
    'lasso-tool': {
      group: 'tools',
      className: 'bpmn-icon-lasso-tool',
      title: translate('Activate the lasso tool'),
      action: {
        click: function(event) {
          lassoTool.activateSelection(event);
        }
      }
    },
    'space-tool': {
      group: 'tools',
      className: 'bpmn-icon-space-tool',
      title: translate('Activate the create/remove space tool'),
      action: {
        click: function(event) {
          spaceTool.activateSelection(event);
        }
      }
    },
    'tool-separator': {
      group: 'tools',
      separator: true
    },
    'create.square-postit': createAction(
      'postit:SquarePostit', 'postits', 'pjs-postit-square',
      translate('Create Square Postit'), { color: COLORS.GREEN }
    ),
    'create.circle-postit': createAction(
      'postit:CirclePostit', 'postits', 'pjs-postit-circle',
      translate('Create Circle Postit'), { color: COLORS.PINK }
    ),
    'postit-separator': {
      group: 'postits',
      separator: true
    },
    'create.image': {
      group: 'artifact',
      className: 'pjs-image',
      title: translate('Create Image'),
      action: {
        click: function(event) {
          createImage(event);
        }
      }
    },
    'create.text-box': createAction(
      'postit:TextBox', 'artifact', 'pjs-text-box',
      translate('Create Text')
    ),
    'create.group': createAction(
      'postit:Group', 'artifact', 'pjs-group',
      translate('Create Group')
    )
  });

  return actions;
};
