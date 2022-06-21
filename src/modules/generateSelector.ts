
/**
 * From: https://stackoverflow.com/questions/8588301/how-to-generate-unique-css-selector-for-dom-element
 * @param {Element} el 
 * @param {Element} _parent Optional ancestor to stop at
 * @returns 
 */
 export default function generateSelector(el:Element, _parent:Element|null=null) {
    let path:Array<String> = [], parent:Element|null;
    while (parent = el.parentElement) {
      if (_parent instanceof Element && _parent.isSameNode(parent))
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