import Vue from "vue";
import Router from "vue-router";
import Meetings from "../components/Meetings.vue";

Vue.use(Router);

export default new Router({
  mode: "history",
  routes: [
    {
      path: "/",
      name: "Meetings",
      component: Meetings,
      meta: {
        title: "TalkTime"
      }
    },
    {
      path: "/:domain",
      name: "Meetings",
      component: Meetings,
      meta: {
        title: "TalkTime"
      }
    }
  ]
});
