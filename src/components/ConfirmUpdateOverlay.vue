<template>
  <v-overlay :value="overlay"> </v-overlay>
</template>

<script lang="ts">
export default {
  name: "ConfirmUpdateOverlay",
  props: ["overlay"],
  data: () => ({})
};
</script>

<style lang="scss" scoped></style>
