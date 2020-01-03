---
title: 如何配置webpack4打包上传你的vue组件到npm
category: coding
tag: webpack
des: 写了个vue组件想打包上传到npm却又不知如何下手？
date: 2019/12/10
img: webpack4.png
---

#### 整体目录

```js
|-- src
  |-- add.vue
  |-- del.vue
  |-- index.js
  |-- index.scss
  |-- VueTreeView.vue
|-- .babelrc
|-- package.json
|-- webpack.config.js
```

##### add.vue

```html
<template functional>
  <svg
    :class="data.attrs['icon-class']"
    aria-hidden="true"
    v-on="listeners"
    t="1570597569245"
    class="icon"
    viewBox="0 0 1024 1024"
    version="1.1"
    xmlns="http://www.w3.org/2000/svg"
    p-id="1461"
    width="128"
    height="128"
  >
    <path
      d="M959.7 247.4v528.8c0.7 48.7-18.7 95.5-53.7 129.4-35.8 35.8-78.9 53.7-129.5 53.7H247.9c-50.3 0-93.5-17.9-129.4-53.7-35.1-33.9-54.5-80.7-53.7-129.4V247.4c0-50.3 17.9-93.5 53.7-129.4 33.8-35 80.6-54.5 129.3-53.7h528.9c50.3 0 93.5 17.9 129.4 53.7 35.7 35.8 53.6 79 53.6 129.4z m-81.3 528.8V247.4c0-28-10.1-52-29.8-71.9-18.8-19.4-44.8-30.2-71.8-29.8H247.9c-28 0-51.9 10.1-71.8 29.8-19.4 18.8-30.2 44.8-29.8 71.8v528.8c0 28 9.8 51.9 29.8 71.8 19.8 19.9 43.8 29.8 71.8 29.8h528.9c28 0 51.9-9.8 71.8-29.8 19.9-19.8 29.8-43.8 29.8-71.7z m-81.3-284.7V532c0.5 10.7-7.9 19.8-18.6 20.3H247.9c-10.7 0.4-19.8-7.9-20.2-18.7v-42.2c-0.5-10.7 7.9-19.8 18.6-20.3h530.5c6 0 10.8 1.9 14.5 5.7 3.9 3.9 6 9.2 5.8 14.7z m-264.4 305H492c-10.7 0.5-19.8-7.8-20.2-18.5V247.2c-0.4-10.7 7.9-19.8 18.7-20.2h42.1c10.7-0.4 19.8 7.9 20.2 18.7V776c0 6-1.9 10.9-5.7 14.6-3.7 4-9 6.1-14.4 5.9z"
      p-id="1462"
    />
  </svg>
</template>
```

##### del.vue

```html
<template functional>
  <svg
    :class="data.attrs['icon-class']"
    aria-hidden="true"
    v-on="listeners"
    t="1570597522703"
    class="icon"
    viewBox="0 0 1024 1024"
    version="1.1"
    xmlns="http://www.w3.org/2000/svg"
    p-id="1339"
    width="128"
    height="128"
  >
    <path
      d="M960.3 247.8v528.1c0.7 48.6-18.8 95.4-53.8 129.2-35.8 35.8-78.9 53.6-129.5 53.6H247.7c-50.3 0-93.5-17.9-129.5-53.6-35.1-33.8-54.5-80.6-53.8-129.2V247.8c0-50.3 17.9-93.4 53.8-129.2 33.9-35 80.8-54.4 129.5-53.6h529.4c50.4 0 93.6 17.9 129.5 53.6 35.8 35.8 53.7 79 53.7 129.2zM878.9 776V247.9c0-28-10.2-51.9-29.9-71.8-18.8-19.4-44.8-30.1-71.8-29.7H247.7c-28 0-51.9 10.1-71.8 29.8-19.4 18.7-30.3 44.7-29.9 71.7V776c0 27.9 9.9 51.8 29.9 71.7 19.9 19.9 43.8 29.7 71.8 29.7h529.4c28 0 52-9.8 71.9-29.8 19.9-19.8 29.9-43.7 29.9-71.6z m-81.5-284.4v40.5c0.5 10.7-7.9 19.8-18.6 20.3H247.7c-10.8 0.4-19.8-7.9-20.2-18.7v-42.1c-0.5-10.7 7.9-19.8 18.6-20.3h531c6 0 10.9 1.9 14.6 5.7 3.9 3.9 6 9.2 5.7 14.6z"
      p-id="1340"
    />
  </svg>
</template>
```

##### index.js

```js
import VueTreeView from './VueTreeView'

const install = Vue => {
  if (install.installed) {
    return
  }

  install.installed = true

  Vue.component(VueTreeView.name, VueTreeView)
}

VueTreeView.install = install

if (typeof window !== 'undefined' && window.Vue) {
  window.Vue.use(VueTreeView)
}

export default VueTreeView
```

##### index.scss

```scss
.tree-container {
  padding-top: 7px;
  .item {
    list-style: none;
    padding-left: 13px;
    padding-top: 18px;
    padding-bottom: 18px;
    position: relative;
    border-left: 1px solid #444b5d;
    &:before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      width: 13px;
      height: 1px;
      background-color: #444b5d;
    }
  }
  .item.end {
    border-left: 1px solid transparent;
    &:before {
      left: -1px;
      width: 14px;
    }
  }
  .item.first {
    &:after {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      width: 1px;
      height: 29px;
      background-color: #444b5d;
      transform: rotate(180deg);
      transform-origin: 0% 0%;
    }
  }
  .slot-icon {
    position: absolute;
    left: 19px;
    top: 0;
    transform: translateY(-50%);
    cursor: pointer;
    width: 14px;
    height: 14px;
  }
}
```

