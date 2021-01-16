>微前端体系已经初见成效，本文梳理下qiankun类微前端的本质

# 本质

qiankun类微前端优势或者优点有很多，其实本质上总结为下面两点

1. 按需加载的能力：切换到相应页面才加载对应资源
2. 对上述能力的修饰，如加buff和驱散副作用

## 按需加载的能力

1. 基座提供一份注册信息
2. 让子应用切换到对应页面进行匹配路由
3. 加载路由入口文件并渲染渲染的过程

## buff按需加载的能力

### 配置中心

提供配置中心例如：阿波罗平台，让路由的注册信息动态化，可以任意时间、任意环境发布我们的路由注册信息，让按需加载更灵活
![apollo](apollo.png)

对应的获取到的路由配置数据结构
![entry-config](entry-config.png)

### 挂载约束

子应用入口文件暴露统一生命周期内部负责渲染子应用，提供开放能力不限技术栈，让按需加载的能力奔放，且有章法

``` ts
// main.js

const render = (Component, domNode) => {
    ReactDOM.render(<Component />, domNode);
};
function getDomNode(props = {}) {
    const { container } = props;
    if (!container) return document.getElementById('container');

    if (typeof container === 'string') {
        return document.querySelector(props.container);
    }
    return container;
}

/**
 * bootstrap 只会在微应用初始化的时候调用一次，下次微应用重新进入时会直接调用 mount 钩子，不会再重复触发 bootstrap。
 * 通常我们可以在这里做一些全局变量的初始化，比如不会在 unmount 阶段被销毁的应用级别的缓存等。
 */
export async function bootstrap(props) {
    console.log('react app bootstraped', props);
}

/**
 * 应用每次进入都会调用 mount 方法，通常我们在这里触发应用的渲染方法
 */
export async function mount(props) {
    render(App, getDomNode(props));
}

/**
 * 应用每次 切出/卸载 会调用的方法，通常在这里我们会卸载微应用的应用实例
 */
export async function unmount(props) {
    ReactDOM.unmountComponentAtNode(getDomNode(props));
}

/**
 * 可选生命周期钩子，仅使用 loadMicroApp 方式加载微应用时生效
 */
export async function update(props) {
    console.log('update props', props);
}
```

### 公共资源加载优化

提高加载速度的能力

1. 公共资源cdn引入化，例如各种框架
2. 闲置资源预加载化

## 驱散副作用的能力

### JS沙箱

驱散掉子应用的全局变量副作用

1. 各种定时器
2. 各种事件

### CSS沙箱

应用间css存在冲突覆盖的副作用

## 总结

暂时能想到的就这么多，应该还有优化项，例如内部事件监听，但是才疏学浅暂未想到应用原理，只看到源码有写。
