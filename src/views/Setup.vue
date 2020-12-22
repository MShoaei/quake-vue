<template>
  <v-container>
    <SetupForm />
    <v-row>
      <v-col cols="8">
        <v-card class="mt-5">
          <v-card-title class="primary white--text headline">
            Data Directory
          </v-card-title>
          <v-treeview
            v-if="items[0].children.length > 0"
            transition
            :items="items"
            :load-children="fetchDir"
            activatable
            dense
            color="red"
            return-object
            open-all
            :open.sync="open"
            :active.sync="selected"
          ></v-treeview>
          <v-card-text v-else>No sample available</v-card-text>
        </v-card>
      </v-col>
      <v-col>
        <v-row v-if="selected.length > 0">
          <v-col cols="4" v-if="selected[0].children === undefined">
            <v-btn
              color="primary"
              dark
              @click.prevent="
                getDefaultWindow();
                dialogAverageWindow = true;
              "
              >Show Plot</v-btn
            >
            <v-dialog
              v-model="dialogAverageWindow"
              persistent
              max-width="600px"
            >
              <v-card>
                <v-card-title class="headline"
                  >Select Averaging Window</v-card-title
                >
                <v-card-text>
                  <v-row>
                    <v-col cols="3">
                      <v-subheader>Averaging window</v-subheader>
                    </v-col>
                    <v-col cols="2">
                      <v-text-field
                        :rules="[rules.inRange]"
                        v-model.number="window"
                      >
                      </v-text-field>
                    </v-col>
                  </v-row>
                </v-card-text>
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn text @click="dialogAverageWindow = false"
                    >Cancel</v-btn
                  >
                  <v-btn color="success" text @click="showPlot">
                    OK
                  </v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>
          </v-col>
          <v-col cols="4">
            <v-dialog v-model="dialogEdit" persistent max-width="600px">
              <template v-slot:activator="{ on, attrs }">
                <v-btn color="primary" dark v-bind="attrs" v-on="on"
                  >Edit</v-btn
                >
              </template>
              <v-card>
                <v-card-title>
                  <span class="headline">Edit Name</span>
                </v-card-title>
                <v-card-text>
                  <v-container>
                    <v-row>
                      <v-col cols="12" sm="6" md="4">
                        <v-text-field
                          label="Current Name"
                          v-model="selected[0].name"
                          disabled
                          readonly
                        ></v-text-field>
                      </v-col>
                    </v-row>
                    <v-row>
                      <v-col cols="12" sm="6" md="4">
                        <v-text-field
                          label="New Name*"
                          v-model="newName"
                          required
                        ></v-text-field>
                      </v-col>
                    </v-row>
                  </v-container>
                  <small>*indicates required field</small>
                </v-card-text>
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn color="red darken-1" text @click="dialogEdit = false">
                    Cancel
                  </v-btn>
                  <v-btn color="green darken-1" text @click="editName">
                    Change
                  </v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>
          </v-col>
          <v-col cols="4">
            <v-dialog v-model="dialogDelete" persistent max-width="600px">
              <template v-slot:activator="{ on, attrs }">
                <v-btn color="red" dark v-bind="attrs" v-on="on">
                  Delete
                </v-btn>
              </template>
              <v-card>
                <v-card-title class="headline"> Confirm Deletion </v-card-title>
                <v-card-text
                  >You are deleting a project/file. Are you sure? This action is
                  NOT reversable.</v-card-text
                >
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn text @click="dialogDelete = false"> Cancel </v-btn>
                  <v-btn color="red darken-1" text @click="deleteFileOrFolder">
                    Delete
                  </v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>
          </v-col>
          <v-bottom-sheet v-model="sheet" hide-overlay inset>
            <v-sheet
              class="text-center d-flex justify-center align-center"
              height="100px"
            >
              <v-icon v-if="exportResponse.success" color="green" large
                >mdi-check-circle</v-icon
              >
              <v-icon v-else color="red" large>mdi-information</v-icon
              >{{ exportResponse.message }}</v-sheet
            >
          </v-bottom-sheet>
        </v-row>
        <v-row v-if="selected.length > 0">
          <v-col cols="4">
            <v-btn color="primary" dark @click="exportToUSB">Export</v-btn>
          </v-col>
          <v-col>
            <v-checkbox
              v-model="force"
              label="force overwrite files"
            ></v-checkbox>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import axios from "@/plugins/axios";
