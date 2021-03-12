<template>
  <v-row>
    <v-col cols="12" md="8">
      <v-dialog v-model="project.newProjectDialog" max-width="600px">
        <v-card>
          <v-card-title class="headline">
            Create new project
          </v-card-title>
          <v-card-text>
            <v-form>
              <v-container>
                <v-row>
                  <v-col cols="12" md="4">
                    <v-text-field
                      v-model="project.projectName"
                      label="Project Name"
                      required
                    ></v-text-field>
                  </v-col>
                </v-row>
              </v-container>
            </v-form>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn text @click="project.newProjectDialog = false">
              Cancel
            </v-btn>
            <v-btn color="green darken-1" text @click.prevent="createProject()">
              Create
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <v-dialog v-model="project.openProjectDialog" max-width="600px">
        <v-card>
          <v-card-title class="headline">
            Open Project
          </v-card-title>
          <v-card-text>
            <v-list shaped>
              <v-list-item-group
                v-model="project.newState"
                multiple
                color="indigo"
              >
                <v-list-item
                  v-for="(item, i) in allProjects"
                  :value="item"
                  :key="i"
                >
                  <template v-slot:default="{ active }">
                    <v-list-item-content>
                      <v-list-item-title v-text="item.name"></v-list-item-title>
                    </v-list-item-content>

                    <v-list-item-action>
                      <v-checkbox
                        :input-value="active"
                        color="deep-purple accent-4"
                      ></v-checkbox>
                    </v-list-item-action>
                  </template>
                </v-list-item>
              </v-list-item-group>
            </v-list>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn text @click="project.openProjectDialog = false">
              Cancel
            </v-btn>
            <v-btn
              color="green darken-1"
              text
              @click.prevent="
                pushSelectedProjects();
                project.openProjectDialog = false;
              "
            >
              Open
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <v-card>
        <v-card-title class="primary white--text headline">
          Data Directory
          <v-btn
            class="ml-3"
            text
            dark
            :loading="treeRefresh"
            @click="refreshTreeData"
            ><v-icon>mdi-refresh</v-icon></v-btn
          >
          <v-spacer></v-spacer>
          <v-btn
            color="success"
            class="mr-1"
            @click="project.newProjectDialog = true"
            >New</v-btn
          >
          <v-btn class="mr-1" @click="project.openProjectDialog = true"
            >Open</v-btn
          >
          <v-btn
            color="warning"
            class="mr-1"
            dark
            :disabled="
              selected.length === 0 || selected[0].children === undefined
            "
            @click="removeTreeProject"
            >Close</v-btn
          >
          <v-btn
            color="yellow"
            class="mr-1"
            :disabled="
              selected.length === 0 ||
                selected[0].path === projectName ||
                selected[0].children === undefined
            "
            @click="setActiveProject(selected[0].path)"
            >Active</v-btn
          >
        </v-card-title>
        <v-treeview
          v-if="openProjects.length > 0"
          :active.sync="selected"
          :items="openProjects"
          :load-children="fetchDir"
          :open.sync="open"
          activatable
          color="red"
          dense
          return-object
          transition
        ></v-treeview>
        <v-card-text v-else>No sample available</v-card-text>
      </v-card>
    </v-col>
    <v-col cols="12" md="4">
      <v-row v-if="selected.length > 0">
        <v-col cols="6" md="12">
          <v-dialog v-model="dialogAverageWindow" max-width="600px">
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                v-bind="attrs"
                v-on="on"
                :disabled="selected[0].children !== undefined"
                block
                color="primary"
                @click.prevent="
                  getDefaultWindow();
                  dialogAverageWindow = true;
                "
                >Plot
              </v-btn>
            </template>
            <v-card>
              <v-card-title class="headline">Plot Options</v-card-title>
              <v-card-text>
                <v-container>
                  <v-row>
                    <v-col cols="9" sm="4">
                      <v-text-field
                        v-model.number="window"
                        :rules="[rules.inRange]"
                        label="Averaging window"
                      >
                      </v-text-field>
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col>
                      <v-radio-group
                        v-model="plotDirection"
                        label="Plot Direction"
                      >
                        <v-radio
                          v-for="(dir, i) in [
                            'top to bottom ↓',
                            'bottom to top ↑',
                          ]"
                          :key="i"
                          :label="dir"
                          :value="i"
                        ></v-radio>
                      </v-radio-group>
                    </v-col>
                  </v-row>
                </v-container>
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn text @click="dialogAverageWindow = false">Cancel </v-btn>
                <v-btn color="success" text @click="showPlot">
                  OK
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </v-col>
        <v-col cols="6" md="12">
          <v-dialog v-model="dialogExport" max-width="600px">
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                v-bind="attrs"
                v-on="on"
                :disabled="exportDisabled"
                block
                color="primary"
                @click="defaultExportOption"
              >
                Export
              </v-btn>
            </template>
            <v-card>
              <v-card-title class="headline">
                Select Export File Type
              </v-card-title>

              <v-container>
                <v-row>
                  <v-col>
                    <v-select
                      v-model="exportOption"
                      :items="allowedExportOption"
                      label="Option"
                    >
                    </v-select>
                  </v-col>
                  <v-col>
                    <v-select
                      v-model="exportFileType"
                      :items="[
                        { text: 'Raw binary', value: 'raw' },
                        { text: 'SEG2', value: 'seg2' },
                      ]"
                      label="File Type"
                    >
                    </v-select>
                  </v-col>
                </v-row>
              </v-container>

              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn text @click="dialogExport = false">
                  Cancel
                </v-btn>
                <v-btn
                  color="green"
                  text
                  @click.prevent="
                    exportFunc(false);
                    dialogExport = false;
                  "
                  >OK
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </v-col>
        <v-col cols="6" md="12">
          <v-dialog v-model="dialogEdit" max-width="600px">
            <template v-slot:activator="{ on, attrs }">
              <v-btn v-bind="attrs" v-on="on" block color="primary"
                >Edit
              </v-btn>
            </template>
            <v-card>
              <v-card-title>
                <span class="headline">Edit Name</span>
              </v-card-title>
              <v-card-text>
                <v-container>
                  <v-row>
                    <v-col cols="12" md="4" sm="6">
                      <v-text-field
                        v-model="selected[0].name"
                        disabled
                        label="Current Name"
                        readonly
                      ></v-text-field>
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col cols="12" md="4" sm="6">
                      <v-text-field
                        v-model="newName"
                        :rules="[rules.nonEmpty]"
                        label="New Name*"
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
        <v-col cols="6" md="12">
          <v-dialog v-model="dialogDelete" max-width="600px">
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                v-bind="attrs"
                v-on="on"
                block
                class="white-text"
                color="red"
              >
                Delete
              </v-btn>
            </template>
            <v-card>
              <v-card-title class="headline"> Confirm Deletion</v-card-title>
              <v-card-text
                >You are deleting a project/file. Are you sure? This action is
                NOT reversable.
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn text @click="dialogDelete = false"> Cancel</v-btn>
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
              >mdi-check-circle
            </v-icon>
            <v-icon v-else color="red" large>mdi-information </v-icon>
            {{ exportResponse.message }}
          </v-sheet>
        </v-bottom-sheet>
      </v-row>

      <v-dialog v-model="overwriteDialog" max-width="290">
        <v-card>
          <v-card-title class="headline justify-center">
            <v-icon color="orange" size="75">mdi-information</v-icon>
          </v-card-title>
          <v-card-text
            >File/Folder already exists. Do you want to overwrite it?
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
              color="green darken-1"
              text
              @click="
                overwriteDialog = false;
                sheet = true;
              "
            >
              No
            </v-btn>
            <v-btn
              color="green darken-1"
              text
              @click.prevent="
                exportFunc(true);
                overwriteDialog = false;
              "
            >
              Yes
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-col>
  </v-row>
