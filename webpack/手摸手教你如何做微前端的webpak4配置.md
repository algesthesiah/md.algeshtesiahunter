> 把公司单页应用webpack3升级到了微前端标准应用webpack4，顺手出个教程岂不美哉

# 主要优化项

## thread-loader

把这个 loader 放置在其他 loader 之前， 放置在这个 loader 之后的 loader 就会在一个单独的 worker【worker pool】 池里运行，一个worker 就是一个nodeJS 进程【node.js proces】，每个单独进程处理时间上限为600ms，各个进程的数据交换也会限制在这个时间内。
`thread-loader` 使用起来也非常简单，只要把 `thread-loader` 放置在其他 loader 之前， 那 `thread-loader` 之后的 loader 就会在一个单独的 worker 池(worker pool)中运行。
`推荐只对耗时多的loader配置此loader`

``` js
  {
  test: /\.(js?|tsx?|ts?)$/,
  include: [
      path.resolve(rootPath, './src'),
      path.resolve(rootPath, './shared'),
      path.resolve(rootPath, './node_modules/@youzan/mei-components/src'),
  ],
  use: devMode
      ? [
            'cache-loader',
            'thread-loader',
            {
                loader: 'babel-loader',
                options: {
                    presets: babelConfig.presets,
                    plugins: babelConfig.plugins,
                },
            },
        ]
      : [
            'thread-loader',
            {
                loader: 'babel-loader',
                options: {
                    presets: babelConfig.presets,
                    plugins: babelConfig.plugins,
                },
            },
        ],
  }
```

官方上说每个 worker 大概都要花费 600ms ，所以官方为了防止启动 worker 时的高延迟，提供了对 worker 池的优化：预热

``` js

const threadLoader = require('thread-loader');
threadLoader.warmup({}, ['babel-loader']);

```

## 压缩js

### terser-webpack-plugin

官方推荐插件，一个用于 ES6+ 的 JavaScript 解析器、mangler/compressor（压缩器）工具包。

``` js

minimizer: [
            new TerserPlugin({
                sourceMap: true,
                parallel: true,
                extractComments: false,
                terserOptions: {
                    compress: {
                        drop_console: true,
                    },
                },
            }),
            new OptimizeCSSAssetsPlugin(),
        ]

```

## css优化项

### css开发环境生产环境区分

开发环境style-loader比MiniCssExtractPlugin更快

```
{
                    test: /\.(sa|sc|c)ss$/,
                    include: [
                        path.resolve(rootPath, './src'),
                        path.resolve(rootPath, './shared'),
                        path.resolve(rootPath, './node_modules/@youzan'),
                        path.resolve(rootPath, './node_modules/zent'),
                        path.resolve(rootPath, './node_modules/@zent/compat'),
                        path.resolve(rootPath, './node_modules/cropperjs'),
                        /node_modules\/zan*/,
                    ],
                    use: [
                        devMode ? 'style-loader' : MiniCssExtractPlugin.loader,
                        {
                            loader: 'css-loader',
                            options: {
                                esModule: true,
                                modules: {
                                    compileType: 'module',
                                    mode: 'global',
                                    localIdentName: '[path][name]__[local]',
                                },
                                importLoaders: 1,
                            },
                        },
                        {
                            loader: 'postcss-loader',
                            options: {
                                config: {
                                    path: path.resolve(__dirname, '../'),
                                },
                            },
                        },
                        {
                            loader: 'sass-loader',
                            options: {
                                sassOptions: {
                                    includePaths: [path.join(rootPath, './shared/src/assets/style/sass')],
                                },
                            },
                        },
                    ],
                },
```

### css压缩

#### optimize-css-assets-webpack-plugin

``` js
 minimizer: [
                new TerserPlugin({
                    sourceMap: true,
                    parallel: true,
                    extractComments: false,
                    terserOptions: {
                        compress: {
                            drop_console: true,
                        },
                    },
                }),
                new OptimizeCSSAssetsPlugin(),
            ]
```

## 缓存

### cache

缓存生成的webpack模块和块以提高构建速度，webpack级别缓存

``` js
module.exports = {
  //...
  cache: false
};
```

### cache-loader

loader级别缓存

``` js
  {
    test: /\.(js?|tsx?|ts?)$/,
    include: [
        path.resolve(rootPath, './src'),
        path.resolve(rootPath, './shared'),
        path.resolve(rootPath, './node_modules/@youzan/mei-components/src'),
    ],
    use: devMode
        ? [
              'cache-loader',
              'thread-loader',
              {
                  loader: 'babel-loader',
                  options: {
                      presets: babelConfig.presets,
                      plugins: babelConfig.plugins,
                  },
              },
          ]
        : [
              'thread-loader',
              {
                  loader: 'babel-loader',
                  options: {
                      presets: babelConfig.presets,
                      plugins: babelConfig.plugins,
                  },
              },
          ],
  }
```

## 其他优化项

### ProvidePlugin

这样不用每次再引入react

``` js
new webpack.ProvidePlugin({
                React: 'react',
                PropTypes: 'prop-types',
            }),
```

### HotModuleReplacementPlugin

dev模式下启动热替换

### 分块打包

微前端和分块打包有冲突，使用了splitChunks，webpack的jsonp索引找不到，不知道为什么就注释掉了

``` js
 splitChunks: {
                chunks: 'all',
                minSize: 0,
                minChunks: 1,
                maxAsyncRequests: 100,
                maxInitialRequests: 100,
                automaticNameDelimiter: '~',
                name: true,
                cacheGroups: {
                    vendors: {
                        name: 'vendors',
                        minChunks: 1,
                        test: /[\\/]node_modules[\\/]/,
                        priority: -10,
                        minSize: 0,
                    },
                    default: {
                        test: /[\\/]components[\\/]|[\\/]common[\\/]/,
                        priority: -20,
                        name(module, chunks, cacheGroupKey) {
                            const moduleFileName = module
                                .identifier()
                                .split('/')
                                .reduceRight(item => item);
                            const allChunksNames = chunks.map(item => item.name).join('~');
                            return `${cacheGroupKey}-${allChunksNames}-${moduleFileName}`;
                        },
                    },
                },
            },
```

# 源码地址仓库

[微前端webpack4配置源码](https://github.com/Algesthesiahunter/beauty-webpack)
