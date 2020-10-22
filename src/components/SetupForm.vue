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
            <v-row
              ><v-btn
                :block="$vuetify.breakpoint.xsOnly"
                color="success"
                @click="channelDialog = false"
                >OK</v-btn
              ></v-row
            >
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
                item-key="channel"
                class="elevation-1"
              >
                <template v-slot:body="{ items }">
                  <tbody>
                    <tr v-for="item in items" :key="item.channel">
                      <td>{{ item.channel }}</td>
                      <td>
                        <v-checkbox
                          @change="selectChannelGain(item.channel - 1, 'g2')"
                          v-model="item.g2"
                        ></v-checkbox>
                      </td>
                      <td>
                        <v-checkbox
                          @change="selectChannelGain(item.channel - 1, 'g10')"
                          v-model="item.g10"
                        ></v-checkbox>
                      </td>
                      <td>
                        <v-checkbox
                          @change="selectChannelGain(item.channel - 1, 'g20')"
                          v-model="item.g20"
                        ></v-checkbox>
                      </td>
                      <td>
                        <v-checkbox
                          @change="selectChannelGain(item.channel - 1, 'g50')"
                          v-model="item.g50"
                        ></v-checkbox>
                      </td>
                      <td>
                        <v-checkbox
                          @change="selectChannelGain(item.channel - 1, 'g100')"
                          v-model="item.g100"
                        ></v-checkbox>
                      </td>
                      <td>
                        <v-checkbox
                          @change="selectChannelGain(item.channel - 1, 'g200')"
                          v-model="item.g200"
                        ></v-checkbox>
                      </td>
                      <td>
                        <v-checkbox
                          @change="selectChannelGain(item.channel - 1, 'g500')"
                          v-model="item.g500"
                        ></v-checkbox>
                      </td>
                      <td>
                        <v-checkbox
                          @change="selectChannelGain(item.channel - 1, 'g1000')"
                          v-model="item.g1000"
                        ></v-checkbox>
                      </td>
                      <td>
                        <v-checkbox
                          @change="selectChannelGain(item.channel - 1, 'g5000')"
                          v-model="item.g5000"
                        ></v-checkbox>
                      </td>
                      <td>
                        <v-checkbox
                          @change="
                            selectChannelGain(item.channel - 1, 'g10000')
                          "
                          v-model="item.g10000"
                        ></v-checkbox>
                      </td>
                      <td>
                        <v-checkbox
                          @change="
                            selectChannelGain(item.channel - 1, 'g15000')
                          "
                          v-model="item.g15000"
                        ></v-checkbox>
                      </td>
                    </tr>
                  </tbody>
                </template>
              </v-data-table>
            </v-row>
            <v-row
              ><v-btn
                class="mt-2"
                :block="$vuetify.breakpoint.xsOnly"
                color="success"
                @click="gainDialog = false"
                >OK</v-btn
              ></v-row
            >
          </v-container>
        </v-card-text>
      </v-card>
    </v-dialog>
    <v-dialog v-model="samplingCompleteDialog" persistent max-width="290">
      <v-card>
        <v-card-title class="headline justify-center">
          <v-icon size="75" color="green">mdi-check-circle</v-icon>
        </v-card-title>
        <v-card-text
          >Let Google help apps determine location. This means sending anonymous
          location data to Google, even when no apps are running.</v-card-text
        >
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="green darken-1"
            text
            @click="samplingCompleteDialog = false"
          >
            Disagree
          </v-btn>
          <v-btn
            color="green darken-1"
            text
            @click="samplingCompleteDialog = false"
          >
            Agree
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <div>
      <v-form @submit.prevent="setupDevice">
        <v-row>
          <v-col cols="6" lg="3">
            <v-select
              label="Rec. Time (ms)"
              :items="recordTimes"
              v-model="formData.recordTime"
            ></v-select>
          </v-col>
          <v-col cols="6" lg="3">
            <v-select
              label="Sampling Time (μs)"
              :items="samplingTimes"
              v-model="formData.samplingTime"
            ></v-select>
          </v-col>
          <v-col cols="6" md="3">
            <v-radio-group v-model="formData.startMode">
              <v-radio label="ASAP" value="asap"> </v-radio>
              <v-radio label="WITH HAMMER" value="hammer"> </v-radio>
              <v-radio label="MONITOR + TRIGGER" value="trigger"> </v-radio>
            </v-radio-group>
          </v-col>
          <v-col sm="3" lg="3" class="d-flex flex-column justify-center">
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
              label="Project name"
              v-model.trim="formData.projectName"
            ></v-text-field>
          </v-col>
          <v-col>
            <v-text-field
              label="File name"
              v-model.trim="formData.fileName"
            ></v-text-field>
          </v-col>
        </v-row>
        <v-btn
          color="primary"
          type="submit"
          :loading="loading"
          @click.prevent="setupDevice"
          >Start</v-btn
        >
      </v-form>
    </div>
  </div>
</template>

<script>
import axios from "@/plugins/axios";

export default {
  name: "SetupForm",
  data: () => ({
    loading: false,
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
    selectedChannels: [],
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
      axios
        .post("/api/setup", JSON.stringify(this.formData))
        .then(() => {
          this.samplingCompleteDialog = true;
        })
        .catch();
      this.loading = false;
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
      Object.keys(this.gains[channel]).forEach(key => {
        if (this.gains[channel][key] === true) {
          this.gains[channel][key] = false;
        }
      });
      this.$set(this.gains[channel], key, true);
    }
  }
};
</script>

<style scoped></style>
