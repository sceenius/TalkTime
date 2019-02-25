import Vue from "vue";
import App from "./src/App.vue";
import VueMaterial from "vue-material";
import "vue-material/dist/vue-material.min.css";
import "vue-material/dist/theme/default.css";
import db from "./src/firebase/init";

Vue.config.productionTip = false;

Vue.use(VueMaterial);

new Vue({
  render: h => h(App)
}).$mount("#app");
