import Vue from "vue";
import Router from "vue-router";
import Meetings from "../components/Meetings.vue";

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: "/",
      name: "Meetings",
      component: Meetings
    },
    {
      path: "/:domain",
      name: "Meetings",
      component: Meetings,
      meta: {
        title: "Talk Time"
      }
    }
  ]
});
