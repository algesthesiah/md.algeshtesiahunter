> 如果你是一个大型仓库维护者，一定知道高效维护大型仓库里的子类库是一个头痛的问题，这篇文章就是初探此疑难杂症的开源的解决方案lerna

### 背景

>将大型代码库拆分为独立的独立版本包对于代码共享非常有用。然而，跨许多存储库进行更改是混乱的，很难跟踪，跨存储库进行测试会很快变得非常复杂。为了解决这些(以及许多其他)问题，一些项目将它们的代码库组织到多包存储库(有时称为单一存储库)中。像Babel、React、Angular、Ember、Meteor、Jest等项目都在一个单独的存储库中开发它们的所有包。
>Lerna是一个使用git和npm优化多包存储库管理工作流的工具。Lerna还可以减少开发和构建环境中大量副本包的时间和空间需求——这通常是将项目划分为许多单独的NPM包的缺点。
> 总结下最近在做有赞微前端迁移learn相关改进的一些奇闻异事，有时候有灵感就要记下来

### lerna的必要性

1. `lerna` 可以通过将依赖关系“提升”到最顶层的lerna项目级的node_modules目录，从而减少开发和构建环境中对大量包副本的时间和空间需求。
2. `lerna` 结合 `npm` 和 `git` 工作流，相当于在两者之上做了一层封装，变得更高效

### 依赖整合

当整个项目被划分为多个 `NPM包` 时，这种组织性的改进通常是有代价的: `各种包在它们的包中经常有许多重复的依赖关系` 。结果在各种 `node_modules` 目录中有数百或数千个重复的文件。`Lerna` 通过使管理由许多NPM包组成的项目变得 `更容易` 。

### 官方理念

yarn官方推荐的做法,用yarn来处理依赖问题，用lerna来处理发布问题。能用yarn做的就用yarn，lerna还没做到万能

### 使用介绍

#### 先安装下

``` bash
npm install lerna -g
```

#### 进入我们的代码仓库，创建相关lerna目录

``` bash
lerna init
```

明显 `lerna.json` 是 `lerna` 的配置文件，这里面主要属性就是 `packages` ，它是一个数组，每个元素代表可以发布的npm包的目录，如图中代表packages目录（初始化生成的）下所有的文件夹都是可以发版的npm包，另外也可以自定义npm包的目录。

一般lerna目录下可以存放各种依赖lib和入口entry，通过构建工具script tool将这些代码打包进packages目录中

#### workspaces模式

每个子 `package` 都有自己的 `node_modules` ，通过这样设置后，只有顶层有一个 `node_modules`，修改顶层 `package.json` and `lerna.json`

package.json

``` json
{
  "private": true,
  "workspaces": [
    "packages/*"
  ]
}
```

 lerna.json

 ``` json
{
  "packages": ["packages/*"],
  "useWorkspaces": true,
  "npmClient": "yarn",
  "version": "0.0.0"
}
```

#### 生成一个npm包

``` bash
lerna create <包名> [目录]
lerna create beauty-webpack
```

#### 为包添加依赖

功能类似于npm install 包名，scope指定为某个包添加依赖，如果没有scope选项，就会为packages下所有的包添加这个依赖；dev选项代表依赖添加进devDependencies中。

``` bash
lerna add 包名 [--scope=特定的某个包] [--dev]
lerna add webpack packages/beauty-webpack
```

#### 删除依赖

在有删除需求的时候发现`lerna`依赖命令不是很强大。

#### yarn 替代 lerna 处理依赖

其实 `lerna` 底层也是走的 `yarn` (配置中心注明`"npmClient": "yarn"`)

安装依赖分为三种场景：

1. 给某个package安装依赖：`yarn workspace packageB add packageA` 将packageA作为packageB的依赖进行安装
2. 给所有的package安装依赖: 使用​`yarn workspaces add lodash`​ 给所有的package安装依赖
3. 给root 安装依赖：一般的公用的开发工具都是安装在root里，如​typescript​,我们使用​`yarn add -W -D typescript​`来给root安装依赖

对应的删除命令如下：

``` bash
yarn workspace packageB remove packageA
yarn workspaces remove lodash
yarn remove -W -D typescript
```

#### 查看整个工程目录

``` bash
lerna list [-l]
```

#### 为每个包安装依赖

``` bash
lerna bootstrap
```

#### 删除包下面的node_modules

``` bash
lerna clean
```

上面的命令安装依赖会在每个包目录下生成node_modules，下面的命令就是将node_modules删除

#### 导入外部的包

我们用git下载到本地，然后用上面的命令导入到packages/plugins目录下，将已经存在的npm包代码库迁移到 lerna 仓库中。

``` bash
lerna import 外部包的位置 --dest=工程下的位置
```

#### 运行包的script命令

``` bash
lerna run 命令 [--scope=特定的某个包]
```

