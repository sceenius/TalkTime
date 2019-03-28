<template>
  <router-view/>
</template>

<script>
import Meetings from "./components/Meetings.vue";

export default {
  name: "App",
  components: {
    Meetings
  }
};
</script>

<style>
@import "https://fonts.googleapis.com/css?family=Roboto:400,500,700,400italic|Material+Icons";
@import "https://cdnjs.cloudflare.com/ajax/libs/animate.css/3.7.0/animate.min.css";

#app {
  font-family: "Roboto", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style>