</template>
<script>
import axios from "@/plugins/axios";
import router from "@/router";

export default {
  name: "DataTree",
  props: {
    projectName: String,
  },
  mounted() {
    axios
      .get("/api/usb")
      .then(() => {
        this.usbConnected = true;
      })
      .catch(() => {
        this.usbConnected = false;
      });
    axios
      .get("/api/tree/")
      .then((resp) => {
        for (const item of resp.data.items) {
          this.currentID++;
          if (item.dir) {
            this.$store.commit("pushAllProjects", {
              id: this.currentID.toString(),
              path: resp.data.directory + item.name,
              name: item.name,
              children: [],
            });
          } else {
            this.$store.commit("pushAllProjects", {
              id: this.currentID.toString(),
              path: resp.data.directory + item.name,
              name: item.name,
            });
          }
        }
      })
      .catch();
  },
  data: () => ({
    window: 1,
    dialogAverageWindow: false,
    dialogEdit: false,
    dialogDelete: false,
    dialogExport: false,
    exportResponse: {
      success: false,
      message: "",
    },
    exportOption: "save",
    exportFileType: "seg2",

    treeRefresh: false,

    project: {
      // allProjects: [],
      // openProjects: [],
      newState: [],
      newProjectDialog: false,
      openProjectDialog: false,
      projectName: "",
    },

    plotDirection: 0,
    overwriteDialog: false,
    sheet: false,
    newName: "",
    currentID: 0,
    selected: [],
    rules: {
      inRange: (value) => value > 0 && value < 101,
      nonEmpty: (value) => value.length > 0,
    },
    open: [],
  }),

  computed: {
    allProjects() {
      return this.$store.state.allProjects;
    },
    openProjects() {
      return this.$store.state.openProjects;
    },
    plotPath() {
      return "/plot?file=" + this.selected[0].path;
    },
    allowedExportOption() {
      let list = [
        { text: "Download", value: "download", disabled: false },
        { text: "Save to USB", value: "save", disabled: false },
      ];
      if (this.selected[0].children !== undefined) {
        list[0].disabled = true;
      }
      if (!this.usbConnected) {
        list[1].disabled = true;
      }
      return list;
    },
    exportDisabled() {
      let list = this.allowedExportOption;
      return list[0].disabled && list[1].disabled;
    },
  },

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
    createProject() {
      axios
        .post("/api/tree", { name: this.project.projectName })
        .then((resp) => {
          console.log(resp);
          this.currentID++;
          let item = {
            id: this.currentID.toString(),
            path: "/" + this.project.projectName,
            name: this.project.projectName,
            children: [],
          };
          this.$store.commit("pushAllProjects", item);
          this.$store.commit("pushOpenProjects", item);
        })
        .catch((err) => {
          console.log(err);
        })
        .then(() => {
          this.project.projectName = "";
          this.project.newProjectDialog = false;
        });
    },
    setActiveProject(path) {
      axios.patch("/api/project/active", { path: path }).then(() => {
        this.$emit("changed", path);
      });
    },
    refreshTreeData() {
      this.currentID = 0;
      this.$store.commit("clearAllprojects");
      axios.get("/api/tree/").then((resp) => {
        for (const item of resp.data.items) {
          this.currentID++;
          if (item.dir) {
            this.$store.commit("pushAllProjects", {
              id: this.currentID.toString(),
              path: resp.data.directory + item.name,
              name: item.name,
              children: [],
            });
          } else {
            this.$store.commit("pushAllProjects", {
              id: this.currentID.toString(),
              path: resp.data.directory + item.name,
              name: item.name,
            });
          }
        }
      });
    },
    pushSelectedProjects() {
      this.$store.commit("setOpenProjects", this.project.newState);
    },
    removeTreeProject() {
      if (this.selected[0].path === this.projectName) {
        this.setActiveProject("/");
      }
      this.$store.commit("removeOpenProjectByPath", this.selected[0].path);
      this.selected = [];
    },
    deleteFileOrFolder() {
      axios
        .delete("/api/tree" + this.selected[0].path)
        .then(() => {
          this.deleteTreeItem(this.openProjects, this.selected[0].path);
        })
        .catch();
      this.dialogDelete = false;
    },
    deleteTreeItem(root, path) {
      for (let i = 0; i < root.length; i++) {
        if (root[i].path === path) {
          root.splice(i, 1);
          return true;
        }
      }
      for (let i = 0; i < root.length; i++) {
        if (this.deleteTreeItem(root[i].children, path)) {
          return true;
        }
      }
    },
    getDefaultWindow() {
      axios.post("/api/plot", { file: this.selected[0].path }).then((resp) => {
        this.window = resp.data.window;
      });
    },
    downloadFile() {
      axios
        .get("/api/dl" + this.selected[0].path + "?type=" + this.exportFileType)
        .then((response) => {
          let fileName = response.headers["content-disposition"]
            .split(";")[1]
            .split("=")[1];
          const blob = new Blob([response.data], {
            type: "application/octet-stream",
          });
          const link = document.createElement("a");
          link.href = URL.createObjectURL(blob);
          link.download = fileName;
          link.click();
          URL.revokeObjectURL(link.href);
        })
        .catch((error) => console.log(error));
    },
    defaultExportOption() {
      if (this.usbConnected) {
        this.exportOption = "save";
      } else if (this.selected[0].children === undefined) {
        this.exportOption = "download";
      }
    },
    exportFunc(force) {
      if (this.exportOption === "download") {
        this.downloadFile();
        return;
      }
      let apiPath = "";
      let form = {};
      if (this.selected[0].children === undefined) {
        apiPath = "/api/save/sample";
        form["file"] = this.selected[0].path;
      } else {
        apiPath = "/api/save/project";
        form["project"] = this.selected[0].path;
      }

      // if (this.exportOption === "Download") {
      // } else if (this.exportOption === "Save to USB") {
      // }
      apiPath += "?type=" + this.exportFileType;

      if (force) {
        apiPath = apiPath + "&force=true";
        axios
          .post(apiPath, form)
          .then(() => {
            this.exportResponse.success = true;
            this.exportResponse.message = "Successfully saved data to USB";
          })
          .catch((error) => {
            this.exportResponse.success = false;
            this.exportResponse.message = error.response.data.error;
          })
          .then(() => {
            this.sheet = true;
          });
      } else {
        axios
          .post(apiPath, form)
          .then(() => {
            this.exportResponse.success = true;
            this.exportResponse.message = "Successfully saved data to USB";
            this.sheet = true;
          })
          .catch((error) => {
            this.exportResponse.success = false;
            this.exportResponse.message = error.response.data.error;
            if (error.response.data.error.includes("exists")) {
              this.overwriteDialog = true;
            } else {
              this.sheet = true;
            }
          });
      }
    },
    showPlot() {
      router.push({
        path: "/plot",
        // component: PlotStream,
        query: {
          file: this.selected[0].path,
          window: this.window,
          direction: this.plotDirection,
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
  },
};
</script>
