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
                <v-btn block color="primary" @click="clearAll">Clear all</v-btn>
              </v-col>
            </v-row>
            <v-row>
              <v-btn
                :block="$vuetify.breakpoint.xsOnly"
                color="success"
                @click="setChannels"
                >OK
              </v-btn>
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
            </v-row>
            <v-row>
              <v-btn
                :block="$vuetify.breakpoint.xsOnly"
                class="mt-2"
                color="success"
                @click="setGains"
                >OK
              </v-btn>
            </v-row>
          </v-container>
        </v-card-text>
      </v-card>
    </v-dialog>
    <v-dialog v-model="samplingCompleteDialog" max-width="290" persistent>
      <v-card>
        <v-card-title class="headline justify-center">
          <v-icon color="green" size="75">mdi-check-circle</v-icon>
        </v-card-title>
        <v-card-text
          >Sampling is done. Do you want to see the plot?
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="green darken-1"
            text
            @click="samplingCompleteDialog = false"
          >
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
    <div>
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
        </v-row>
        <v-btn
          :loading="loading"
          color="primary"
          type="submit"
          @click.prevent="setupDevice"
          >Start
        </v-btn>
      </v-form>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import router from "@/router";
import PlotStream from "@/views/PlotStream";

export default {
  name: "SetupForm",
  data: () => ({
    loading: false,
    sheet: false,
    channelDialog: false,
    gainDialog: false,
    samplingCompleteDialog: false,
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
      65536
    ],
    samplingTimes: [16, 31.25, 62.5, 125, 250, 500, 1000, 2000],
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
      false
    ],
    headers: [
      {
        text: "Channel",
        align: "start",
        sortable: false,
        value: "channel"
      },
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
      { text: "15000", sortable: false, value: "g15000" }
    ],
    gains: [
      {
        channel: "All",
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
        g15000: false
      },
      {
        channel: 1,
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
        g15000: false
      },
      {
        channel: 2,
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
        g15000: false
      },
      {
        channel: 3,
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
        g15000: false
      },
      {
        channel: 4,
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
        g15000: false
      },
      {
        channel: 5,
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
        g15000: false
      },
      {
        channel: 6,
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
        g15000: false
      },
      {
        channel: 7,
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
        g15000: false
      },
      {
        channel: 8,
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
        g15000: false
      },
      {
        channel: 9,
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
        g15000: false
      },
      {
        channel: 10,
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
        g15000: false
      },
      {
        channel: 11,
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
        g15000: false
      },
      {
        channel: 12,
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
        g15000: false
      },
      {
        channel: 13,
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
        g15000: false
      },
      {
        channel: 14,
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
        g15000: false
      },
      {
        channel: 15,
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
        g15000: false
      },
      {
        channel: 16,
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
        g15000: false
      },
      {
        channel: 17,
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
        g15000: false
      },
      {
        channel: 18,
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
        g15000: false
      },
      {
        channel: 19,
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
        g15000: false
      },
      {
        channel: 20,
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
        g15000: false
      },
      {
        channel: 21,
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
        g15000: false
      },
      {
        channel: 22,
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
        g15000: false
      },
      {
        channel: 23,
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
        g15000: false
      },
      {
        channel: 24,
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
        g15000: false
      }
    ],
    formData: {
      startMode: "asap",
      recordTime: 32,
      samplingTime: 16,
      fileName: "",
      projectName: ""
    }
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
        Object.keys(this.gains[0]).forEach(key => {
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
        Object.keys(this.gains[channel]).forEach(key => {
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
        component: PlotStream,
        query: {
          file:
            (this.formData.projectName === "/"
              ? ""
              : this.formData.projectName) +
            "/" +
            this.formData.fileName
        }
      });
    },
    setChannels: function() {
      this.channelDialog = false;
      axios.post("/api/channels", this.channels).then(resp => {
        console.log(resp.data);
      });
    },
    setGains: function() {
      this.channelDialog = false;
      axios.post("/api/gains", this.gains).then(resp => {
        console.log(resp.data);
      });
    }
  },
  mounted: function() {
    axios.get("/api/channels").then(resp => {
      console.log(resp.data);
      // this.channels = resp.data.rx;
    });
  }
};
</script>

<style scoped></style>
