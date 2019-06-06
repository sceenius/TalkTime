import Vue from "vue";
import App from "./App.vue";
import VueMaterial from "vue-material";
import VueCookies from "vue-cookies";
import VueLongPress from "vue-long-press-directive";
import Vue2TouchEvents from "vue2-touch-events";
import AsyncComputed from "vue-async-computed";
import "vue-material/dist/vue-material.min.css";
import "vue-material/dist/theme/default.css";

//import db from "./firebase/init";
import router from "./router";

Vue.config.productionTip = false;

Vue.use(AsyncComputed);
Vue.use(VueMaterial);
Vue.use(VueCookies);
Vue.use(VueLongPress, { duration: 1000 }); // works only once
Vue.use(Vue2TouchEvents, {
  disableClick: false,
  touchClass: "tapAction",
  tapTolerance: 8,
  longTapTimeInterval: 1000
});

new Vue({
  render: h => h(App),
  router
}).$mount("#app");
