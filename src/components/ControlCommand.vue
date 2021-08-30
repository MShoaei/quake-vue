<template>
  <v-form @submit.prevent="submitForm">
    <v-row>
      <v-col>
        <v-select
          v-model="selectedADC"
          :items="['all', '1', '2', '3', '4', '5', '6', '7', '8', '9']"
          label="ADC"
        >
        </v-select>
      </v-col>
      <v-col cols="auto">
        <v-btn :loading="loading" color="primary" type="submit">submit</v-btn>
      </v-col>
    </v-row>
  </v-form>
</template>
<script>
import axios from "@/plugins/axios";

export default {
  name: "ControlCommand",
  props: {
    cmd: String,
  },
  methods: {
    submitForm: function (command, adc) {
      this.loading = true;
      axios
        .post("/api/command/" + command + "/" + adc, this.form)
        .then((response) => {
          this.commandResponse =
            response.data.message +
            " " +
            "tx: " +
            response.data.tx +
            " rx: " +
            response.data.rx;
          this.errorResponse = false;
        })
        .catch((error) => {
          this.commandResponse = error.message;
          this.errorResponse = true;
        });
      this.loading = false;
    },
  },
  mounted: function () {
    switch (this.cmd) {
      case "ChStandby":
        break;
      case "ChModeA":
        break;
      case "ChModeB":
        break;
      case "ChModeSel":
        break;
      case "PowerMode":
        break;
      case "GeneralConf":
        break;
      case "DataControl":
        break;
      case "InterfaceConf":
        break;
      case "BISTControl":
        break;
      case "DeviceStatus":
        break;
      case "RevisionID":
        break;
      case "GPIOControl":
        break;
      case "GPIOWriteData":
        break;
      case "GPIOReadData":
        break;
      case "PrechargeBuffer1":
        break;
      case "PrechargeBuffer2":
        break;
      case "PositiveRefPrechargeBuf":
        break;
      case "NegativeRefPrechargeBuf":
        break;
      case "ChannelOffset":
        break;
      case "ChannelGain":
        break;
      case "ChannelSyncOffset":
        break;
      case "DiagnosticRX":
        break;
      case "DiagnosticMuxControl":
        break;
      case "ModulatorDelayControl":
        break;
      case "ChopControl":
        break;
      case "HardReset":
        break;
      default:
        break;
    }
  },
  data: () => ({
    selectedADC: "all",
    submitForm: {},
    loading: false,
  }),
};
</script>
