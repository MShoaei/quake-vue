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
    proxy: "http://localhost/"
  }
};
