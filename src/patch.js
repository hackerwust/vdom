import {
    CREATE,
    REMOVE,
    REPLACE,
    UPDATE,
    SET_PROP,
    REMOVE_PROP
} from './const'
import { createElement } from './util'

export default function patch (parent, patches, index = 0) {
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