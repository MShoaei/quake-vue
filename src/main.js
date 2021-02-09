import Vue from "vue";
import App from "./App.vue";
import store from "@/store";
import router from "@/router";
import shortkey from "./plugins/hotkey";
import vuetify from "./plugins/vuetify";

Vue.config.productionTip = false;

new Vue({
  store,
  router,
  shortkey,
  vuetify,
  render: (h) => h(App),
}).$mount("#app");
