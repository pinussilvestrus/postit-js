import { is } from '../../util/ModelUtil';

function getLabelAttr(semantic) {
  if (
    is(semantic, 'postit:Postit')) {
    return 'name';
  }
}
export function getLabel(element) {
  var semantic = element.businessObject,
      attr = getLabelAttr(semantic);

  if (attr) {
    return semantic[attr] || '';
  }
}


export function setLabel(element, text) {
  var semantic = element.businessObject,
      attr = getLabelAttr(semantic);

  if (attr) {

    semantic[attr] = text;

  }

  return element;
}