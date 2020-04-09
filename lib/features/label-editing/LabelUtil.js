import { is } from '../../util/ModelUtil';
import { isAny } from '../modeling/util/ModelingUtil';

function getLabelAttr(semantic) {
  if (isAny(semantic, [ 'postit:Postit', 'postit:TextBox' ])) {
    return 'name';
  }

  if (is(semantic, 'bpmn:Group')) {
    return 'categoryValueRef';
  }
}

function getCategoryValue(semantic) {
  var categoryValueRef = semantic['categoryValueRef'];

  if (!categoryValueRef) {
    return '';
  }


  return categoryValueRef.value || '';
}

export function getLabel(element) {
  var semantic = element.businessObject,
      attr = getLabelAttr(semantic);

  if (attr) {
    if (attr === 'categoryValueRef') {

      return getCategoryValue(semantic);
    }

    return semantic[attr] || '';
  }
}


export function setLabel(element, text) {
  var semantic = element.businessObject,
      attr = getLabelAttr(semantic);

  if (attr) {

    if (attr === 'categoryValueRef') {
      semantic['categoryValueRef'].value = text;
    } else {
      semantic[attr] = text;
    }

  }

  return element;
}