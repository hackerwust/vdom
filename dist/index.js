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

function createElement(node) {
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

function setProps(el, props) {
  for (const key in props) {
    el.setAttribute(key, props[key]);
  }
}

function view() {
  return h(
    "ul",
    { id: "filmList", className: "list" },
    h(
      "li",
      { className: "main" },
      "Detective Chinatown Vol 2"
    ),
    h(
      "li",
      null,
      "Ferdinand"
    ),
    h(
      "li",
      null,
      "Paddington 2"
    )
  );
}

function render(container) {
  const dom = createElement(view());
  container.appendChild(dom);
}