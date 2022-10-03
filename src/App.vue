<template>
  <div id="app">
    <CalculationCarLising />
  </div>
</template>

<script>
import CalculationCarLising from "./components/CalculationCarLising";
export default {
  name: "App",

  components: {
    CalculationCarLising,
  },
};
</script>

<style lang="scss">
@import "./assets/scss/app.scss";
</style>
