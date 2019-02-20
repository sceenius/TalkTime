<template>
  <Meetings />
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
#app {
  @import "https://fonts.googleapis.com/css?family=Roboto:400,500,700,400italic|Material+Icons";

  font-family: "Roboto", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style>
