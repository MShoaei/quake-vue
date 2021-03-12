<template>
  <v-container>
    <SetupForm :projectName="activePath" />
    <DataTree :projectName="activePath" @changed="activePathChanged" />
  </v-container>
</template>

<script>
import SetupForm from "@/components/SetupForm";
import DataTree from "@/components/DataTree";
import axios from "@/plugins/axios";

export default {
  name: "Setup",
  components: {
    DataTree,
    SetupForm,
  },
  data: () => ({
    activePath: "",
  }),
  beforeCreate: function() {
    axios.get("/api/project/active").then((resp) => {
      this.activePath = resp.data.path;
    });
  },
  methods: {
    activePathChanged: function(path) {
      this.activePath = path;
    },
  },
};
</script>
