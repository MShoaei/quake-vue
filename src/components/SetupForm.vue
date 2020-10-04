<template>
  <v-container>
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
    <v-row>
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
          <v-col cols="12" lg="5">
            <v-radio-group v-model="formData.startMode">
              <v-radio label="ASAP" value="asap"> </v-radio>
              <v-radio label="WITH HAMMER" value="hammer"> </v-radio>
              <v-radio label="MONITOR + TRIGGER" value="trigger"> </v-radio>
            </v-radio-group>
          </v-col>
          <v-col sm="3" lg="1">
            <v-btn color="primary" @click.stop="channelDialog = true">
              Channels
            </v-btn>
          </v-col>
        </v-row>
        <v-btn color="primary" type="submit" :loading="loading">submit</v-btn>
      </v-form>
    </v-row>
    <v-row>
      <v-col>
        file name
      </v-col>
      <v-col>
        address
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import axios from "@/plugins/axios";

export default {
  name: "SetupForm",
  data: () => ({
    loading: false,
    channelDialog: false,
    gainDialog: false,
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
    formData: {
      startMode: "",
      recordTime: 32,
      samplingTime: 16
    }
  }),
  methods: {
    setupDevice: function() {
      this.loading = true;
      axios
        .post("/api/setup", JSON.stringify(this.formData))
        .then()
        .error();
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
    }
  }
};
</script>

<style scoped></style>
