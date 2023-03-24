const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  lintOnSave: false,
  pluginOptions: {
    electronBuilder: {
      nodeIntegration: true,
      customFileProtocol: "./"
    }
  },
  devServer: {
    port: 8080,
    open: false,
    proxy: {
      '^/api': {
        target: `http://150.158.84.153/`,
        changeOrigin: true,
        secure: true,
        pathRewrite: {
          '^/api': "",
        },
      },
    },
  },
})
