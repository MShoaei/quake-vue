<template>
  <v-container>
    <SetupForm/>
    <DataTree/>
  </v-container>
</template>

<script>
import SetupForm from "@/components/SetupForm";
import DataTree from "@/components/DataTree";

export default {
  name: "Setup",
  components: {
    DataTree,
    SetupForm,
  },
  beforeCreate() {
    this.$store.dispatch("refreshProjects");
  }
};
</script>
