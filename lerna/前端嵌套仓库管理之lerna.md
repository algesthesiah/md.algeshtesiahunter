> 如果你是一个大型仓库维护者，一定知道高效维护大型仓库里的子类库是一个头痛的问题，这篇文章就是初探此疑难杂症的开源的解决方案lerna

### 背景

>将大型代码库拆分为独立的独立版本包对于代码共享非常有用。然而，跨许多存储库进行更改是混乱的，很难跟踪，跨存储库进行测试会很快变得非常复杂。为了解决这些(以及许多其他)问题，一些项目将它们的代码库组织到多包存储库(有时称为单一存储库)中。像Babel、React、Angular、Ember、Meteor、Jest等项目都在一个单独的存储库中开发它们的所有包。
>Lerna是一个使用git和npm优化多包存储库管理工作流的工具。Lerna还可以减少开发和构建环境中大量副本包的时间和空间需求——这通常是将项目划分为许多单独的NPM包的缺点。
> 总结下最近在做有赞微前端迁移learn相关改进的一些奇闻异事，有时候有灵感就要记下来

### lerna的必要性

1. `lerna` 可以通过将依赖关系“提升”到最顶层的lerna项目级的node_modules目录，从而减少开发和构建环境中对大量包副本的时间和空间需求。
2. `lerna` 结合 `npm` 和 `git` 工作流，相当于在两者之上做了一层封装，变得更高效

### 依赖整合

当整个项目被划分为多个 `NPM包` 时，这种组织性的改进通常是有代价的: `各种包在它们的包中经常有许多重复的依赖关系` 。结果在各种 `node_modules` 目录中有数百或数千个重复的文件。`Lerna` 通过使管理由许多NPM包组成的项目变得 `更容易` ，可能会无意中加剧这个问题。

### 使用介绍

#### 先安装下

``` js
npm install lerna -g
```

#### 进入我们的代码仓库，创建相关lerna目录

``` js
lerna init
```

明显 `lerna.json` 是 `lerna` 的配置文件，这里面主要属性就是 `packages` ，它是一个数组，每个元素代表可以发布的npm包的目录，如图中代表packages目录（初始化生成的）下所有的文件夹都是可以发版的npm包，另外也可以自定义npm包的目录。

一般lerna目录下可以存放各种依赖lib和入口entry，通过构建工具script tool将这些代码打包进packages目录中

#### workspaces模式

每个子 `package` 都有自己的 `node_modules` ，通过这样设置后，只有顶层有一个 `node_modules`，修改顶层 `package.json` and `lerna.json`

``` js
# package.json
 "private": true,
  "workspaces": [
    "packages/*"
  ],

# lerna.json
  "packages": ["packages/*"],
  "useWorkspaces": true,
  "npmClient": "yarn",
  "version": "0.0.0"
```

#### 生成一个npm包

``` js
lerna create <包名> [目录]
lerna create beauty-webpack
```

#### 为包添加依赖

功能类似于npm install 包名，scope指定为某个包添加依赖，如果没有scope选项，就会为packages下所有的包添加这个依赖；dev选项代表依赖添加进devDependencies中。

``` js
lerna add 包名 [--scope=特定的某个包] [--dev]
lerna add webpack packages/beauty-webpack
```

#### 查看整个工程目录

``` js
lerna list [-l]
```

#### 为每个包安装依赖

``` js
lerna bootstrap
```

#### 删除包下面的node_modules

``` js
上面的命令安装依赖会在每个包目录下生成node_modules，下面的命令就是将node_modules删除
```

#### 导入外部的包

我们用git下载到本地，然后用上面的命令导入到packages/plugins目录下，将已经存在的npm包代码库迁移到 lerna 仓库中。

``` js
lerna import 外部包的位置 --dest=工程下的位置
```

#### 运行包的script命令

``` js
lerna run 命令 [--scope=特定的某个包]
```

和npm run [命令] 没什么区别，如果没有scope选项，lerna会运行每个包的script命令

#### 查看diff

``` js
lerna diff
```

和git diff 基本没区别，会显示工程下所有的修改

#### lerna changed

当你发布完成后再运行这个命令，红色区域就会显示No changed packages found。

#### 发布

``` js
lerna publish [--dist-tag=tag名]
```
