<template>
  <v-container>
    <template v-for="(c, index) in Commands">
      <v-form
        :key="index"
        @submit.prevent="
          c.value === 'ChStandby' || c.value === 'ChModeSel'
            ? submitChCommand(
                c.value,
                selectedADC[index],
                Commands[index].postData
              )
            : submitForm(c.value, selectedADC[index], Commands[index].postData)
        "
      >
        <v-row>
          <v-col class="d-flex align-center" cols="1">
            <div class="body-1 " v-text="c.value"></div>
          </v-col>
          <v-col cols="1">
            <v-select
              v-model="selectedADC[index]"
              :items="['all', '1', '2', '3', '4', '5', '6', '7', '8', '9']"
              label="ADC"
            >
            </v-select>
          </v-col>
          <template v-for="(f, fIndex) in Commands[index].flags">
            <v-col :key="fIndex" cols="1">
              <v-select
                :key="f.value"
                :label="f.text"
                :items="f.options"
                @change="val => (Commands[index].postData[f.value] = val)"
              ></v-select>
            </v-col>
          </template>
          <v-col cols="1">
            <v-btn :loading="loading" color="primary" type="submit"
              >submit</v-btn
            >
          </v-col>
        </v-row>
      </v-form>
    </template>
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

<script>
import Vue from "vue";
import axios from "@/plugins/axios";

