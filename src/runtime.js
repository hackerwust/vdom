import { flatten } from './util'

export default function h(type, props, ...children) {
    return {
      type,
      props: props || {},
      children: flatten(children || [])
    };
}
