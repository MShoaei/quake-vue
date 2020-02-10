<template>
  <v-overlay :value="overlay"> </v-overlay>
</template>

<script lang="ts">
import Vue from "vue";
export default Vue.extend({
  name: "ConfirmUpdateOverlay",
  props: ["overlay"],
  data() {}
});
</script>

<style lang="scss" scoped></style>
