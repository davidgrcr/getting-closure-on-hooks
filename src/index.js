const _React_ = (function () {
  let hooks = [];
  let idx = 0;

  function useState(initVal) {
    const state = hooks[idx] || initVal;
    const _idx = idx;
    const setState = (newVal) => {
      hooks[_idx] = newVal;
    };
    idx++;
    return [state, setState];
  }

  function render(Component) {
    idx = 0;
    const C = Component();
    C.render();
    return C;
  }

  function useEffect(cb, depArray) {
    const oldDeps = hooks[idx];
    let hasChanged = true;
    // detect change
    if (oldDeps) {
      hasChanged = depArray.some((dep, i) => !Object.is(dep, oldDeps[i]));
    }
    if (hasChanged) cb();
    hooks[idx] = depArray;
    idx++;
  }

  return { useState, render, useEffect };
})();

function Component() {
  const [count, setCount] = _React_.useState(1);
  const [text, setText] = _React_.useState("apple");
  _React_.useEffect(() => {
    console.log("useEffect");
  }, []);

  return {
    render: () => console.log({ count, text }),
    click: () => setCount(count + 1),
    type: (word) => setText(word)
  };
}

var App = _React_.render(Component);
App.click();
App = _React_.render(Component);
App.type("pear");
App = _React_.render(Component);
