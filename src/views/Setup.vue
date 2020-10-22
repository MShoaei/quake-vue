<template>
  <v-container>
    <SetupForm />
    <v-row>
      <v-col cols="12">
        <v-card class="mt-5">
          <v-card-title class="primary white--text headline">
            User Directory
          </v-card-title>
          <v-treeview
            v-if="items[0].children.length > 0"
            transition
            :items="items"
            :load-children="fetchDir"
            activatable
            color="warning"
            open-on-click
            :open.sync="open"
          ></v-treeview>
          <v-card-text v-else>No sample available</v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import SetupForm from "@/components/SetupForm";
import axios from "@/plugins/axios";

const pause = ms => new Promise(resolve => setTimeout(resolve, ms));

export default {
  name: "Setup",
  components: {
    SetupForm
  },
  mounted() {
    axios
      .get("/tree")
      .then(resp => {
        for (const item of resp.data.items) {
          this.currentID++;
          if (item.dir) {
            this.items[0].children.push({
              id: this.currentID.toString(),
              dirPath: resp.data.directory + item.name,
              name: item.name,
              children: []
            });
          } else {
            this.items[0].children.push({
              id: this.currentID.toString(),
              name: item.name
            });
          }
        }
      })
      .catch();
  },
  computed: {
    items() {
      return [
        {
          id: "0",
          name: "/",
          children: this.treeData
        }
      ];
    }
  },
  data: () => ({
    currentID: 0,
    open: [],
    treeData: []
  }),
  methods: {
    async fetchDir(item) {
      await pause(1500);

      return axios
        .get("/tree" + item.dirPath)
        .then(resp => {
          for (const respItem of resp.data.items) {
            this.currentID++;
            if (respItem.dir) {
              item.children.push({
                id: this.currentID.toString(),
                dirPath: resp.data.directory + respItem.name,
                name: respItem.name,
                children: []
              });
            } else {
              item.children.push({
                id: this.currentID.toString(),
                name: respItem.name
              });
            }
          }
        })
        .catch();
    }
  }
};
</script>

<style scoped></style>
