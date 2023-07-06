const UglifyJsPlugin = require("uglifyjs-webpack-plugin");
const path = require("path");

function resolve(dir) {
  return path.join(__dirname, dir);
}

module.exports = {
  // 修改 src 为 examples
  pages: {
    index: {
      entry: "examples/main.js",
      template: "public/index.html",
      filename: "index.html",
    },
  },
  configureWebpack: {},
  devServer: { // 环境配置
    host: '0.0.0.0',
    // host: '192.168.123.109',
    port: '8080',
    useLocalIp: true, //将useLoackIp设置为true 就可以了
    https: false,
    disableHostCheck: true,
    open: false // 配置自动启动浏览器
  },
  publicPath: './',
  outputDir: 'webpage',
  runtimeCompiler: true,
  chainWebpack(config) {
    // 配置svg
    config.module
      .rule('svg')
      .exclude.add(resolve('packages/x6/icons'))
      .end()
    config.module
      .rule('icons')
      .test(/\.svg$/)
      .include.add(resolve('packages/x6/icons'))
      .end()
      .use('svg-sprite-loader')
      .loader('svg-sprite-loader')
      .options({
        symbolId: 'icon-[name]'
      })
      .end()
  },
  configureWebpack: (config) => {
    if (process.env.NODE_ENV === 'production') {
      // 压缩处理
      config.plugins.push(
        new UglifyJsPlugin({
          uglifyOptions: {
            warnings: false,
          },
          sourceMap: false,
          parallel: true, // 使用多进程并行运行来提高构建速度。默认并发运行数：os.cpus().length - 1。
        })
      );
    }
    config.module.rules.push({
      test: /\.mjs$/,
      include: /node_modules/,
      type: "javascript/auto"
    });
  }
};
