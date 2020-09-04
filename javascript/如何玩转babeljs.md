> 大部分前端工程师都比较眼熟babel，但是如何运用玩转babel还是需要下一番功夫的

# 什么是babel

`Babel` 是一个工具链，主要用于将 `ECMAScript 2015+` 版本的代码转换为向后兼容的 `JavaScript` 语法，以便能够运行在当前和旧版本的浏览器或其他环境中。下面列出的是 `Babel` 能为你做的事情：

1. 语法转换
2. 通过 `Polyfill` 方式在目标环境中添加缺失的特性
3. 源码转换（codemods）
4. 和更多！

``` js
// Babel Input: ES2015 arrow function
[1, 2, 3].map((n) => n + 1);

// Babel Output: ES5 equivalent
[1, 2, 3].map(function(n) {
  return n + 1;
});

Babel 是一个编译器（输入源码 => 输出编译后的代码）。就像其他编译器一样，编译过程分为三个阶段：解析、转换和打印输出。

现在，Babel 虽然开箱即用，但是什么动作都不做。它基本上类似于 const babel = code => code; ，将代码解析之后再输出同样的代码。如果想要 Babel 做一些实际的工作，就需要为其添加插件。

除了一个一个的添加插件，你还可以以 preset 的形式启用一组插件。
```

## 官方Presets

preset 是 Babel 官方给予的插件的组合，甚至可以作为可以共享的 options 配置。

### @babel/preset-env

是一个智能预设，可让您使用最新的JavaScript，而无需微观管理目标环境所需的语法转换（以及可选的浏览器polyfill）。这都使您的生活更轻松，JavaScript包更小！
babel-preset-env利用 `browserslist` ， `compat-table` 和 `electron-to-chromium` 这些数据源来维护哪些版本的受支持目标环境获得了JavaScript语法或浏览器功能的支持，以及这些语法和功能到 `Babel Transformation`插件和`core-js` `polyfills`的映射。

### @babel/preset-flow

### @babel/preset-react

### @babel/preset-typescript

## Stage-X （实验性质的 Presets）

1. Stage 0 - 设想（Strawman）：只是一个想法，可能有 Babel插件。
2. Stage 1 - 建议（Proposal）：这是值得跟进的。
3. Stage 2 - 草案（Draft）：初始规范。
4. Stage 3 - 候选（Candidate）：完成规范并在浏览器上初步实现。
5. Stage 4 - 完成（Finished）：将添加到下一个年度版本发布中。

# 如果是你来构建我们项目的babel配置要如何构建
