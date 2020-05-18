### 学习react hook

最近着手react项目，那么第一步肯定是了解成型的最优解，我了解到写react最优解就是装饰器+hook+一些函数式编程，所以一步步实践，先把基础知识梳理下来方便后续遗忘翻阅

#### useState

可以传入值作为state的默认值，返回一个数组，数组的第一项是对应的状态(默认值会赋予状态)，数组的第二项是更新状态的函数。

``` js
import React, { useState } from "react";
const Greeting = () => {
    const [count, setCount] = useState(0);      //第一次使用
    const [istrue, setIstrue] = useState(true); //第二次使用
    return (
       <>
            {istrue ? <h1> {count} </h1> : void 0}
            <button onClick={ () => {setIstrue(!istrue)}}>change</button>
            <button onClick={() => {setCount(count + 1)}}> + </button>
       </>
    )
}
export default Greeting;
```

#### useEffect

`useEffect` 这个方法传入一个函数作为参数，在函数里面执行副作用代码，并且 `useEffect` 的第一个参数还支持返回值为一个函数，这个函数执行相当于组件更新和卸载。函数的返回值相当于 `componentWillUnmount`,在 `componentDidMount` 和 `componentDidUpdate` 中执行副作用

`useEffect` 的第二个参数是一个数组，表示以来什么 `state` 和 `props` 来执行副作用。

``` js
import React, {useState, useEffect} from "react";

const EffectComponent = () => {
    const [width, setWidth] = useState(window.innerWidth);
    const resizeHandle = () => {
        setWidth(window.innerWidth);
    }
    useEffect(() => {
        window.addEventListener("resize", resizeHandle);
        return () => {
            window.removeEventListener("resize", resizeHandle)
        }
    })
    return (
        <h1>{width}</h1>
    );
}
export default EffectComponent
```

数组为空的时候， `useEffect` 就相当于 `componentDidMoubt` 和 `componentWillUnmount` 这两个生命周期，只在首次渲染和卸载的时候执行。

当数组中值是状态的时候，就会只监听这一个状态的变化。当然数组中可以多个值，监听存放 `state` 的变化。

``` js
const EffectComponent = () => {
    const [count, setCount] = useState(1);
    const [num, setNum] = useState(2);
    useEffect(() => {
        console.log("count状态更新");
        return () => {
            console.log("count卸载")
        }
    },[count])
    useEffect(() => {
        console.log("num状态更新");
        return () => {
            console.log("num卸载")
        }
    },[num])
    return (
        <>
            <h1>{count}</h1>
            <button onClick={() => {setCount(count + 1)}}>+</button>
            <h1>{num}</h1>
            <button onClick={() => {setNum(num + 1)}}>+</button>
        </>
    );
}

```

#### useContext

`useContext` 主要用于组件的传值问题， `useContext Hook` 接受一个 `context` 对象(由 `createContext` 创建的对象)作为参数，并返回 `Context.Consumer`。

##### 使用方式

``` js
import React, { createContext,useContext } from 'react'
let stateContext = createContext()
const ContextComponent = () => {
  const value = useContext(stateContext)
  return (
    <>
      <h1>{value}</h1>
    </>
  )
}
export default () => (
  <stateContext.Provider value={'Hello React'}>
    <ContextComponent />
  </stateContext.Provider>
)
```

使用useContext，必须在函数式组件中，否则会报错。

#### useReducer

useReducer一共可以接受三个参数并返回当前的state与其配套的dispatch。

1. useReducer的第一个参数就是形如(state,action) => newState这样的reducer，没错就是reducer，和redux完全相同。我们来定义一个简单的reducer。

``` js
const reducer = (state, action) => {
    switch(action.type){
        case "ADD_TODO":
            return [
                ...state,
                action.todo
            ];
        default:
            return state;

    }
}
```

2. useReducer的第二个参数和Redux的createStore也相同，指定状态的默认值。

``` js
useReducer(reducer,[{
    id: Date.now(),
    value: "Hello react"
}])
```

3. useReducer的第三个参数接受一个函数作为参数，并把第二个参数当作函数的参数执行。主要作用是初始值的惰性求值，把一些对状态的逻辑抽离出来，有利于重置state。

``` js
function init(initialCount) {
    return [
        ...initialCount,
    ];
}

useReducer(reducer,[
        {
            id: Date.now(),
            value: "Hello react"
        }
    ],init)
```

#### useReducer的返回值

为一个数组，数组的第一项为 `当前state` ，第二项为 `与当前state对应的dispatch` ，可以使用ES6的解构赋值拿到这两个

``` js
const [state,dispatch] = useReducer(reducer,[
    {
        id: Date.now(),
        value: "Hello react"
    }
],init)
```

