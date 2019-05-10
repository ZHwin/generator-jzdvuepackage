const path = require('path')
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer')
  .BundleAnalyzerPlugin
function resolve (dir) {
  return path.join(__dirname, './', dir)
}
const OptimizeCSSAssertsPlugin = require('optimize-css-assets-webpack-plugin')
const TerserPlugin = require('terser-webpack-plugin')
const CopyPlugin = require('copy-webpack-plugin')
// gzip压缩插件
const CompressionWebpackPlugin = require('compression-webpack-plugin')
const productionGzipExtensions = ['js', 'css']
module.exports = {
  publicPath: '/',
  baseUrl: undefined,
  outputDir: undefined,
  assetsDir: 'static',
  runtimeCompiler: undefined,
  parallel: undefined,
  // 不生成map
  productionSourceMap: process.env.NODE_ENV !== 'production',
  // 去掉文件名中的 hash
  filenameHashing: true,
  chainWebpack: config => {
    config.plugins.delete('preload')
    config.plugins.delete('prefetch')
    if (process.argv.indexOf('--report') !== -1) {
      config.plugin('webpack-report').use(BundleAnalyzerPlugin, [{}])
    }
    // 配置别名
    config.resolve.alias
      .set('@', resolve('src'))
      .set('@api', resolve('src/api'))
      .set('@assets', resolve('src/assets'))
      .set('@components', resolve('src/components'))
      .set('@icons', resolve('src/icons'))
      .set('@config', resolve('src/config'))
      .set('@utils', resolve('src/utils'))
      .set('@views', resolve('src/views'))
    // 配置svg
    const svgRule = config.module.rule('svg') // 找到svg-loader
    svgRule.uses.clear() // 清除已有的loader, 如果不这样做会添加在此loader之后
    svgRule.exclude.add(/node_modules/) // 正则匹配排除node_modules目录
    svgRule.exclude.add(resolve('src/assets/fonts/iconfont.svg'))
    svgRule // 添加svg新的loader处理
      .test(/\.svg$/)
      .use('svg-sprite-loader')
      .loader('svg-sprite-loader')
      .options({
        symbolId: 'icon-[name]'
      })
    const imagesRule = config.module.rule('images')
    imagesRule.exclude.add(resolve('src/icons'))
    config.module.rule('images').test(/\.(png|jpe?g|gif|svg)(\?.*)?$/)

    // 图片还可以进行压缩减少体积
    config.module
      .rule('image-webpack-loader')
      .test(/\.(gif|png|jpe?g|svg)$/i)
      .use('file-loader')
      .loader('image-webpack-loader')
      .tap(() => ({
        disable: process.env.NODE_ENV !== 'production'
      }))
      .end()
    config.module
      .rule('images')
      .use('url-loader')
      .loader('url-loader')
      .tap(options => Object.assign(options, { limit: 10240 }))
    // 打包成es5
    const jsRule = config.module.rule('js')
    jsRule.include.add(/node_modules/)
    jsRule.use('babel-loader').loader('babel-loader')
    config.optimization.splitChunks({
      chunks: 'all'
    })
  },

  configureWebpack: config => {
    // 配置cdn
    config.externals = {
      'ag-grid-enterprise': 'agGrid',
      'ag-grid-community': 'agGrid',
      echarts: 'echarts',
      'element-ui': 'ELEMENT',
      jquery: '$',
      axios: 'axios',
      vue: 'Vue',
      'vue-router': 'VueRouter',
      vuex: 'Vuex',
      alasql: 'alasql',
      ztree: 'zTree',
      'vue-seamless-scroll': 'VueSeamlessScroll'
    }
    // 复制模板文件
    config.plugins.push(
      new CopyPlugin([
        {
          from: path.join(__dirname, 'public/static/template'),
          to: path.join(__dirname, 'dist/static/template')
        }
      ])
    )
    // 生产环境打包
    if (process.env.NODE_ENV === 'production') {
      // 去除console
      config.plugins.push(
        new TerserPlugin({
          sourceMap: false,
          parallel: true,
          terserOptions: {
            output: {
              comments: false //  去掉注释
            },
            compress: {
              warnings: false,
              drop_debugger: true,
              drop_console: true,
              pure_funcs: ['console.log'] // 移除console
            }
          }
        })
      )
      // 压缩css
      config.plugins.push(
        // 压缩CSS
        new OptimizeCSSAssertsPlugin({})
      )
      // 服务器开启gzip
      config.plugins.push(
        new CompressionWebpackPlugin({
          algorithm: 'gzip',
          test: new RegExp('\\.(' + productionGzipExtensions.join('|') + ')$'),
          threshold: 10240,
          minRatio: 0.8
        })
      )

      return {
        optimization: {
          splitChunks: {
            cacheGroups: {
              libs: {
                name: 'chunk-libs', // 只打包初始时依赖的第三方
                test: /[\\/]node_modules[\\/]/,
                priority: 10,
                chunks: 'initial'
              },
              elementUI: {
                name: 'chunk-elementUI', // 单独将 elementUI 拆包
                priority: 20, // 权重要大于 libs 和 app 不然会被打包进 libs 或者 app
                test: /[\\/]node_modules[\\/]element-ui[\\/]/,
                chunks: 'all'
              }
            }
          },
          runtimeChunk: true
        }
      }
    }
  },

  css: {
    loaderOptions: {
      less: {
        javascriptEnabled: true
      },
      css: {}
    }
  },

  devServer: {
    host: 'localhost',
    port: 8000, // 端口号
    https: false, // https:{type:Boolean}
    open: true, // 配置自动启动浏览器
    hotOnly: true // 热更新
  },
  pluginOptions: {}
}