##### VueTreeView.vue

```html
<script>
  import iconAdd from './add'
  import iconDel from './del'

  export default {
    functional: true,
    name: 'VueTreeView',
    props: {
      data: {
        type: Array,
        required: true,
      },
    },
    render(h, c) {
      const iconClick = v => {
        v.expanded = !v.expanded
        const ob = v.__ob__
        ob.dep.notify()
      }
      const data = c.props.data
      const mySlot = c.scopedSlots && c.scopedSlots.treeView
      return (
        <div class="tree-container">
          {data.map((v, i) => (
            <li
              class={{
                item: true,
                end: i === data.length - 1,
                first: i === 0,
                change: !v.expanded,
              }}
              key={i}
            >
              {!v.expanded ? (
                <iconDel
                  key="iconDel"
                  icon-class="slot-icon"
                  onClick={() => iconClick(v)}
                />
              ) : (
                <iconAdd
                  key="iconAdd"
                  icon-class="slot-icon"
                  onClick={() => iconClick(v)}
                />
              )}
              {!v.expanded ? (
                <div class="slot-main">
                  {mySlot ? mySlot({ value: v }) : null}
                </div>
              ) : null}
            </li>
          ))}
        </div>
      )
    },
  }
</script>

<style lang="scss" scoped>
  @import './index.scss';
</style>
```

##### .babelrc

```json
{
  "presets": [["env", { "modules": false }], "stage-3"],
  "plugins": ["transform-vue-jsx"]
}
```

##### package.json

```json
{
  "name": "vue2-tree-view",
  "description": "A simple organization tree chart based on Vue2.x",
  "version": "1.0.14",
  "main": "dist/index.js",
  "module": "src/index.js",
  "author": "liulu <541877028@qq.com>",
  "license": "MIT",
  "scripts": {
    "build": "cross-env NODE_ENV=production webpack  --progress",
    "publish": "npm run build && npm publish"
  },
  "repository": {
    "type": "git",
    "url": "https://github.com/Algesthesiahunter/VueTreeView.git"
  },
  "dependencies": {},
  "devDependencies": {
    "autoprefixer": "^7.1.6",
    "babel-core": "^6.26.0",
    "babel-helper-vue-jsx-merge-props": "^2.0.3",
    "babel-loader": "^7.1.2",
    "babel-plugin-syntax-jsx": "^6.18.0",
    "babel-plugin-transform-vue-jsx": "^3.5.0",
    "babel-preset-env": "^1.6.0",
    "babel-preset-stage-3": "^6.24.1",
    "cross-env": "^5.0.5",
    "css-loader": "^3.2.1",
    "extract-text-webpack-plugin": "^3.0.2",
    "file-loader": "^1.1.4",
    "mini-css-extract-plugin": "^0.8.0",
    "node-sass": "^4.13.0",
    "optimize-css-assets-webpack-plugin": "^3.2.0",
    "postcss-loader": "^3.0.0",
    "sass-loader": "^8.0.0",
    "style-loader": "^1.0.1",
    "vue-loader": "^15.7.2",
    "vue-style-loader": "^4.1.2",
    "vue-template-compiler": "^2.6.10",
    "webpack": "^4.41.2",
    "webpack-cli": "^3.3.10"
  },
  "browserslist": ["> 1%", "last 2 versions"]
}
```

##### webpack.config.js

```js
const path = require('path')
const VueLoaderPlugin = require('vue-loader/lib/plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
module.exports = {
  entry: './src/index.js',
  mode: 'production',
  output: {
    path: path.resolve(__dirname, './dist'),
    publicPath: 'dist',
    filename: 'index.js',
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          MiniCssExtractPlugin.loader,
          'vue-style-loader',
          {
            loader: 'css-loader',
            options: { importLoaders: 1 },
          },
          'postcss-loader',
        ],
      },
      {
        test: /\.scss$/,
        use: [
          'vue-style-loader',
          'css-loader',
          {
            loader: 'sass-loader',
          },
        ],
      },
      {
        test: /\.vue$/,
        loader: 'vue-loader',
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: file => /node_modules/.test(file) && !/\.vue\.js/.test(file),
      },
    ],
  },
  resolve: {
    alias: {
      vue$: 'vue/dist/vue.esm.js',
    },
    extensions: ['*', '.js', '.vue', '.json'],
  },
  performance: {
    hints: false,
  },
  plugins: [
    // 请确保引入这个插件！
    new VueLoaderPlugin(),
    new MiniCssExtractPlugin({
      // Options similar to the same options in webpackOptions.output
      // all options are optional
      filename: '[name].css',
      chunkFilename: '[id].css',
      ignoreOrder: false, // Enable to remove warnings about conflicting order
    }),
  ],
}
```

#### 上传 npm

官网注册账号，`npm login` `npm publish`

#### 项目引用

```bash
npm i vue2-tree-view -S
```

```js
import VueTreeView from 'vue2-tree-view'
Vue.use(VueTreeView)
```

话不多说直接用! [`源码地址`](https://github.com/Algesthesiahunter/VueTreeView)
