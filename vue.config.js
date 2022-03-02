const { modifyVars } = require('./src/antD/style')

module.exports = {
  css: {
    loaderOptions: {
      less: {
        lessOptions: {
          modifyVars,
          javascriptEnabled: true
        }
      }
    }
  },
  chainWebpack: config => {
    config.plugin('html').tap(args => {
      args[0].title = '网易云音乐'
      return args
    })
  }
}
