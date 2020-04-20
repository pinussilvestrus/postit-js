import { isAny } from '../modeling/util/ModelingUtil';

function getLabelAttr(semantic) {
  if (isAny(semantic, [ 'postit:Postit', 'postit:TextBox', 'postit:Group' ])) {
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