export function flatten(arr) {
    return [].concat(...arr);
}

export function createElement (node) {
    if (typeof node === 'string') {
      return document.createTextNode(node);
    } else {
      const { type, props, children } = node;
      const el = document.createElement(type);
      setProps(el, props);
      if (Array.isArray(children)) {
        children.map(child => {
          el.appendChild(createElement(child));
        });
      }
      return el;
    }
}

export function setProps (el, props) {
    for (const key in props) {
      el.setAttribute(key, props[key]);
    }
}

export function isNotSameTypeNode (node1, node2) {
    // string -> Object | Object -> string
    if (typeof node1 !== typeof node2) {
      return true;
    }
    // string -> string
    if (typeof node1 === 'string' && node1 !== node2) {
      return true;
    }
    // [type] Object -> Object
    if (node1.type !== node2.type) {
      return true;
    }
    return false;
}