import PlotStream from "@/views/PlotStream";
import router from "@/router";
import SetupForm from "@/components/SetupForm";

function deleteTreeItem(root, path) {
  for (let i = 0; i < root.children.length; i++) {
    if (root.children[i].path === path) {
      root.children.splice(i, 1);
      return true;
    }
  }
  for (let i = 0; i < root.children.length; i++) {
    if (deleteTreeItem(root.children[i], path)) {
      return true;
    }
  }
}

export default {
  name: "Setup",
  components: {
    SetupForm,
  },
  mounted() {
    axios
      .get("/api/tree/")
      .then((resp) => {
        for (const item of resp.data.items) {
          this.currentID++;
          if (item.dir) {
            this.items[0].children.push({
              id: this.currentID.toString(),
              path: resp.data.directory + item.name,
              name: item.name,
              children: [],
            });
          } else {
            this.items[0].children.push({
              id: this.currentID.toString(),
              path: resp.data.directory + item.name,
              name: item.name,
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
          children: this.treeData,
        },
      ];
    },
    plotPath() {
      return "/plot?file=" + this.selected[0].path;
    },
  },
  data: () => ({
    window: 1,
    dialogAverageWindow: false,
    dialogEdit: false,
    dialogDelete: false,
    exportResponse: {
      success: false,
      message: "",
    },
    force: false,
    sheet: false,
    newName: "",
    currentID: 0,
    open: [],
    treeData: [],
    selected: [],
    rules: {
      inRange: (value) => value > 0 && value < 101,
    },
  }),
  methods: {
    async fetchDir(item) {
      return axios
        .get("/api/tree" + item.path)
        .then((resp) => {
          for (const respItem of resp.data.items) {
            this.currentID++;
            if (respItem.dir) {
              item.children.push({
                id: this.currentID.toString(),
                path: resp.data.directory + "/" + respItem.name,
                name: respItem.name,
                children: [],
              });
            } else {
              item.children.push({
                id: this.currentID.toString(),
                path: resp.data.directory + "/" + respItem.name,
                name: respItem.name,
              });
            }
          }
        })
        .catch();
    },
    getDefaultWindow() {
      axios.post("/api/plot", { file: this.selected[0].path }).then((resp) => {
        this.window = resp.data.window;
      });
    },
    exportToUSB() {
      let apiPath = "";
      let form = {};
      if (this.selected[0].children === undefined) {
        apiPath = "/api/save/sample";
        form["file"] = this.selected[0].path;
      } else {
        apiPath = "/api/save/project";
        form["project"] = this.selected[0].path;
      }

      if (this.force) {
        apiPath = apiPath + "?force=true";
      }
      axios
        .post(apiPath, form)
        .then(() => {
          this.exportResponse.success = true;
          this.exportResponse.message = "Successfully saved data to USB";
        })
        .catch((error) => {
          this.exportResponse.success = false;
          this.exportResponse.message = error.response.data.err;
        })
        .then(() => {
          this.sheet = true;
        });
    },
    showPlot() {
      router.push({
        path: "/plot",
        component: PlotStream,
        query: {
          file: this.selected[0].path,
        },
      });
    },
    editName() {
      axios
        .patch("/api/tree" + this.selected[0].path, {
          newName: this.newName,
        })
        .then(() => {
          this.selected[0].name = this.newName;
          let parts = this.selected[0].path.split("/");
          parts[parts.length - 1] = this.newName;
          this.selected[0].path = parts.join("/");
        })
        .catch();
      this.dialogEdit = false;
    },
    deleteFileOrFolder() {
      axios
        .delete("/api/tree" + this.selected[0].path)
        .then(() => {
          deleteTreeItem(this.items[0], this.selected[0].path);
        })
        .catch();
      this.dialogDelete = false;
    },
  },
};
</script>

<style scoped></style>
