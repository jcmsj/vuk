
/**
 * 
 * @param {HTMLElement} el 
 * @param {HTMLElement} upToParent 
 * @returns 
 */
export default function generateSelector(el) {
  let path = [], parent;
  while (parent = el.parentNode) {
    let tag = el.tagName, siblings;
    path.unshift(
      el.id ? `#${el.id.replace(".", "\\.")}` : (
        siblings = parent.children,
        [].filter.call(siblings, sibling => sibling.tagName === tag).length === 1 ? tag :
        `${tag}:nth-child(${1+[].indexOf.call(siblings, el)})`
      )
    );
    el = parent;
  };
  return `${path.join(' > ')}`.toLowerCase();
};