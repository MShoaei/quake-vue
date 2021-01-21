<template>
  <div>
    <v-dialog v-model="channelDialog">
      <v-card>
        <v-card-title><span class="headline">Channels</span></v-card-title>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="12" md="9">
                <v-row>
                  <v-col
                    v-for="(_, index) in channels"
                    :key="index"
                    cols="6"
                    md="3"
                  >
                    <v-checkbox
                      v-model="channels[index]"
                      :label="`Channel ${index + 1}`"
                    ></v-checkbox>
                  </v-col>
                </v-row>
              </v-col>
              <v-col align-self="center">
                <v-btn block class="mb-4" color="primary" @click="selectAll"
                  >Select All
                </v-btn>
                <v-btn
                  block
                  class="mb-4"
                  color="primary"
                  @click="selectHalf(0, 12)"
                  >channels 1-12
                </v-btn>
                <v-btn
                  block
                  class="mb-4"
                  color="primary"
                  @click="selectHalf(12, 24)"
                  >channels 13-24
                </v-btn>
                <v-btn block class="mb-4" color="primary" @click="clearAll"
                  >Clear all</v-btn
                >
                <v-btn block color="success" @click="setChannels">OK </v-btn>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
      </v-card>
    </v-dialog>
    <v-dialog v-model="gainDialog">
      <v-card>
        <v-card-title><span class="headline">Gains</span></v-card-title>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col>
                <v-data-table
                  :headers="headers"
                  :items="gains"
                  class="elevation-1"
                  item-key="channel"
                >
                  <template v-slot:body="{ items }">
                    <tbody>
                      <tr v-for="item in items" :key="item.channel">
                        <td>{{ item.channel }}</td>
                        <td>
                          <v-checkbox
                            v-model="item.g1"
                            @change="selectChannelGain(item.channel, 'g1')"
                          ></v-checkbox>
                        </td>
                        <td>
                          <v-checkbox
                            v-model="item.g2"
                            @change="selectChannelGain(item.channel, 'g2')"
                          ></v-checkbox>
                        </td>
                        <td>
                          <v-checkbox
                            v-model="item.g10"
                            @change="selectChannelGain(item.channel, 'g10')"
                          ></v-checkbox>
                        </td>
                        <td>
                          <v-checkbox
                            v-model="item.g20"
                            @change="selectChannelGain(item.channel, 'g20')"
                          ></v-checkbox>
                        </td>
                        <td>
                          <v-checkbox
                            v-model="item.g50"
                            @change="selectChannelGain(item.channel, 'g50')"
                          ></v-checkbox>
                        </td>
                        <td>
                          <v-checkbox
                            v-model="item.g100"
                            @change="selectChannelGain(item.channel, 'g100')"
                          ></v-checkbox>
                        </td>
                        <td>
                          <v-checkbox
                            v-model="item.g200"
                            @change="selectChannelGain(item.channel, 'g200')"
                          ></v-checkbox>
                        </td>
                        <td>
                          <v-checkbox
                            v-model="item.g500"
                            @change="selectChannelGain(item.channel, 'g500')"
                          ></v-checkbox>
                        </td>
                        <td>
                          <v-checkbox
                            v-model="item.g1000"
                            @change="selectChannelGain(item.channel, 'g1000')"
                          ></v-checkbox>
                        </td>
                        <td>
                          <v-checkbox
                            v-model="item.g5000"
                            @change="selectChannelGain(item.channel, 'g5000')"
                          ></v-checkbox>
                        </td>
                        <td>
                          <v-checkbox
                            v-model="item.g10000"
                            @change="selectChannelGain(item.channel, 'g10000')"
                          ></v-checkbox>
                        </td>
                        <td>
                          <v-checkbox
                            v-model="item.g15000"
                            @change="selectChannelGain(item.channel, 'g15000')"
                          ></v-checkbox>
                        </td>
                      </tr>
                    </tbody>
                  </template>
                </v-data-table>
                <v-btn block class="mt-4" color="success" @click="setGains"
                  >OK
                </v-btn>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
      </v-card>
    </v-dialog>
    <v-dialog v-model="samplingCompleteDialog" max-width="600px">
      <v-card>
        <v-card-title class="headline justify-center">
          <v-icon color="green" size="75">mdi-check-circle</v-icon>
        </v-card-title>
        <v-card-text
          >Sampling is done. Do you want to see the plot?
          <v-container>
            <v-row>
              <v-col>
                <v-radio-group label="Plot Direction" v-model="plotDirection">
                  <v-radio
                    v-for="(dir, i) in ['top to bottom ↓', 'bottom to top ↑']"
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
          <v-btn text @click="samplingCompleteDialog = false">
            No
          </v-btn>
          <v-btn color="green darken-1" text @click.prevent="showPlot">
            Yes
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-bottom-sheet v-model="sheet" hide-overlay inset>
      <v-sheet
        class="text-center d-flex justify-center align-center"
        height="100px"
      >
        <v-icon color="green" large>mdi-check-circle</v-icon> Sampling has
        started. Please wait...
      </v-sheet>
    </v-bottom-sheet>
    <div id="setup-form">
      <v-form @submit.prevent="setupDevice">
        <v-row>
          <v-col cols="6" lg="3">
            <v-select
              v-model="formData.recordTime"
              :items="recordTimes"
              label="Rec. Time (ms)"
            ></v-select>
          </v-col>
          <v-col cols="6" lg="3">
            <v-select
              v-model="formData.samplingTime"
              :items="samplingTimes"
              label="Sampling Time (μs)"
            ></v-select>
          </v-col>
          <v-col cols="6" md="3">
            <v-radio-group v-model="formData.startMode">
              <v-radio label="ASAP" value="asap"></v-radio>
              <v-radio label="WITH HAMMER" value="hammer"></v-radio>
              <v-radio label="MONITOR + TRIGGER" value="trigger"></v-radio>
            </v-radio-group>
          </v-col>
          <v-col class="d-flex flex-column justify-center" lg="3" sm="3">
            <v-btn color="primary" @click.stop="channelDialog = true">
              Channels
            </v-btn>
            <v-btn class="mt-3" color="primary" @click.stop="gainDialog = true">
              Gain
            </v-btn>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="6" sm="4">
            <v-subheader>Averaging window</v-subheader>
          </v-col>
          <v-col cols="6" sm="2">
            <v-text-field
              :rules="[rules.inRange]"
              v-model.number="formData.window"
            >
            </v-text-field>
          </v-col>
          <v-col v-if="formData.startMode === 'hammer'" cols="6" sm="4">
            <v-subheader>Threshold</v-subheader>
          </v-col>
          <v-col v-if="formData.startMode === 'hammer'" cols="6" sm="2">
            <v-text-field
              v-model.number="formData.threshold"
              suffix="µV"
            ></v-text-field>
          </v-col>
          <v-col
            v-if="formData.startMode === 'hammer'"
            cols="6"
            offset-sm="6"
            sm="4"
          >
            <v-subheader>Trigger Channel</v-subheader>
          </v-col>
          <v-col v-if="formData.startMode === 'hammer'" cols="6" sm="2">
            <v-select
              :items="triggerChannelsList"
              v-model="formData.triggerChannel"
            >
            </v-select>
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <v-text-field
              v-model.trim="formData.projectName"
              label="Project name"
            ></v-text-field>
          </v-col>
          <v-col>
            <v-text-field
              v-model.trim="formData.fileName"
              label="File name"
            ></v-text-field>
          </v-col>
          <v-col>
            <v-btn
              block
              :loading="loading"
              color="success"
              type="submit"
              @click.prevent="setupDevice"
              >Start
            </v-btn>
          </v-col>
        </v-row>
      </v-form>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import router from "@/router";