和npm run [命令] 没什么区别，如果没有scope选项，lerna会运行每个包的script命令

#### 版本升级及发包

项目测试完成后，就涉及到版本发布，版本发布一般涉及到如下一些步骤

#### version_bump

发版的时候需要更新版本号，这时候如何更新版本号就是个问题，一般大家都会遵循 semVer语义，如果版本之间的提交记录较少，能够较为容易的手动更新版本好，但这样也存在人为失误的可能，更好的办法是根据git的提交记录自动更新版本号，实际上只要我们的`git commit message`符合 `Conventional commit`规范，即可通过工具根据git提交记录，更新版本号，简单的规则如下

1. 存在feat提交： 需要更新minor版本
2. 存在fix提交： 需要更新major版本
3. 存在BREAKING CHANGE提交： 需要更新大版本

#### 常用的type类别

`type` ：用于表明我们这次提交的改动类型，是新增了功能？还是修改了测试代码？又或者是更新了文档？总结以下 11 种类型：

1. `build`：主要目的是修改项目构建系统(例如 `glup`，`webpack`，`rollup` 的配置等)的提交
2. `ci`：主要目的是修改项目继续集成流程(例如 `Travis`，`Jenkins`，`GitLab CI`，`Circle`等)的提交
3. `docs`：文档更新
4. `feat`：新增功能
5. `fix`：bug 修复
6. `perf`：性能优化
7. `refactor`：重构代码(既没有新增功能，也没有修复 bug)
8. `style`：不影响程序逻辑的代码修改(修改空白字符，补全缺失的分号等)
9. `test`：新增测试用例或是更新现有测试
10. `revert`：回滚某个更早之前的提交
11. `chore`：不属于以上类型的其他类型(日常事务)

#### 生成changelog

为了方便查看每个package每个版本解决了哪些功能，我们需要给每个package都生成一份changelog方便用户查看各个版本的功能变化。同理只要我们的commit记录符合 [conventional commit](https://www.conventionalcommits.org/en/v1.0.0/#summary)规范，即可通过工具为每个package生成changelog文件

#### 生成git tag

为了方便后续回滚问题及问题排查通常需要给每个版本创建一个git tag

#### git 发布版本

每次发版我们都需要单独生成一个commit记录来标记

#### 发布npm包

发布完git后我们还需要将更新的版本发布到npm上，以便外部用户使用
我们发现手动的执行这些操作是很麻烦的且及其容易出错，幸运的是lerna可以帮助我们解决这些问题

> yarn官方并不打算支持发布流程，只是想做好包管理工具，因此这部分还是需要通过lerna支持

lerna提供了publish和version来支持版本的升级和发布
publish的功能可以即包含version的工作，也可以单纯的只做发布操作。

#### lerna version

`lerna version`的作用是进行`version bump`,支持手动和自动两种模式
只发布某个package

不支持，lerna官方不支持仅发布某个package，如果需要，只能自己手动的进入package进行发布，这样lerna自带的各种功能就需要手动完成且可能和lerna的功能相互冲突

由于lerna会自动的监测git提交记录里是否包含指定package的文件修改记录，来确定版本更新，这要求设置好合理的ignore规则（否则会造成频繁的，无意义的某个版本更新），好处是其可以自动的帮助package之间更新版本

例如如果ui-form依赖了ui-button，如果ui-button发生了版本变动，会自动的将ui-form的对ui-button版本依赖更新为ui-button的最新版本。 如果ui-form发生了版本变动，对ui-button并不会造成影响。

#### 自动选择发布版本

使用`--conventional-commits` 参数会自动的根据`conventional commit`规范和`git commit message`记录帮忙确定更新的版本号。

``` bash
lerna version --conventional-commits
```

#### 手动选择发布版本

如果`git commit message`发现不太靠谱，且无法修改的话，那么需要手动的确认新版本，version默认是手动选择版本

``` bash
lerna version
```

version成功后会自动的推送到主分支
lerna version自动生成的提交格式为"publish xxx",并不符合`conventional-commit`规范，因此需要加以修改，我们通过message参数可以修改自动生成的提交记录

``` json
// lerna.json
{
  "packages": [
    "packages/*"
  ],
  "version": "independent",
  "npmClient": "yarn",
  "command": {
    "publish": {
      "ignoreChanges": ["*.md"],
      "verifyAccess": false,
      "verifyRegistry": false,
      "message":"chore: publish" // 自定义version生成的message记录
    }
  }
}
```

#### changelog.md

version完成后会自动生成`changelog.md`，但是由于lerna是根据什么规则来生成`changelog`的规则尚不清楚

#### 查看diff

``` bash
lerna diff
```

和git diff 基本没区别，会显示工程下所有的修改

#### lerna changed

``` bash
lerna changed
```

当你发布完成后再运行这个命令，红色区域就会显示No changed packages found。

#### 发布

``` bash
lerna publish [--dist-tag=tag名]
```
