/* jsx ------------------ dom */
function flatten(arr) {
  return [].concat(...arr);
}

function h(type, props, ...children) {
  return {
    type,
    props: props || {},
    children: flatten(children || [])
  };
}

function createElement (node) {
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

function setProps (el, props) {
  for (const key in props) {
    el.setAttribute(key, props[key]);
  }
}

// 常量
const CREATE = 'create';
const REMOVE = 'remove';
const REPLACE = 'replace';
const UPDATE = 'update';
const SET_PROP = 'set_prop';
const REMOVE_PROP = 'remove_prop';


/* ------------ vdom diff && patch -------------- */
function diff (newNode, oldNode) {
  if (!oldNode) {
    return {
      type: CREATE,
      node: newNode
    };
  }
  if (!newNode) {
    return {
      type: REMOVE
    };
  }
  if (isNotSameTypeNode(newNode, oldNode)) {
    return {
      type: REPLACE,
      node: newNode
    };
  }
  if (newNode.type) {
    return {
      type: UPDATE,
      props: diffProps(newNode, oldNode),
      children: diffChildren(newNode, oldNode)
    };
  }
  // 没有变化
  return null;
}

function isNotSameTypeNode (node1, node2) {
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

function diffProps (newNode, oldNode) {
  const patches = [];
  const oldProps = oldNode.props;
  const newProps = newNode.props;
  for (const key in newProps) {
    if (!oldProps.hasOwnProperty(key) || oldProps[key] !== newProps[key]) {
      patches.push({
        type: SET_PROP,
        prop: {
          key: key,
          value: newProps[key]
        }
      });
    }
  }

  for (const key in oldProps) {
    if (!newNode.hasOwnProperty(key)) {
      patches.push({
        type: REMOVE_PROP,
        prop:{
          key: key,
          value: oldProps[key]
        }
      });
    }
  }
  return patches;
}

function diffChildren (newNode, oldNode) {
  const patches = [];
  const oldChildren = oldNode.children;
  const newChildren = newNode.children;
  const maxLen = Math.max(newChildren.length, oldChildren.length);
  for (let i = 0; i < maxLen; i++) {
    patches.push(
      diff(newChildren[i], oldChildren[i])
    );
  }
  return patches;
}


// start to render component
function view (countForTest = 0) {
  const list = Array.from(new Array(countForTest))
    .map((item, index) => {
      return <li className={'li_' + index}>item {index.toString()}</li>
    });
  return (
    <ul id="filmList" className={'total-list' + countForTest}>
      {list}
    </ul>
  );
}

function render(container) {
  const initialCount = 0;
  const dom = createElement(view(initialCount));
  container.appendChild(dom);

  // for patch test
  setTimeout(() => tick(container, initialCount), 1000)
}

function patch (parent, patches, index = 0) {
  if (!patches) return;
  const el = parent.children[index];
  switch (patches.type) {
    case REMOVE:
      parent.removeChild(el);
      break;
    case CREATE:
      const newEl = createElement(patches.node);
      parent.appendChild(newEl);
      break;
    case REPLACE:
      const replaceEl = createElement(patches.node);
      parent.replaceChild(replaceEl, el);
      break;
    case UPDATE:
      const { props, children } = patches;
      for (let i = 0; i < props.length; i++) {
        const patchProp = props[i];
        const { type } = patchProp;
        const { key, value } = patchProp.prop;
        if (type === SET_PROP) {
          el.setAttribute(key, value);
        } else if (type === REMOVE_PROP) {
          el.removeAttribute(key === 'className' ? 'class' : key);
        }
      }
      for (let i = 0; i < children.length; i++) {
        patch(el, children[i], i);
      }
      break;
  }
}

function tick(el, count) {
  const patches = diff(view(count + 1), view(count))
  patch(el, patches)

  if(count > 5) { return }
  setTimeout(() => tick(el, count + 1), 1000)
}