<template>
  <v-overlay :value="overlay"> </v-overlay>
</template>

<script>
import Vue from "vue";
export default Vue.extend({
  name: "ConfirmUpdateOverlay",
  props: ["overlay"],
  data() {
    return {};
  }
});
</script>

<style lang="scss" scoped></style>
