import { is } from '../../util/ModelUtil';

function getLabelAttr(semantic) {
  if (is(semantic, 'postit:Postit')) {
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