<template>
  <div id="app">
    <CarLisingCalc />
  </div>
</template>

<script>
import CarLisingCalc from "./components/CarLisingCalc.vue";
export default {
  name: "App",

  components: {
    CarLisingCalc,
  },
};
</script>

<style lang="scss">
@import "./assets/scss/app.scss";
</style>