// import PlotStream from "@/views/PlotStream";

export default {
  name: "SetupForm",
  data: () => ({
    loading: false,
    sheet: false,
    channelDialog: false,
    gainDialog: false,
    samplingCompleteDialog: false,
    rules: {
      inRange: (value) => value > 0 && value < 101,
    },
    recordTimes: [
      32,
      64,
      128,
      256,
      512,
      1024,
      2048,
      4096,
      8192,
      16384,
      32768,
      65536,
    ],
    samplingTimes: [31.25, 62.5, 125, 250, 500, 1000],
    channels: [
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      false,
    ],
    headers: [
      {
        text: "Channel",
        align: "start",
        sortable: false,
        value: "channel",
      },
      { text: "1", sortable: false, value: "g1" },
      { text: "2", sortable: false, value: "g2" },
      { text: "10", sortable: false, value: "g10" },
      { text: "20", sortable: false, value: "g20" },
      { text: "50", sortable: false, value: "g50" },
      { text: "100", sortable: false, value: "g100" },
      { text: "200", sortable: false, value: "g200" },
      { text: "500", sortable: false, value: "g500" },
      { text: "1000", sortable: false, value: "g1000" },
      { text: "5000", sortable: false, value: "g5000" },
      { text: "10000", sortable: false, value: "g10000" },
      { text: "15000", sortable: false, value: "g15000" },
    ],
    gains: [
      {
        channel: "All",
        g1: false,
        g2: false,
        g10: false,
        g20: false,
        g50: false,
        g100: false,
        g200: false,
        g500: false,
        g1000: false,
        g5000: false,
        g10000: false,
        g15000: false,
      },
      {
        channel: 1,
        g1: false,
        g2: false,
        g10: false,
        g20: false,
        g50: false,
        g100: false,
        g200: false,
        g500: false,
        g1000: false,
        g5000: false,
        g10000: false,
        g15000: false,
      },
      {
        channel: 2,
        g1: false,
        g2: false,
        g10: false,
        g20: false,
        g50: false,
        g100: false,
        g200: false,
        g500: false,
        g1000: false,
        g5000: false,
        g10000: false,
        g15000: false,
      },
      {
        channel: 3,
        g1: false,
        g2: false,
        g10: false,
        g20: false,
        g50: false,
        g100: false,
        g200: false,
        g500: false,
        g1000: false,
        g5000: false,
        g10000: false,
        g15000: false,
      },
      {
        channel: 4,
        g1: false,
        g2: false,
        g10: false,
        g20: false,
        g50: false,
        g100: false,
        g200: false,
        g500: false,
        g1000: false,
        g5000: false,
        g10000: false,
        g15000: false,
      },
      {
        channel: 5,
        g1: false,
        g2: false,
        g10: false,
        g20: false,
        g50: false,
        g100: false,
        g200: false,
        g500: false,
        g1000: false,
        g5000: false,
        g10000: false,
        g15000: false,
      },
      {
        channel: 6,
        g1: false,
        g2: false,
        g10: false,
        g20: false,
        g50: false,
        g100: false,
        g200: false,
        g500: false,
        g1000: false,
        g5000: false,
        g10000: false,
        g15000: false,
      },
      {
        channel: 7,
        g1: false,
        g2: false,
        g10: false,
        g20: false,
        g50: false,
        g100: false,
        g200: false,
        g500: false,
        g1000: false,
        g5000: false,
        g10000: false,
        g15000: false,
      },
      {
        channel: 8,
        g1: false,
        g2: false,
        g10: false,
        g20: false,
        g50: false,
        g100: false,
        g200: false,
        g500: false,
        g1000: false,
        g5000: false,
        g10000: false,
        g15000: false,
      },
      {
        channel: 9,
        g1: false,
        g2: false,
        g10: false,
        g20: false,
        g50: false,
        g100: false,
        g200: false,
        g500: false,
        g1000: false,
        g5000: false,
        g10000: false,
        g15000: false,
      },
      {
        channel: 10,
        g1: false,
        g2: false,
        g10: false,
        g20: false,
        g50: false,
        g100: false,
        g200: false,
        g500: false,
        g1000: false,
        g5000: false,
        g10000: false,
        g15000: false,
      },
      {
        channel: 11,
        g1: false,
        g2: false,
        g10: false,
        g20: false,
        g50: false,
        g100: false,
        g200: false,
        g500: false,
        g1000: false,
        g5000: false,
        g10000: false,
        g15000: false,
      },
      {
        channel: 12,
        g1: false,
        g2: false,
        g10: false,
        g20: false,
        g50: false,
        g100: false,
        g200: false,
        g500: false,
        g1000: false,
        g5000: false,
        g10000: false,
        g15000: false,
      },
      {
        channel: 13,
        g1: false,
        g2: false,
        g10: false,
        g20: false,
        g50: false,
        g100: false,
        g200: false,
        g500: false,
        g1000: false,
        g5000: false,
        g10000: false,
        g15000: false,
      },
      {
        channel: 14,
        g1: false,
        g2: false,
        g10: false,
        g20: false,
        g50: false,
        g100: false,
        g200: false,
        g500: false,
        g1000: false,
        g5000: false,
        g10000: false,
        g15000: false,
      },
      {
        channel: 15,
        g1: false,
        g2: false,
        g10: false,
        g20: false,
        g50: false,
        g100: false,
        g200: false,
        g500: false,
        g1000: false,
        g5000: false,
        g10000: false,
        g15000: false,
      },
      {
        channel: 16,
        g1: false,
        g2: false,
        g10: false,
        g20: false,
        g50: false,
        g100: false,
        g200: false,
        g500: false,
        g1000: false,
        g5000: false,
        g10000: false,
        g15000: false,
      },
      {
        channel: 17,
        g1: false,
        g2: false,
        g10: false,
        g20: false,
        g50: false,
        g100: false,
        g200: false,
        g500: false,
        g1000: false,
        g5000: false,
        g10000: false,
        g15000: false,
      },
      {
        channel: 18,
        g1: false,
        g2: false,
        g10: false,
        g20: false,
        g50: false,
        g100: false,
        g200: false,
        g500: false,
        g1000: false,
        g5000: false,
        g10000: false,
        g15000: false,
      },
      {
        channel: 19,
        g1: false,
        g2: false,
        g10: false,
        g20: false,
        g50: false,
        g100: false,
        g200: false,
        g500: false,
        g1000: false,
        g5000: false,
        g10000: false,
        g15000: false,
      },
      {
        channel: 20,
        g1: false,
        g2: false,
        g10: false,
        g20: false,
        g50: false,
        g100: false,
        g200: false,
        g500: false,
        g1000: false,
        g5000: false,
        g10000: false,
        g15000: false,
      },
      {
        channel: 21,
        g1: false,
        g2: false,
        g10: false,
        g20: false,
        g50: false,
        g100: false,
        g200: false,
        g500: false,
        g1000: false,
        g5000: false,
        g10000: false,
        g15000: false,
      },
      {
        channel: 22,
        g1: false,
        g2: false,
        g10: false,
        g20: false,
        g50: false,
        g100: false,
        g200: false,
        g500: false,
        g1000: false,
        g5000: false,
        g10000: false,
        g15000: false,
      },
      {
        channel: 23,
        g1: false,
        g2: false,
        g10: false,
        g20: false,
        g50: false,
        g100: false,
        g200: false,
        g500: false,
        g1000: false,
        g5000: false,
        g10000: false,
        g15000: false,
      },
      {
        channel: 24,
        g1: false,
        g2: false,
        g10: false,
        g20: false,
        g50: false,
        g100: false,
        g200: false,
        g500: false,
        g1000: false,
        g5000: false,
        g10000: false,
        g15000: false,
      },
    ],
    triggerChannelsList: [],
    plotDirection: 0,

    formData: {
      startMode: "asap",
      threshold: 0,
      triggerChannel: 0,
      recordTime: 1024,
      samplingTime: 1000,
      window: 1,
      fileName: "",
      projectName: "",
    },
  }),
  methods: {
    setupDevice: function() {
      this.loading = true;
      this.sheet = true;
      axios
        .create({ timeout: 1200000 })
        .post("/api/setup", this.formData)
        .then(() => {
          this.samplingCompleteDialog = true;
        })
        .catch();
      this.loading = false;
      // this.sheet = false;
    },
    selectAll: function() {
      for (let i = 0; i < 24; i++) {
        this.$set(this.channels, i, true);
      }
    },
    clearAll: function() {
      for (let i = 0; i < 24; i++) {
        this.$set(this.channels, i, false);
      }
    },
    selectHalf: function(start, end) {
      for (let i = 0; i < 24; i++) {
        this.$set(this.channels, i, false);
      }
      for (let i = start; i < end; i++) {
        this.$set(this.channels, i, true);
      }
    },
    selectChannelGain: function(channel, key) {
      let newValue = this.gains[channel === "All" ? 0 : channel][key];
      if (channel === "All") {
        Object.keys(this.gains[0]).forEach((key) => {
          if (this.gains[0][key] === true || this.gains[0][key] === false) {
            for (let i = 0; i < this.gains.length; i++) {
              this.$set(this.gains[i], key, false);
            }
          }
        });
        if (newValue === true) {
          for (let i = 1; i < this.gains.length; i++) {
            this.$set(this.gains[i], key, newValue);
          }
        }
        this.$set(this.gains[0], key, newValue);
      } else {
        Object.keys(this.gains[channel]).forEach((key) => {
          if (this.gains[channel][key] === true) {
            this.gains[channel][key] = false;
          }
        });
        this.$set(this.gains[channel], key, true);
      }
    },
    showPlot: function() {
      router.push({
        path: "/plot",
        // component: PlotStream,
        query: {
          file:
            (this.formData.projectName === "/"
              ? ""
              : this.formData.projectName) +
            "/" +
            this.formData.fileName,
          direction: this.plotDirection,
        },
      });
    },
    setChannels: function() {
      this.channelDialog = false;
      this.triggerChannelsList = [];
      for (let i = 0; i < this.channels.length; i++) {
        const ch = this.channels[i];
        if (ch) {
          this.triggerChannelsList.push({ text: i + 1, value: i });
        }
      }
      axios.post("/api/channels", this.channels).then((resp) => {
        console.log(resp.data);
      });
    },
    setGains: function() {
      let gains = new Array(24);
      for (let i = 0; i < 24; i++) {
        Object.keys(this.gains[i + 1]).forEach((value) => {
          if (
            typeof this.gains[i + 1][value] === "boolean" &&
            this.gains[i + 1][value] === true
          ) {
            gains[i] = parseInt(value.slice(1));
          }
        });
      }
      axios.post("/api/gains", gains).then((resp) => {
        console.log(resp.data);
        this.gainDialog = false;
      });
    },
  },
  mounted: function() {
    axios.get("/api/channels").then((resp) => {
      this.channels = resp.data.channels;
    });
    axios.get("/api/gains").then((resp) => {
      for (let i = 0; i < resp.data.gains.length; i++) {
        const gain = resp.data.gains[i];
        this.gains[i + 1]["g" + gain] = true;
      }
    });
  },
};
</script>

<style lang="scss" scoped></style>
