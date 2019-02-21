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

function view () {
  return (
    <ul id="filmList" className="list">
      <li className="main">Detective Chinatown Vol 2</li>
      <li>Ferdinand</li>
      <li>Paddington 2</li>
    </ul>
  )
}

function render(container) {
  const dom = createElement(view());
  container.appendChild(dom);
}