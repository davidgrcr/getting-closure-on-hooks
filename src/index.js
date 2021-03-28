const MyReact = (function () {
  let hooks = [],
    currentHook = 0; // array of hooks, and an iterator!
  return {
    render(Component) {
      const Comp = Component(); // run effects
      Comp.render();
      currentHook = 0; // reset for next render
      return Comp;
    },
    useEffect(callback, depArray) {
      const hasNoDeps = !depArray;
      const deps = hooks[currentHook]; // type: array | undefined
      const hasChangedDeps = deps
        ? !depArray.every((el, i) => el === deps[i])
        : true;
      if (hasNoDeps || hasChangedDeps) {
        callback();
        hooks[currentHook] = depArray;
      }
      currentHook++; // done with this hook
    },
    useState(initialValue) {
      hooks[currentHook] = hooks[currentHook] || initialValue; // type: any
      const setStateHookIndex = currentHook; // for setState's closure!
      const setState = (newState) => (hooks[setStateHookIndex] = newState);
      return [hooks[currentHook++], setState];
    }
  };
})();

let App;
/*
function Component() {
  const [count, setCount] = MyReact.useState(1);
  const [text, setText] = MyReact.useState("apple");
  MyReact.useEffect(() => {
    console.log("useEffect");
  }, []);

  return {
    render: () => console.log("render", { count, text }),
    click: () => setCount(count + 1),
    type: (word) => setText(word)
  };
}

App = MyReact.render(Component);
App.click();
App = MyReact.render(Component);
App.type("pear");
App = MyReact.render(Component);
*/
console.log("@@@@@@@ COUNTER @@@@@@@");

function Counter() {
  const [count, setCount] = MyReact.useState(0);
  const [text, setText] = MyReact.useState("foo"); // 2nd state hook!
  MyReact.useEffect(() => {
    console.log("effect", count, text);
  }, [count, text]);
  return {
    click: () => setCount(count + 1),
    type: (txt) => setText(txt),
    noop: () => setCount(count),
    render: () => console.log("render", { count, text })
  };
}

App = MyReact.render(Counter);
// effect 0 foo
// render {count: 0, text: 'foo'}
App.click();
App = MyReact.render(Counter);
// effect 1 foo
// render {count: 1, text: 'foo'}
App.type("bar");
App = MyReact.render(Counter);
// effect 1 bar
// render {count: 1, text: 'bar'}
App.noop();
App = MyReact.render(Counter);
// // no effect run
// render {count: 1, text: 'bar'}
App.click();
App = MyReact.render(Counter);
// effect 2 bar
// render {count: 2, text: 'bar'}
