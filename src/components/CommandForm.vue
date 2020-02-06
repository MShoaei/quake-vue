<template>
  <v-container>
    <v-form @submit.prevent="submitForm">
      <v-row>
        <v-col cols="12" sm="3">
          <v-select
            label="Commands"
            :items="Commands"
            v-model="finalData.Command"
            @change="updateFlagsList"
          ></v-select>
        </v-col>
      </v-row>
      <v-row v-if="finalData.Command">
        <template v-for="(f, index) in selectedFlags">
          <v-col :key="index" cols="3" md="2">
            <v-select
              :key="f.value"
              :label="f.text"
              :items="f.options"
              v-model="finalData.Flags[index].Value"
            ></v-select>
          </v-col>
        </template>
      </v-row>
      <v-row>
        <v-col cols="auto">
          <v-btn color="primary" type="submit" :loading="loading">submit</v-btn>
        </v-col>
      </v-row>
    </v-form>
    <v-row v-if="commandResponse">
      <v-col>
        <p
          :class="{
            'red--text': errorResponse,
            'green--text': !errorResponse
          }"
        >
          {{ commandResponse }}
        </p>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import Vue from "vue";
import { AxiosResponse, AxiosError } from "axios";
import axios from "@/plugins/axios";

export default Vue.extend({
  name: "CommandForm",

  computed: {},
  methods: {
    submitForm: function() {
      // console.log(JSON.stringify(this.finalData));
      this.loading = true;
      axios
        .post("/api/command", JSON.stringify(this.finalData))
        .then(
          (
            response: AxiosResponse<{ message: string; tx: string; rx: string }>
          ) => {
            // console.log(response.data);
            this.commandResponse =
              response.data.message +
              " " +
              "tx: " +
              response.data.tx +
              " rx: " +
              response.data.rx;
            this.errorResponse = false;
          }
        )
        .catch((error: AxiosError<string>) => {
          // console.log(error);
          this.commandResponse = error.message;
          this.errorResponse = true;
        });
      this.loading = false;
    },

    updateFlagsList: function() {
      let cmd:
        | {
            value: string;
            text: string;
            flags: {
              value: string;
              text: string;
              options: {
                value: string;
                text: string;
              }[];
            }[];
          }
        | undefined;
      cmd = this.Commands.find(f => f.value === this.finalData.Command);
      if (cmd === undefined) {
        throw "cmd is undefined";
      }

      this.finalData.Flags = [];
      this.selectedFlags = [];
      cmd.flags.forEach(flag => {
        this.selectedFlags.push(flag);
        this.finalData.Flags.push({ Name: "--" + flag.value, Value: "" });
      });
      // console.log(this.finalData.Flags);
    }
  },

  data: () => ({
    loading: false,
    commandResponse: "",
    errorResponse: false,

    finalData: { Command: "", Flags: [] } as {
      Command: string;
      Flags: { Name: string; Value: string }[];
    },

    selectedFlags: [] as {
      value: string;
      text: string;
      options: {
        value: string;
        text: string;
      }[];
    }[],

    Commands: [
      {
        value: "ChStandby",
        text: "Channel Standby",
        flags: [
          {
            value: "write",
            text: "read or write",
            options: [
              { value: "t", text: "write" },
              { value: "f", text: "read" }
            ]
          },
          {
            value: "ch3",
            text: "ch3",
            options: [
              { value: "t", text: "standby" },
              { value: "f", text: "enabled" }
            ]
          },
          {
            value: "ch2",
            text: "ch2",
            options: [
              { value: "t", text: "standby" },
              { value: "f", text: "enabled" }
            ]
          },
          {
            value: "ch1",
            text: "ch1",
            options: [
              { value: "t", text: "standby" },
              { value: "f", text: "enabled" }
            ]
          },
          {
            value: "ch0",
            text: "ch0",
            options: [
              { value: "t", text: "standby" },
              { value: "f", text: "enabled" }
            ]
          }
        ]
      },
      {
        value: "ChModeA",
        text: "Channel Mode A",
        flags: [
          {
            value: "write",
            text: "read or write",
            options: [
              { value: "t", text: "write" },
              { value: "f", text: "read" }
            ]
          },
          {
            value: "f-type",
            text: "filter type",
            options: [
              { value: "0", text: "wideband" },
              { value: "1", text: "sinc5" }
            ]
          },
          {
            value: "dec-rate",
            text: "decimation rate",
            options: [
              { value: "32", text: "x32" },
              { value: "64", text: "x64" },
              { value: "128", text: "x128" },
              { value: "256", text: "x256" },
              { value: "512", text: "x512" },
              { value: "1024", text: "x1024" }
            ]
          }
        ]
      },
      {
        value: "ChModeB",
        text: "Channel Mode B",
        flags: [
          {
            value: "write",
            text: "read or write",
            options: [
              { value: "t", text: "write" },
              { value: "f", text: "read" }
            ]
          },
          {
            value: "f-type",
            text: "filter type",
            options: [
              { value: "0", text: "wideband" },
              { value: "1", text: "sinc5" }
            ]
          },
          {
            value: "dec-rate",
            text: "decimation rate",
            options: [
              { value: "32", text: "x32" },
              { value: "64", text: "x64" },
              { value: "128", text: "x128" },
              { value: "256", text: "x256" },
              { value: "512", text: "x512" },
              { value: "1024", text: "x1024" }
            ]
          }
        ]
      },
      {
        value: "ChModeSel",
        text: "Select Channel Mode",
        flags: [
          {
            value: "write",
            text: "read or write",
            options: [
              { value: "t", text: "write" },
              { value: "f", text: "read" }
            ]
          },
          {
            value: "ch3",
            text: "ch3 Mode",
            options: [
              { value: "0", text: "Mode A" },
              { value: "1", text: "Mode B" }
            ]
          },
          {
            value: "ch2",
            text: "ch2 Mode",
            options: [
              { value: "0", text: "Mode A" },
              { value: "1", text: "Mode B" }
            ]
          },
          {
            value: "ch1",
            text: "ch1 Mode",
            options: [
              { value: "0", text: "Mode A" },
              { value: "1", text: "Mode B" }
            ]
          },
          {
            value: "ch0",
            text: "ch0 Mode",
            options: [
              { value: "0", text: "Mode A" },
              { value: "1", text: "Mode B" }
            ]
          }
        ]
      },
      {
        value: "PowerMode",
        text: "Power Mode",
        flags: [
          {
            value: "write",
            text: "read or write",
            options: [
              { value: "t", text: "write" },
              { value: "f", text: "read" }
            ]
          },
          {
            value: "sleep",
            text: "Sleep mode",
            options: [
              { value: "0", text: "Normal Operation" },
              { value: "1", text: "Sleep Mode" }
            ]
          },
          {
            value: "power",
            text: "Power Mode",
            options: [
              { value: "0", text: "Low Power" },
              { value: "1", text: "Median" },
              { value: "2", text: "Fast" }
            ]
          },
          {
            value: "lvds-clk",
            text: "LVDS Enable",
            options: [
              { value: "0", text: "disable" },
              { value: "1", text: "enable" }
            ]
          },
          {
            value: "mclk-div",
            text: "MCLK Div",
            options: [
              { value: "0", text: "MCLK/32" },
              { value: "1", text: "MCLK/8" },
              { value: "2", text: "MCLK/4" }
            ]
          }
        ]
      },
      {
        value: "GeneralConf",
        text: "General Configuration",
        flags: [
          {
            value: "write",
            text: "read or write",
            options: [
              { value: "t", text: "write" },
              { value: "f", text: "read" }
            ]
          },
          {
            value: "retime-en",
            text: "retime enable bit",
            options: [
              { value: "0", text: "enable" },
              { value: "1", text: "disable" }
            ]
          },
          {
            value: "vcm-pd",
            text: "VCM buffer power-down",
            options: [
              { value: "0", text: "enabled" },
              { value: "1", text: "powered down" }
            ]
          },
          {
            value: "vcm-vsel",
            text: "VCM voltage",
            options: [
              { value: "0", text: "(AVDD1 − AVSS)/2 V" },
              { value: "1", text: "1.65 V" },
              { value: "2", text: "2.5 V" },
              { value: "3", text: "2.14 V" }
            ]
          }
        ]
      },
      {
        value: "DataControl",
        text: "Data Control",
        flags: [
          {
            value: "write",
            text: "read or write",
            options: [
              { value: "t", text: "write" },
              { value: "f", text: "read" }
            ]
          },
          {
            value: "spi-sync",
            text: "SPI sync",
            options: [
              { value: "0", text: "SPI_SYNC low" },
              { value: "1", text: "SPI_SYNC high" }
            ]
          },
          {
            value: "single-shot",
            text: "One-shot mode",
            options: [
              { value: "0", text: "disabled" },
              { value: "1", text: "enabled" }
            ]
          }
        ]
      },
      {
        value: "InterfaceConf",
        text: "Interface Configuration",
        flags: [
          {
            value: "write",
            text: "read or write",
            options: [
              { value: "t", text: "write" },
              { value: "f", text: "read" }
            ]
          },

          //TODO: add soft reset

          {
            value: "crc-sel",
            text: "CRC select",
            options: [
              { value: "0", text: "No CRC" },
              { value: "1", text: "every 4 samples" },
              { value: "2", text: "every 16 samples" }
            ]
          },
          {
            value: "dclk-div",
            text: "DCLK divider",
            options: [
              { value: "0", text: "Divide by 8" },
              { value: "1", text: "Divide by 4" },
              { value: "2", text: "Divide by 2" },
              { value: "3", text: "No division" }
            ]
          }
        ]
      },
      {
        value: "BISTControl",
        text: "BIST Control",
        flags: [
          {
            value: "write",
            text: "read or write",
            options: [
              { value: "t", text: "write" },
              { value: "f", text: "read" }
            ]
          },
          {
            value: "ram-bist-start",
            text: "RAM BIST",
            options: [
              { value: "0", text: "Off" },
              { value: "1", text: "Begin" }
            ]
          }
        ]
      },
      {
        value: "DeviceStatus",
        text: "Device Status",
        flags: [
          {
            value: "write",
            text: "read or write",
            options: [
              // { value: "t", text: "write" },
              { value: "f", text: "read" }
            ]
          }
        ]
      },
      {
        value: "RevisionID",
        text: "Read Revision ID",
        flags: [
          {
            value: "write",
            text: "read or write",
            options: [
              // { value: "t", text: "write" },
              { value: "f", text: "read" }
            ]
          }
        ]
      },
      {
        value: "GPIOControl",
        text: "GPIO Control",
        flags: [
          {
            value: "write",
            text: "read or write",
            options: [
              { value: "t", text: "write" },
              { value: "f", text: "read" }
            ]
          },
          {
            value: "",
            text: "ch3",
            options: [
              { value: "t", text: "standby" },
              { value: "f", text: "enabled" }
            ]
          },
          {
            value: "",
            text: "ch2",
            options: [
              { value: "t", text: "standby" },
              { value: "f", text: "enabled" }
            ]
          },
          {
            value: "",
            text: "ch1",
            options: [
              { value: "t", text: "standby" },
              { value: "f", text: "enabled" }
            ]
          },
          {
            value: "",
            text: "ch0",
            options: [
              { value: "t", text: "standby" },
              { value: "f", text: "enabled" }
            ]
          }
        ]
      },
      {
        value: "GPIOWriteData",
        text: "GPIO Write Data",
        flags: [
          {
            value: "write",
            text: "read or write",
            options: [
              { value: "t", text: "write" },
              { value: "f", text: "read" }
            ]
          },
          {
            value: "",
            text: "ch3",
            options: [
              { value: "t", text: "standby" },
              { value: "f", text: "enabled" }
            ]
          },
          {
            value: "",
            text: "ch2",
            options: [
              { value: "t", text: "standby" },
              { value: "f", text: "enabled" }
            ]
          },
          {
            value: "",
            text: "ch1",
            options: [
              { value: "t", text: "standby" },
              { value: "f", text: "enabled" }
            ]
          },
          {
            value: "",
            text: "ch0",
            options: [
              { value: "t", text: "standby" },
              { value: "f", text: "enabled" }
            ]
          }
        ]
      },
      {
        value: "GPIOReadData",
        text: "GPIO Read Data",
        flags: [
          {
            value: "write",
            text: "read or write",
            options: [
              { value: "t", text: "write" },
              { value: "f", text: "read" }
            ]
          },
          {
            value: "",
            text: "ch3",
            options: [
              { value: "t", text: "standby" },
              { value: "f", text: "enabled" }
            ]
          },
          {
            value: "",
            text: "ch2",
            options: [
              { value: "t", text: "standby" },
              { value: "f", text: "enabled" }
            ]
          },
          {
            value: "",
            text: "ch1",
            options: [
              { value: "t", text: "standby" },
              { value: "f", text: "enabled" }
            ]
          },
          {
            value: "",
            text: "ch0",
            options: [
              { value: "t", text: "standby" },
              { value: "f", text: "enabled" }
            ]
          }
        ]
      },
      {
        value: "readAll",
        text: "Start Reading",
        flags: [
          {
            value: "write",
            text: "read or write",
            options: [
              { value: "t", text: "write" },
              { value: "f", text: "read" }
            ]
          },
          {
            value: "",
            text: "ch3",
            options: [
              { value: "t", text: "standby" },
              { value: "f", text: "enabled" }
            ]
          },
          {
            value: "",
            text: "ch2",
            options: [
              { value: "t", text: "standby" },
              { value: "f", text: "enabled" }
            ]
          },
          {
            value: "",
            text: "ch1",
            options: [
              { value: "t", text: "standby" },
              { value: "f", text: "enabled" }
            ]
          },
          {
            value: "",
            text: "ch0",
            options: [
              { value: "t", text: "standby" },
              { value: "f", text: "enabled" }
            ]
          }
        ]
      },
      {
        value: "reset",
        text: "Reset ADC",
        flags: [
          {
            value: "write",
            text: "read or write",
            options: [
              { value: "t", text: "write" },
              { value: "f", text: "read" }
            ]
          }
        ]
      }
    ]
  })
});
</script>
