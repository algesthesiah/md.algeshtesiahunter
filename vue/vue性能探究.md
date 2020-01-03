---
title: vue 性能探究
category: coding
tag: vue
des: 对此有强烈的好奇心
date: 2019/10/8
img: vue1.png
---

### 起因

偶然看了[这个文章](https://juejin.im/post/5bf7ca2f6fb9a049a9795a88#heading-3)因为个人也对性能喜欢探究，从头品了下这个文章，一头雾水，于是自己跟随自己想法写了它，想着测试下自己的代码性能。

### 测试

1234 是迅雷前端的代码，56 是我修改的递归组件和冻结递归组件的数据
数据量：this.getRandomData(3, 20) 3 层 每层 20 条

first rendering: 初次渲染时间
expanded change: 点击节点展开渲染时间（这里统一统计最外层数据）

|                 |     demo-5      |      demo-6      |   文章最强优化    |
| :-------------: | :-------------: | :--------------: | :---------------: |
| first rendering | 3.60107421875ms | 3.666748046875ms | 111.51904296875ms |
| expanded change | 5.94482421875ms | 5.020263671875ms | 48.31103515625ms  |

火焰图如下:

#### demo-5

![img](vue性能探究/5.png)

#### demo-6

![img](vue性能探究/6.png)

#### demo-x

![img](vue性能探究/x.png)

### 总结

用一个组件渲染，会导致任何一个改动都会 rerender。按照优化的第二点，任何的展开与关闭，其实还是要对比前后的 VDOM。节点数量更多的情况下，计算量还是相当可观的。应该拆成递归组件的形式，这样局部的更新不会重新计算整一个树组件，性能会有很大提升的。

最后[`源代码在这`](https://github.com/Algesthesiahunter/vuePerformanceExploration)
