
/**
 * From: https://stackoverflow.com/questions/8588301/how-to-generate-unique-css-selector-for-dom-element
 * @param {HTMLElement} el 
 * @param {HTMLElement} _parent Optional ancestor to stop at
 * @returns 
 */
export default function generateSelector(el, _parent=null) {
  let path = [], parent;
  while (parent = el.parentNode) {
    if (_parent instanceof HTMLElement && _parent.isSameNode(parent))
      break;

    if (el.id) {
      //An ID selector exists, so stop here.
      path.unshift('#' + el.id.replace(".", "\\."))
      break;
    } else {
      let tag = el.tagName,
        siblings = parent.children
      path.unshift(
          [].filter.call(siblings, sibling => sibling.tagName === tag).length === 1 ? tag :
          `${tag}:nth-child(${1+[].indexOf.call(siblings, el)})`
      );
    }

    el = parent;
  };
  return path.join(' > ').toLowerCase();
};