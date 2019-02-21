import {
    CREATE,
    REMOVE,
    REPLACE,
    UPDATE,
    SET_PROP,
    REMOVE_PROP
} from './const'
import { createElement, setProp, removeProp } from './util'

function patchProps (el, patches) {
    for (let i = 0; i < patches.length; i++) {
        const patchProp = patches[i];
        const { type } = patchProp;
        let { key, value } = patchProp.prop;
        if (key === 'className') {
            key = 'class';
        }
        if (type === SET_PROP) {
            setProp(el, key, value);
        } else if (type === REMOVE_PROP) {
            removeProp(el, key);
        }
    }
}
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
        patchProps(el, props);
        for (let i = 0; i < children.length; i++) {
          patch(el, children[i], i);
        }
        break;
    }
}