export default Vue.extend({
  name: "CommandForm",
  methods: {
    submitForm: function(command, adc, data) {
      this.loading = true;
      axios
        .post("/api/command/" + command + "/" + adc, data)
        .then(response => {
          this.commandResponse =
            response.data.message +
            " " +
            "tx: " +
            response.data.tx +
            " rx: " +
            response.data.rx;
          this.errorResponse = false;
        })
        .catch(error => {
          this.commandResponse = error.message;
          this.errorResponse = true;
        });
      this.loading = false;
    },
    submitChCommand: function(command, adc, data) {
      let channels = [true, true, true, true, true, true, true, true];
      for (let i = 0; i < 8; i++) {
        channels[i] = data["ch" + i.toString()];
      }
      this.submitForm(command, adc, {
        write: data.write,
        channels: channels
      });
    }
  },
  data: () => ({
    adcSelectValues: ["all", "1", "2", "3", "4", "5", "6", "7", "8", "9"],
    selectedADC: [
      "all",
      "all",
      "all",
      "all",
      "all",
      "all",
      "all",
      "all",
      "all",
      "all",
      "all",
      "all",
      "all",
      "all",
      "all",
      "all",
      "all",
      "all",
      "all",
      "all",
      "all",
      "all",
      "all"
    ],
    loading: false,
    commandResponse: "",
    errorResponse: false,
    variableInput: false,

    Commands: [
      {
        value: "ChStandby",
        text: "Channel Standby",
        flags: [
          {
            value: "write",
            text: "read or write",
            options: [
              { value: true, text: "write" },
              { value: false, text: "read" }
            ]
          },
          {
            value: "ch7",
            text: "ch7",
            options: [
              { value: true, text: "standby" },
              { value: false, text: "enabled" }
            ]
          },
          {
            value: "ch6",
            text: "ch6",
            options: [
              { value: true, text: "standby" },
              { value: false, text: "enabled" }
            ]
          },
          {
            value: "ch5",
            text: "ch5",
            options: [
              { value: true, text: "standby" },
              { value: false, text: "enabled" }
            ]
          },
          {
            value: "ch4",
            text: "ch4",
            options: [
              { value: true, text: "standby" },
              { value: false, text: "enabled" }
            ]
          },
          {
            value: "ch3",
            text: "ch3",
            options: [
              { value: true, text: "standby" },
              { value: false, text: "enabled" }
            ]
          },
          {
            value: "ch2",
            text: "ch2",
            options: [
              { value: true, text: "standby" },
              { value: false, text: "enabled" }
            ]
          },
          {
            value: "ch1",
            text: "ch1",
            options: [
              { value: true, text: "standby" },
              { value: false, text: "enabled" }
            ]
          },
          {
            value: "ch0",
            text: "ch0",
            options: [
              { value: true, text: "standby" },
              { value: false, text: "enabled" }
            ]
          }
        ],
        postData: {}
      },
      {
        value: "ChModeA",
        text: "Channel Mode A",
        flags: [
          {
            value: "write",
            text: "read or write",
            options: [
              { value: true, text: "write" },
              { value: false, text: "read" }
            ]
          },
          {
            value: "f-type",
            text: "filter type",
            options: [
              { value: 0, text: "wideband" },
              { value: 1, text: "sinc5" }
            ]
          },
          {
            value: "dec-rate",
            text: "decimation rate",
            options: [
              { value: 32, text: "x32" },
              { value: 64, text: "x64" },
              { value: 128, text: "x128" },
              { value: 256, text: "x256" },
              { value: 512, text: "x512" },
              { value: 1024, text: "x1024" }
            ]
          }
        ],
        postData: {}
      },
      {
        value: "ChModeB",
        text: "Channel Mode B",
        flags: [
          {
            value: "write",
            text: "read or write",
            options: [
              { value: true, text: "write" },
              { value: false, text: "read" }
            ]
          },
          {
            value: "f-type",
            text: "filter type",
            options: [
              { value: 0, text: "wideband" },
              { value: 1, text: "sinc5" }
            ]
          },
          {
            value: "dec-rate",
            text: "decimation rate",
            options: [
              { value: 32, text: "x32" },
              { value: 64, text: "x64" },
              { value: 128, text: "x128" },
              { value: 256, text: "x256" },
              { value: 512, text: "x512" },
              { value: 1024, text: "x1024" }
            ]
          }
        ],
        postData: {}
      },
      {
        value: "ChModeSel",
        text: "Select Channel Mode",
        flags: [
          {
            value: "write",
            text: "read or write",
            options: [
              { value: true, text: "write" },
              { value: false, text: "read" }
            ]
          },
          {
            value: "ch7",
            text: "ch7 Mode",
            options: [
              { value: 0, text: "Mode A" },
              { value: 1, text: "Mode B" }
            ]
          },
          {
            value: "ch6",
            text: "ch6 Mode",
            options: [
              { value: 0, text: "Mode A" },
              { value: 1, text: "Mode B" }
            ]
          },
          {
            value: "ch5",
            text: "ch5 Mode",
            options: [
              { value: 0, text: "Mode A" },
              { value: 1, text: "Mode B" }
            ]
          },
          {
            value: "ch4",
            text: "ch4 Mode",
            options: [
              { value: 0, text: "Mode A" },
              { value: 1, text: "Mode B" }
            ]
          },
          {
            value: "ch3",
            text: "ch3 Mode",
            options: [
              { value: 0, text: "Mode A" },
              { value: 1, text: "Mode B" }
            ]
          },
          {
            value: "ch2",
            text: "ch2 Mode",
            options: [
              { value: 0, text: "Mode A" },
              { value: 1, text: "Mode B" }
            ]
          },
          {
            value: "ch1",
            text: "ch1 Mode",
            options: [
              { value: 0, text: "Mode A" },
              { value: 1, text: "Mode B" }
            ]
          },
          {
            value: "ch0",
            text: "ch0 Mode",
            options: [
              { value: 0, text: "Mode A" },
              { value: 1, text: "Mode B" }
            ]
          }
        ],
        postData: {}
      },
      {
        value: "PowerMode",
        text: "Power Mode",
        flags: [
          {
            value: "write",
            text: "read or write",
            options: [
              { value: true, text: "write" },
              { value: false, text: "read" }
            ]
          },
          {
            value: "sleep",
            text: "Sleep mode",
            options: [
              { value: 0, text: "Normal Operation" },
              { value: 1, text: "Sleep Mode" }
            ]
          },
          {
            value: "power",
            text: "Power Mode",
            options: [
              { value: 0, text: "Low Power" },
              { value: 2, text: "Median" },
              { value: 3, text: "Fast" }
            ]
          },
          {
            value: "lvds-clk",
            text: "LVDS Enable",
            options: [
              { value: 0, text: "disable" },
              { value: 1, text: "enable" }
            ]
          },
          {
            value: "mclk-div",
            text: "MCLK Div",
            options: [
              { value: 0, text: "MCLK/32" },
              { value: 2, text: "MCLK/8" },
              { value: 3, text: "MCLK/4" }
            ]
          }
        ],
        postData: {}
      },
      {
        value: "GeneralConf",
        text: "General Configuration",
        flags: [
          {
            value: "write",
            text: "read or write",
            options: [
              { value: true, text: "write" },
              { value: false, text: "read" }
            ]
          },
          {
            value: "retime-en",
            text: "retime enable bit",
            options: [
              { value: 0, text: "enable" },
              { value: 1, text: "disable" }
            ]
          },
          {
            value: "vcm-pd",
            text: "VCM buffer power-down",
            options: [
              { value: 0, text: "enabled" },
              { value: 1, text: "powered down" }
            ]
          },
          {
            value: "vcm-vsel",
            text: "VCM voltage",
            options: [
              { value: 0, text: "(AVDD1 − AVSS)/2 V" },
              { value: 1, text: "1.65 V" },
              { value: 2, text: "2.5 V" },
              { value: 3, text: "2.14 V" }
            ]
          }
        ],
        postData: {}
      },
      {
        value: "DataControl",
        text: "Data Control",
        flags: [
          {
            value: "write",
            text: "read or write",
            options: [
              { value: true, text: "write" },
              { value: false, text: "read" }
            ]
          },
          {
            value: "spi-sync",
            text: "SPI sync",
            options: [
              { value: 0, text: "SPI_SYNC low" },
              { value: 1, text: "SPI_SYNC high" }
            ]
          },
          {
            value: "single-shot",
            text: "One-shot mode",
            options: [
              { value: 0, text: "disabled" },
              { value: 1, text: "enabled" }
            ]
          }
        ],
        postData: {}
      },
      {
        value: "InterfaceConf",
        text: "Interface Configuration",
        flags: [
          {
            value: "write",
            text: "read or write",
            options: [
              { value: true, text: "write" },
              { value: false, text: "read" }
            ]
          },
          {
            value: "crc-sel",
            text: "CRC select",
            options: [
              { value: 0, text: "No CRC" },
              { value: 1, text: "every 4 samples" },
              { value: 2, text: "every 16 samples" }
            ]
          },
          {
            value: "dclk-div",
            text: "DCLK divider",
            options: [
              { value: 0, text: "Divide by 8" },
              { value: 1, text: "Divide by 4" },
              { value: 2, text: "Divide by 2" },
              { value: 3, text: "No division" }
            ]
          }
        ],
        postData: {}
      },
      {
        value: "BISTControl",
        text: "BIST Control",
        flags: [
          {
            value: "write",
            text: "read or write",
            options: [
              { value: true, text: "write" },
              { value: false, text: "read" }
            ]
          },
          {
            value: "ram-bist-start",
            text: "RAM BIST",
            options: [
              { value: 0, text: "Off" },
              { value: 1, text: "Begin" }
            ]
          }
        ],
        postData: {}
      },
      {
        value: "DeviceStatus",
        text: "Device Status",
        flags: [
          {
            value: "write",
            text: "read or write",
            options: [
              // { value: true, text: "write" },
              { value: false, text: "read" }
            ]
          }
        ],
        postData: {}
      },
      {
        value: "RevisionID",
        text: "Read Revision ID",
        flags: []
      },
      {
        value: "ChOffset",
        text: "Channel offset",
        flags: [
          {
            value: "write",
            text: "read or write",
            options: [
              { value: true, text: "write" },
              { value: false, text: "read" }
            ]
          },
          {
            value: "Channel",
            text: "Channel",
            options: [
              { value: 0, text: "Channel 0" },
              { value: 0, text: "Channel 1" },
              { value: 0, text: "Channel 2" },
              { value: 0, text: "Channel 3" },
              { value: 0, text: "Channel 4" },
              { value: 0, text: "Channel 5" },
              { value: 0, text: "Channel 6" },
              { value: 0, text: "Channel 7" }
            ]
          },
          {
            value: "MSB",
            text: "MSB register",
            options: [{ value: 0, text: "MSB value" }]
          },
          {
            value: "Mid",
            text: "Mid register",
            options: [{ value: 0, text: "Mid value" }]
          },
          {
            value: "LSB",
            text: "LSB register",
            options: [{ value: 0, text: "LSB value" }]
          }
        ],
        postData: {}
      },
      {
        value: "ChGain",
        text: "Channel gain",
        flags: [
          {
            value: "write",
            text: "read or write",
            options: [
              { value: true, text: "write" },
              { value: false, text: "read" }
            ]
          },
          {
            value: "Channel",
            text: "Channel",
            options: [{ value: 0, text: "Channel" }]
          },
          {
            value: "MSB",
            text: "MSB register",
            options: [{ value: 0, text: "MSB value" }]
          },
          {
            value: "Mid",
            text: "Mid register",
            options: [{ value: 0, text: "Mid value" }]
          },
          {
            value: "LSB",
            text: "LSB register",
            options: [{ value: 0, text: "LSB value" }]
          }
        ],
        postData: {}
      },
      {
        value: "ChSyncOffset",
        text: "Channel sync phase offset",
        flags: [
          {
            value: "write",
            text: "read or write",
            options: [
              { value: true, text: "write" },
              { value: false, text: "read" }
            ]
          },
          {
            value: "Channel",
            text: "Channel",
            options: [{ value: "0", text: "Channel" }]
          },
          {
            value: "offset",
            text: "offset register",
            options: [{ value: "1", text: "offset value" }]
          }
        ],
        postData: {}
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
