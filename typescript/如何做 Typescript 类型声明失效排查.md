> 最近在改一个项目的时候，右下角每次都要弹窗大文件报警，然后我的自定义 scss 声明也失效爆红，挺有意思的记录下

### 问题复现

打开项目，右下角弹出"若要启用项目范围内的 JavaScript/TypeScript 语言功能，请排除包含不需要处理的源文件的大型文件夹。"，然后这里卖炸弹了，我没有理会，先去做自己业务改代码了，进入某 `tsx` 文件，发现自己的，头部引用也爆红了，找不到 `index.scss` 的类型声明，源码如下

``` js
import Scss from './index.scss'
```

这乍一看不就是 `ts` `scss` 类型声明没做嘛，于是我进一步查看下面这个类型声明是早就有的

``` js
declare module '*.scss'
```

这就很奇怪了呀，于是我谷歌了下 <https://github.com/Microsoft/vscode/issues/31188>，发现了个挺有意思的排查这类问题方法，记录下

### 问题排查

1. `vscode` 编辑器配置 `"typescript.tsserver.log": "verbose"` 打开 `ts` 日志
2. 重启 `vscode`
3. 在 `vscode` 中 使用 `F1` 键打开命令面板输入 `TypeScript: Open TSServer log`
4. 打开 `tsserver.log` 排查问题
5. 定位到 `Info 273  [15:38:17.988] Skipped loading contents of large file ***`

### 解决问题

原来是这个之前同事写的一个 `sdk` 太大没配 ts 过滤，去配了 排除就好了，然后 `scss` 类型告警也修复了，欲哭无泪 55
