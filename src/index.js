import h from './runtime'
import diff from './diff'
import patch from './patch'
import { createElement } from './util'


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

function tick(el, count) {
  const patches = diff(view(count + 1), view(count))
  patch(el, patches)

  if(count > 5) { return }
  setTimeout(() => tick(el, count + 1), 1000)
}

export default render