##### 使用方式

``` js
import React, { useReducer } from 'react'

export default () => {
  const reducer = (state, action) => {
    switch (action.type) {
      case 'ADD_TODO':
        return [...state, action.todo]
      default:
        return state
    }
  }
  const [state,dispatch] = useReducer(reducer,[])
  const change = (id) => {
    dispatch({
      type: 'CHANGE_TODO',
      id
    })
  }
  let Todo = ({todo,change}) => {
    return (
        console.log("render"),
        <li onClick={change}>{todo}</li>
    );
  }

  return (<>
    <button
      onClick={() => {
        dispatch({
          type: 'ADD_TODO',
          todo: { id: Date.now(), value: 'Hello Hook' }
        })
      }}
    >
      {' '}
      Add{' '}
    </button>
    {state.map((todo, index) => (
      <Todo
        key={index}
        todo={todo.value}
        change={() => {
          change(todo.id)
        }}
      />
    ))}
  </>)
}
```

### useCallback

useCallback可以认为是 `对依赖项的监听` ，把接受 `一个回调函数` 和 `依赖项数组` ，返回一个 `该回调函数的memoized(记忆)版本` ，该回调函数仅在某个依赖项改变时才会更新。

``` js
import React, { useState,useCallback } from 'react'

export default () => {
  let [count, setCount] = useState(1);
  let [num, setNum] = useState(1);

  const memoized = useCallback( () => {
      return num;
  },[num])
  console.log("记忆：",memoized());
  console.log("原始：",num);
  return (
      <>
          <button onClick={() => {setCount(count + 1)}}> count+ </button>
          <button onClick={() => {setNum(num + 1)}}> num+ </button>
      </>
  )
}
```

如果没有传入依赖项数组，那么记忆函数在每次渲染的时候都会更新。

### useMemo

useMemo和useCallback很像，唯一不同的就是

``` js
useCallback(fn, deps) 相当于 useMemo(() => fn, deps
```

### useRef

useRef返回一个可变的ref对象，useRef接受一个参数绑定在返回的ref对象的current属性上，返回的ref对象在整个生命周期中保持不变。

``` js
import React, { useRef,useEffect } from 'react'

export default () => {
    let inputRef = useRef(null);
    useEffect(() => {
        inputRef.current.focus();
    })
    return (
        <input type="text" ref={inputRef}/>
    )
}
```

上面例子在input上绑定一个ref，使得input在渲染后自动焦点聚焦。

### useImperativeHandle

useImperativeHandle 可以让你在使用 ref 时自定义暴露给父组件的实例值。
就是说：当我们使用父组件把ref传递给子组件的时候，这个Hook允许在子组件中把自定义实例附加到父组件传过来的ref上，有利于父组件控制子组件。

``` js
useImperativeHandle(ref, createHandle, [deps])
```

``` js
import React, { useRef,useEffect,forwardRef,useImperativeHandle } from 'react'

function FancyInput(props, ref) {
  const inputRef = useRef();
  useImperativeHandle(ref, () => ({
      focus: () => {
          inputRef.current.value="Hello";
      }
  }));
  return <input ref={inputRef} />;
}
let AancyInput = forwardRef(FancyInput);

export default () => {
  let ref = useRef();
  useEffect(() => {
      console.log(ref);
      ref.current.focus();//调用子组件内部方法focus
  })
  return (
      <>
          <AancyInput ref={ref}/>
      </>
  )
}
```

上面是一个父子组件中ref传递的例子，使用到了 `forwardRef` (这是一个高阶函数，主要用于ref在父子组件中的传递)，使用 `useImperativeHandle` 把第二个参数的返回值绑定到父组件传来的ref上。

### useLayoutEffect

这个钩子函数和useEffect相同，都是用来执行副作用。但是它会在所有的DOM变更之后同步调用effect。useLayoutEffect和useEffect最大的区别就是一个是同步一个是异步。
从这个Hook的名字上也可以看出，它主要用来读取DOM布局并触发同步渲染，在浏览器执行绘制之前，useLayoutEffect 内部的更新计划将被同步刷新。
官网建议还是尽可能的是使用标准的useEffec以避免阻塞视觉更新。

### 自定义Hook

我们来封装一个数字加减的Hook

``` js
import React, { useState } from 'react'
const useCount = (num) => {
  let [count, setCount] = useState(num);
  return [count,()=>setCount(count + 1), () => setCount(count - 1)]
};
export default () => {
  let [count, addCount, redCount] = useCount(1);

  return (
      <>
          <h1>{count}</h1>
          <button onClick={addCount}> + </button>
          <button onClick={redCount}> - </button>
      </>
  )
}
```
