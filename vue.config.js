module.exports = {
  css: {
    loaderOptions: {
      sass: {
        implementation: require("sass") // This line must in sass option
      }
    }
  },
  transpileDependencies: ["vuetify"],
  devServer: {
    proxy: {
      "^/api": {
        target: "http://localhost:9090/",
        pathRewrite: {
          "^/api": ""
        },
        changeOrigin: true,
        ws: true
      }
    }
  }
};
