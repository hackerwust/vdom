import { isNotSameTypeNode } from './util'
import {
    CREATE,
    REMOVE,
    REPLACE,
    UPDATE,
    SET_PROP,
    REMOVE_PROP
} from './const'

const diff = function (newNode, oldNode) {
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

const diffProps = function (newNode, oldNode) {
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

export default diff