<template>
  <v-container>
    <SetupForm/>
    <DataTree/>
  </v-container>
</template>

<script>
import SetupForm from "@/components/SetupForm";
import DataTree from "@/views/DataTree";

export default {
  name: "Setup",
  components: {
    DataTree,
    SetupForm,
  },
};
</script>

