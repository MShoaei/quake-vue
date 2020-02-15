<template>
  <v-container>
    <v-form @submit.prevent="submitForm">
      <v-row>
        <v-col cols="12" sm="5">
          <v-select
            label="Commands"
            :items="Commands"
            v-model="finalData.Command"
            @change="updateFlagsList"
          ></v-select>
        </v-col>
      </v-row>
      <v-row v-if="finalData.Command">
        <template v-if="!variableInput">
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
        </template>
        <template v-else>
          <v-col cols="3" md="2">
            <v-select
              :key="selectedFlags[0].value"
              :label="selectedFlags[0].text"
              :items="selectedFlags[0].options"
              v-model="finalData.Flags[0].Value"
            ></v-select>
          </v-col>
          <v-col cols="3" md="2">
            <v-text-field
              :label="selectedFlags[1].value"
              v-model.trim="finalData.Flags[1].Value"
              required
            ></v-text-field>
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
      const i = this.Commands.findIndex(
        f => f.value === this.finalData.Command
      );
      if (i === -1) {
        throw "cmd is undefined";
      }
      this.variableInput = false;
      cmd = this.Commands[i];
      if (i >= 18 && i <= 45) {
        this.variableInput = true;
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
    variableInput: false,

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
              { value: "2", text: "Median" },
              { value: "3", text: "Fast" }
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
              { value: "2", text: "MCLK/8" },
              { value: "3", text: "MCLK/4" }
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
        flags: []
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
        value: "PrechargeBuffer1",
        text: "Precharge buffer 1",
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
            value: "ch1-neg",
            text: "Ch1 prebuf negative enable",
            options: [
              { value: "0", text: "off" },
              { value: "1", text: "on (default)" }
            ]
          },
          {
            value: "ch1-pos",
            text: "Ch1 prebuf positive enable",
            options: [
              { value: "0", text: "off" },
              { value: "1", text: "on (default)" }
            ]
          },
          {
            value: "ch0-neg",
            text: "Ch0 prebuf negative enable",
            options: [
              { value: "0", text: "off" },
              { value: "1", text: "on (default)" }
            ]
          },
          {
            value: "ch0-pos",
            text: "Ch0 prebuf positive enable",
            options: [
              { value: "0", text: "off" },
              { value: "1", text: "on (default)" }
            ]
          }
        ]
      },
      {
        value: "PrechargeBuffer2",
        text: "Precharge buffer 2",
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
            value: "ch3-neg",
            text: "Ch3 prebuf negative enable",
            options: [
              { value: "0", text: "off" },
              { value: "1", text: "on (default)" }
            ]
          },
          {
            value: "ch3-pos",
            text: "Ch3 prebuf positive enable",
            options: [
              { value: "0", text: "off" },
              { value: "1", text: "on (default)" }
            ]
          },
          {
            value: "ch2-neg",
            text: "Ch2 prebuf negative enable",
            options: [
              { value: "0", text: "off" },
              { value: "1", text: "on (default)" }
            ]
          },
          {
            value: "ch2-pos",
            text: "Ch2 prebuf positive enable",
            options: [
              { value: "0", text: "off" },
              { value: "1", text: "on (default)" }
            ]
          }
        ]
      },
      {
        value: "PositiveRefPrechargeBuf",
        text: "Positive Reference Precharge Buffer",
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
              { value: "0", text: "off" },
              { value: "1", text: "on" }
            ]
          },
          {
            value: "ch2",
            text: "ch2",
            options: [
              { value: "0", text: "off" },
              { value: "1", text: "on" }
            ]
          },
          {
            value: "ch1",
            text: "ch1",
            options: [
              { value: "0", text: "off" },
              { value: "1", text: "on" }
            ]
          },
          {
            value: "ch0",
            text: "ch0",
            options: [
              { value: "0", text: "off" },
              { value: "1", text: "on" }
            ]
          }
        ]
      },
      {
        value: "NegativeRefPrechargeBuf",
        text: "Negative Reference Precharge Buffer",
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
              { value: "0", text: "off" },
              { value: "1", text: "on" }
            ]
          },
          {
            value: "ch2",
            text: "ch2",
            options: [
              { value: "0", text: "off" },
              { value: "1", text: "on" }
            ]
          },
          {
            value: "ch1",
            text: "ch1",
            options: [
              { value: "0", text: "off" },
              { value: "1", text: "on" }
            ]
          },
          {
            value: "ch0",
            text: "ch0",
            options: [
              { value: "0", text: "off" },
              { value: "1", text: "on" }
            ]
          }
        ]
      },
      {
        value: "Ch0OffsetMSB",
        text: "Ch0 offset MSB",
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
            value: "MSB",
            text: "MSB register",
            options: [{ value: "1", text: "MSB value" }]
          }
        ]
      },
      {
        value: "Ch0OffsetMid",
        text: "Ch0 offset Mid",
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
            value: "Mid",
            text: "Mid register",
            options: [{ value: "1", text: "Mid value" }]
          }
        ]
      },
      {
        value: "Ch0OffsetLSB",
        text: "Ch0 offset LSB",
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
            value: "LSB",
            text: "LSB register",
            options: [{ value: "1", text: "LSB value" }]
          }
        ]
      },
      {
        value: "Ch1OffsetMSB",
        text: "Ch1 offset MSB",
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
            value: "MSB",
            text: "MSB register",
            options: [{ value: "1", text: "MSB value" }]
          }
        ]
      },
      {
        value: "Ch1OffsetMid",
        text: "Ch1 offset Mid",
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
            value: "Mid",
            text: "Mid register",
            options: [{ value: "1", text: "Mid value" }]
          }
        ]
      },
      {
        value: "Ch1OffsetLSB",
        text: "Ch1 offset LSB",
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
            value: "LSB",
            text: "LSB register",
            options: [{ value: "1", text: "LSB value" }]
          }
        ]
      },
      {
        value: "Ch2OffsetMSB",
        text: "Ch2 offset MSB",
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
            value: "MSB",
            text: "MSB register",
            options: [{ value: "1", text: "MSB value" }]
          }
        ]
      },
      {
        value: "Ch2OffsetMid",
        text: "Ch2 offset Mid",
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
            value: "Mid",
            text: "Mid register",
            options: [{ value: "1", text: "Mid value" }]
          }
        ]
      },
      {
        value: "Ch2OffsetLSB",
        text: "Ch2 offset LSB",
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
            value: "LSB",
            text: "LSB register",
            options: [{ value: "1", text: "LSB value" }]
          }
        ]
      },
      {
        value: "Ch3OffsetMSB",
        text: "Ch3 offset MSB",
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
            value: "MSB",
            text: "MSB register",
            options: [{ value: "1", text: "MSB value" }]
          }
        ]
      },
      {
        value: "Ch3OffsetMid",
        text: "Ch3 offset Mid",
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
            value: "Mid",
            text: "Mid register",
            options: [{ value: "1", text: "Mid value" }]
          }
        ]
      },
      {
        value: "Ch3OffsetLSB",
        text: "Ch3 offset LSB",
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
            value: "LSB",
            text: "LSB register",
            options: [{ value: "1", text: "LSB value" }]
          }
        ]
      },
      {
        value: "Ch0GainMSB",
        text: "Ch0 gain MSB",
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
            value: "MSB",
            text: "MSB register",
            options: [{ value: "1", text: "MSB value" }]
          }
        ]
      },
      {
        value: "Ch0GainMid",
        text: "Ch0 gain Mid",
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
            value: "Mid",
            text: "Mid register",
            options: [{ value: "1", text: "Mid value" }]
          }
        ]
      },
      {
        value: "Ch0GainLSB",
        text: "Ch0 gain LSB",
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
            value: "LSB",
            text: "LSB register",
            options: [{ value: "1", text: "LSB value" }]
          }
        ]
      },
      {
        value: "Ch1GainMSB",
        text: "Ch1 gain MSB",
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
            value: "MSB",
            text: "MSB register",
            options: [{ value: "1", text: "MSB value" }]
          }
        ]
      },
      {
        value: "Ch1GainMid",
        text: "Ch1 gain Mid",
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
            value: "Mid",
            text: "Mid register",
            options: [{ value: "1", text: "Mid value" }]
          }
        ]
      },
      {
        value: "Ch1GainLSB",
        text: "Ch1 gain LSB",
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
            value: "LSB",
            text: "LSB register",
            options: [{ value: "1", text: "LSB value" }]
          }
        ]
      },
      {
        value: "Ch2GainMSB",
        text: "Ch2 gain MSB",
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
            value: "MSB",
            text: "MSB register",
            options: [{ value: "1", text: "MSB value" }]
          }
        ]
      },
      {
        value: "Ch2GainMid",
        text: "Ch2 gain Mid",
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
            value: "Mid",
            text: "Mid register",
            options: [{ value: "1", text: "Mid value" }]
          }
        ]
      },
      {
        value: "Ch2GainLSB",
        text: "Ch2 gain LSB",
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
            value: "LSB",
            text: "LSB register",
            options: [{ value: "1", text: "LSB value" }]
          }
        ]
      },
      {
        value: "Ch3GainMSB",
        text: "Ch3 gain MSB",
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
            value: "MSB",
            text: "MSB register",
            options: [{ value: "1", text: "MSB value" }]
          }
        ]
      },
      {
        value: "Ch3GainMid",
        text: "Ch3 gain Mid",
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
            value: "Mid",
            text: "Mid register",
            options: [{ value: "1", text: "Mid value" }]
          }
        ]
      },
      {
        value: "Ch3GainLSB",
        text: "Ch3 gain LSB",
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
            value: "LSB",
            text: "LSB register",
            options: [{ value: "1", text: "LSB value" }]
          }
        ]
      },
      {
        value: "Ch0SyncOffset",
        text: "Ch0 sync phase offset",
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
            value: "offset",
            text: "offset register",
            options: [{ value: "1", text: "offset value" }]
          }
        ]
      },
      {
        value: "Ch1SyncOffset",
        text: "Ch1 sync phase offset",
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
            value: "offset",
            text: "offset register",
            options: [{ value: "1", text: "offset value" }]
          }
        ]
      },
      {
        value: "Ch2SyncOffset",
        text: "Ch2 sync phase offset",
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
            value: "offset",
            text: "offset register",
            options: [{ value: "1", text: "offset value" }]
          }
        ]
      },
      {
        value: "Ch3SyncOffset",
        text: "Ch3 sync phase offset",
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
            value: "offset",
            text: "offset register",
            options: [{ value: "1", text: "offset value" }]
          }
        ]
      },
      {
        value: "readAll",
        text: "read All registers",
        flags: []
      },
      {
        value: "HardReset",
        text: "Reset ADC",
        flags: []
      }
    ]
  })
});
</script>
