<template>
  <v-col>
    <v-overlay :value="progressOverlay">
      <v-container>
        <v-progress-circular v-model="progressValue" size="64" color="primary">
          <strong>{{ progressValue }}%</strong>
        </v-progress-circular>
      </v-container>
    </v-overlay>
    <v-btn icon outlined large color="primary" link to="/">
      <v-icon dark>mdi-arrow-left</v-icon>
    </v-btn>
    <vue-plotly
      ref="plot"
      :data="plotData"
      :layout="layout"
      :options="options"
    />
    <v-row>
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
      <v-dialog v-model="overwriteDialog" max-width="290" persistent>
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
      <v-col cols="6">
        <v-dialog v-model="dialogExport" max-width="600px">
          <template v-slot:activator="{ on, attrs }">
            <v-btn block color="primary" v-bind="attrs" v-on="on">
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
                    label="Option"
                    :items="[
                      {
                        text: 'Download',
                        value: 'download',
                        disabled: false,
                      },
                      { text: 'Save to USB', value: 'save', disabled: false },
                    ]"
                    v-model="exportOption"
                  >
                  </v-select>
                </v-col>
                <v-col>
                  <v-select
                    label="File Type"
                    :items="[
                      { text: 'Raw binary', value: 'raw' },
                      { text: 'SEG2', value: 'seg2' },
                    ]"
                    v-model="exportFileType"
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
                text
                color="green"
                @click="
                  exportFunc(false);
                  dialogExport = false;
                "
                >OK</v-btn
              >
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-col>
      <v-col cols="6">
        <v-dialog v-model="dialogDelete" persistent max-width="600px">
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              block
              class="white-text"
              color="red"
              v-bind="attrs"
              v-on="on"
            >
              Delete
            </v-btn>
          </template>
          <v-card>
            <v-card-title class="headline"> Confirm Deletion </v-card-title>
            <v-card-text
              >You are deleting a project/file. Are you sure? This action is NOT
              reversable.</v-card-text
            >
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn text @click="dialogDelete = false"> Cancel </v-btn>
              <v-btn color="red darken-1" text @click="deleteFile">
                Delete
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-col>
    </v-row>
  </v-col>
</template>

<script>
import axios from "@/plugins/axios";
import router from "@/router";
import VuePlotly from "@statnett/vue-plotly";

export default {
  name: "PlotStream",
  components: {
    VuePlotly,
  },
  data() {
    return {
      dialogDelete: false,
      dialogExport: false,
      exportOption: "save",
      exportFileType: "seg2",
      overwriteDialog: false,
      exportResponse: {
        success: false,
        message: "",
      },
      progressOverlay: false,
      progressValue: 0.0,
      sheet: false,

      i: 0,
      delay: 1,
      window: 1,
      globalY: [],
      form: router.currentRoute.query,
      plotData: [],
      movingAverage: [],
      layout: {
        // width: 320,
        height: 800,
        autosize: true,
        hovermode: false,
        dragmode: "pan",
        transition: {
          duration: 0,
        },
        title: "A Fancy Plot",
        yaxis: {
          visible: true,
        },
        xaxis: {
          visible: true,
          // range: [-100000000,100000000]
        },
      },
      options: {
        displayModeBar: true,
        displaylogo: false,
        responsive: true,
        autoScale: false,
        doubleClickDelay: 100,
        modeBarButtonsToRemove: [
          "toImage",
          "autoScale2d",
          "zoomIn2d",
          "zoomOut2d",
          "toggleSpikelines",
          "hoverCompareCartesian",
        ],
      },
    };
  },
  methods: {
    exportFunc(force) {
      if (this.exportOption === "download") {
        this.downloadFile();
        return;
      }
      let apiPath = "";
      let form = {};
      apiPath = "/api/save/sample";
      form["file"] = this.form.file;

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
    downloadFile() {
      axios
        .get("/api/dl" + this.form.file + "?type=" + this.exportFileType)
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
    deleteFile() {
      axios
        .delete("/api/tree" + "/" + this.form.file)
        .then(() => {
          router.replace("/setup");
        })
        .catch(() => {});
      this.dialogDelete = false;
    },
  },
  mounted: function() {
    this.progressOverlay = true;
    axios
      .post("/api/plot", this.form)
      .then((resp) => {
        console.log(resp.data);
        let size = resp.data.size;
        this.i = 0;
        if (this.form.window === undefined) {
          this.window = resp.data.window;
        }
        this.globalY = Array(size);
        for (let i = 0; i < size; i++) {
          this.globalY[i] = i;
        }

        let channels = resp.data.channels;
        for (let i = 0; i < channels.length; i++) {
          if (channels[i]) {
            this.plotData.push({
              y: this.globalY,
              x: Array(size),
              type: "scatter",
              name: "Channel " + (i + 1),
              marker: { color: "red" },
            });
            this.movingAverage.push({
              sum: 0,
              x: new Array(size),
            });
          }
        }
        this.layout.xaxis.range = [
          this.plotData.length * 5000000,
          this.plotData.length * -5000000,
        ];
        this.$set(this.layout.xaxis.range, 1, this.plotData.length * 5000000);
      })
      .catch(() => {
        this.progressOverlay = false;
      })
      .then(() => {
        let conn = new WebSocket(
          "ws://" +
            window.location.host +
            "/api/plot?file=" +
            router.currentRoute.query.file
        );
        conn.binaryType = "arraybuffer";
        conn.onmessage = (event) => {
          let total = this.globalY.length;

          let view = new Int32Array(event.data);
          for (let i = 0; i < this.plotData.length; i++) {
            this.plotData[i].x[this.i] = view[i] + i * 50000;
            if (this.window == 1) {
              continue;
            }
            if (this.i < this.window) {
              this.movingAverage[i].sum += view[i] + i * 50000;
              this.movingAverage[i].x[this.i] =
                this.movingAverage[i].sum / this.i;
            } else {
              this.movingAverage[i].sum += view[i] + i * 50000;
              this.movingAverage[i].sum -= this.plotData[i].x[
                this.i - this.window
              ];
              this.movingAverage[i].x[this.i] =
                this.movingAverage[i].sum / this.window;
            }
          }
          this.i++;
          this.progressValue = Math.ceil((this.i / total) * 100);
        };
        conn.onclose = () => {
          this.layout.yaxis.range =
            this.form.direction === "0"
              ? [this.globalY.length + 20, 0]
              : [0, this.globalY.length + 20];
          this.$set(this.layout.yaxis.range, 1, this.layout.yaxis.range[1]);
          this.layout.xaxis.range = [-100000000, 100000000];
          // this.$set(this.layout.yaxis.range, 1, 100000000);
          if (this.window > 1) {
            for (let i = 0; i < this.plotData.length; i++) {
              this.plotData[i].x = this.movingAverage[i].x;
            }
          }
          this.progressOverlay = false;
          this.$set(
            this.plotData[this.plotData.length - 1].x,
            this.i,
            this.plotData[this.plotData.length - 1].x[this.i]
          );
        };
      })
      .catch(() => {
        this.progressOverlay = false;
      });
  },
};
</script>

<style lang="scss" scoped></style>
