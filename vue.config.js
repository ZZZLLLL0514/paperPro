const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  lintOnSave: false,
  devServer: {
    proxy: {
      '/poi': {//请求路径（项目中get请求的路径,使用代理后只写路径不用写域名）
        target: "http://127.0.0.1:3005",
        changeOrigin: true,
        pathRewrite: {

        }
      },
      '/ws/geocoder': {//请求路径（项目中get请求的路径,使用代理后只写路径不用写域名）
      target: "https://apis.map.qq.com",
      changeOrigin: true,
      pathRewrite: {
        // '^/ajaxserver/aja':'/ajaxserver/aja'//将请求路径/ajaxserver替换成/ajaxserver/aja,也就是最后vue请求的是http://127.0.0.1:3005/ajaxserver/aja
      }
    }
    },

  }
})
