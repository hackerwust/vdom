(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = global || self, global.render = factory());
}(this, function () { 'use strict';

  function _typeof(obj) {
    if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
      _typeof = function (obj) {
        return typeof obj;
      };
    } else {
      _typeof = function (obj) {
        return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
      };
    }

    return _typeof(obj);
  }

  function _toConsumableArray(arr) {
    return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread();
  }

  function _arrayWithoutHoles(arr) {
    if (Array.isArray(arr)) {
      for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) arr2[i] = arr[i];

      return arr2;
    }
  }

  function _iterableToArray(iter) {
    if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter);
  }

  function _nonIterableSpread() {
    throw new TypeError("Invalid attempt to spread non-iterable instance");
  }

  function flatten(arr) {
    var _ref;

    return (_ref = []).concat.apply(_ref, _toConsumableArray(arr));
  }
  function createElement(node) {
    if (typeof node === 'string') {
      return document.createTextNode(node);
    } else {
      var type = node.type,
          props = node.props,
          children = node.children;
      var el = document.createElement(type);
      setProps(el, props);

      if (Array.isArray(children)) {
        children.map(function (child) {
          el.appendChild(createElement(child));
        });
      }

      return el;
    }
  }
  function setProps(el, props) {
    for (var key in props) {
      el.setAttribute(key, props[key]);
    }
  }
  function isNotSameTypeNode(node1, node2) {
    // string -> Object | Object -> string
    if (_typeof(node1) !== _typeof(node2)) {
      return true;
    } // string -> string


    if (typeof node1 === 'string' && node1 !== node2) {
      return true;
    } // [type] Object -> Object


    if (node1.type !== node2.type) {
      return true;
    }

    return false;
  }

  function h(type, props) {
    for (var _len = arguments.length, children = new Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
      children[_key - 2] = arguments[_key];
    }

    return {
      type: type,
      props: props || {},
      children: flatten(children || [])
    };
  }

  // 常量
  var CREATE = 'create';
  var REMOVE = 'remove';
  var REPLACE = 'replace';
  var UPDATE = 'update';
  var SET_PROP = 'set_prop';
  var REMOVE_PROP = 'remove_prop';

  var diff = function diff(newNode, oldNode) {
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
    } // 没有变化


    return null;
  };

  var diffProps = function diffProps(newNode, oldNode) {
    var patches = [];
    var oldProps = oldNode.props;
    var newProps = newNode.props;

    for (var key in newProps) {
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

    for (var _key in oldProps) {
      if (!newNode.hasOwnProperty(_key)) {
        patches.push({
          type: REMOVE_PROP,
          prop: {
            key: _key,
            value: oldProps[_key]
          }
        });
      }
    }

    return patches;
  };

  function diffChildren(newNode, oldNode) {
    var patches = [];
    var oldChildren = oldNode.children;
    var newChildren = newNode.children;
    var maxLen = Math.max(newChildren.length, oldChildren.length);

    for (var i = 0; i < maxLen; i++) {
      patches.push(diff(newChildren[i], oldChildren[i]));
    }

    return patches;
  }

  function patch(parent, patches) {
    var index = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
    if (!patches) return;
    var el = parent.children[index];

    switch (patches.type) {
      case REMOVE:
        parent.removeChild(el);
        break;

      case CREATE:
        var newEl = createElement(patches.node);
        parent.appendChild(newEl);
        break;

      case REPLACE:
        var replaceEl = createElement(patches.node);
        parent.replaceChild(replaceEl, el);
        break;

      case UPDATE:
        var props = patches.props,
            children = patches.children;

        for (var i = 0; i < props.length; i++) {
          var patchProp = props[i];
          var type = patchProp.type;
          var _patchProp$prop = patchProp.prop,
              key = _patchProp$prop.key,
              value = _patchProp$prop.value;

          if (type === SET_PROP) {
            el.setAttribute(key, value);
          } else if (type === REMOVE_PROP) {
            el.removeAttribute(key === 'className' ? 'class' : key);
          }
        }

        for (var _i = 0; _i < children.length; _i++) {
          patch(el, children[_i], _i);
        }

        break;
    }
  }

  function view() {
    var countForTest = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
    var list = Array.from(new Array(countForTest)).map(function (item, index) {
      return h("li", {
        className: 'li_' + index
      }, "item ", index.toString());
    });
    return h("ul", {
      id: "filmList",
      className: 'total-list' + countForTest
    }, list);
  }

  function render(container) {
    var initialCount = 0;
    var dom = createElement(view(initialCount));
    container.appendChild(dom); // for patch test

    setTimeout(function () {
      return tick(container, initialCount);
    }, 1000);
  }

  function tick(el, count) {
    var patches = diff(view(count + 1), view(count));
    patch(el, patches);

    if (count > 5) {
      return;
    }

    setTimeout(function () {
      return tick(el, count + 1);
    }, 1000);
  }

  return render;

}));
