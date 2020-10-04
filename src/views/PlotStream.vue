<template>
  <v-container>
    <vue-plotly ref="plot" :data="data" :layout="layout" :options="options" />
    <v-form id="form" class="d-flex">
      <v-row class>
        <v-col cols="6" md="3">
          <v-text-field
            v-model.trim="form.file"
            label="File name"
            required
          ></v-text-field>
        </v-col>
        <v-col cols="6" md="3">
          <v-text-field
            v-model.number="form.skip"
            label="skip (# of packets)"
            required
          ></v-text-field>
        </v-col>
        <v-col cols="6" md="3">
          <v-text-field
            v-model.number="delay"
            label="update every (# of packets)"
            required
          ></v-text-field>
        </v-col>
        <v-col cols="6" md="3">
          <v-text-field
            v-model.number="form.duration"
            label="Duration (ms)"
            required
          ></v-text-field>
        </v-col>
        <v-col cols="12">
          <v-btn
            color="primary"
            type="submit"
            width="100%"
            @click.prevent="stream"
            >submit
          </v-btn>
        </v-col>
      </v-row>
    </v-form>
  </v-container>
</template>

<script>
import VuePlotly from "@statnett/vue-plotly";
import axios from "@/plugins/axios";

// eslint-disable-next-line no-unused-vars
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export default {
  name: "PlotStream",
  components: {
    VuePlotly
  },
  data() {
    return {
      i: 0,
      delay: 1,
      globalY: [],
      form: {
        file: "",
        skip: 1,
        duration: 1000
      },
      data: [
        {
          y: this.globalY,
          x: [],
          type: "scatter",
          name: "ADC0.0",
          marker: { color: "blue" }
        },
        {
          y: this.globalY,
          x: [],
          type: "scatter",
          name: "ADC0.1",
          marker: { color: "blue" }
        },
        {
          y: this.globalY,
          x: [],
          type: "scatter",
          name: "ADC0.2",
          marker: { color: "blue" }
        },
        {
          y: this.globalY,
          x: [],
          type: "scatter",
          name: "ADC0.3",
          marker: { color: "blue" }
        },
        {
          y: this.globalY,
          x: [],
          type: "scatter",
          name: "ADC1.0",
          marker: { color: "green" }
        },
        {
          y: this.globalY,
          x: [],
          type: "scatter",
          name: "ADC1.1",
          marker: { color: "green" }
        },
        {
          y: this.globalY,
          x: [],
          type: "scatter",
          name: "ADC1.2",
          marker: { color: "green" }
        },
        {
          y: this.globalY,
          x: [],
          type: "scatter",
          name: "ADC1.3",
          marker: { color: "green" }
        },
        {
          y: this.globalY,
          x: [],
          type: "scatter",
          name: "ADC2.0",
          marker: { color: "orange" }
        },
        {
          y: this.globalY,
          x: [],
          type: "scatter",
          name: "ADC2.1",
          marker: { color: "orange" }
        },
        {
          y: this.globalY,
          x: [],
          type: "scatter",
          name: "ADC2.2",
          marker: { color: "orange" }
        },
        {
          y: this.globalY,
          x: [],
          type: "scatter",
          name: "ADC2.3",
          marker: { color: "orange" }
        },
        {
          y: this.globalY,
          x: [],
          type: "scatter",
          name: "ADC3.0",
          marker: { color: "red" }
        },
        {
          y: this.globalY,
          x: [],
          type: "scatter",
          name: "ADC3.1",
          marker: { color: "red" }
        },
        {
          y: this.globalY,
          x: [],
          type: "scatter",
          name: "ADC3.2",
          marker: { color: "red" }
        },
        {
          y: this.globalY,
          x: [],
          type: "scatter",
          name: "ADC3.3",
          marker: { color: "red" }
        },
        {
          y: this.globalY,
          x: [],
          type: "scatter",
          name: "ADC5.0",
          marker: { color: "black" }
        },
        {
          y: this.globalY,
          x: [],
          type: "scatter",
          name: "ADC5.1",
          marker: { color: "black" }
        },
        {
          y: this.globalY,
          x: [],
          type: "scatter",
          name: "ADC5.2",
          marker: { color: "black" }
        },
        {
          y: this.globalY,
          x: [],
          type: "scatter",
          name: "ADC5.3",
          marker: { color: "black" }
        }
      ],
      layout: {
        // width: 320,
        // height: 240,
        title: "A Fancy Plot",
        yaxis: {
          visible: false,
          range: [110, -10]
        },
        xaxis: {
          visible: true
        }
      },
      options: {
        displayModeBar: true,
        displaylogo: false,
        responsive: false
      }
    };
  },
  methods: {
    stream: async function() {
      this.i = 0;
      this.data[0].x = Array(100);
      this.data[1].x = Array(100);
      this.data[2].x = Array(100);
      this.data[3].x = Array(100);
      this.data[4].x = Array(100);
      this.data[5].x = Array(100);
      this.data[6].x = Array(100);
      this.data[7].x = Array(100);
      this.data[8].x = Array(100);
      this.data[9].x = Array(100);
      this.data[10].x = Array(100);
      this.data[11].x = Array(100);
      this.data[12].x = Array(100);
      this.data[13].x = Array(100);
      this.data[14].x = Array(100);
      this.data[15].x = Array(100);
      this.data[16].x = Array(100);
      this.data[17].x = Array(100);
      this.data[18].x = Array(100);
      this.data[19].x = Array(100);
      this.data.globalY = Array(100);

      for (let i = 0; i < 100; i++) {
        this.data.globalY[i] = i;
        this.data[0].x[i] = 0;
        this.data[1].x[i] = 50000;
        this.data[2].x[i] = 100000;
        this.data[3].x[i] = 150000;
        this.data[4].x[i] = 200000;
        this.data[5].x[i] = 250000;
        this.data[6].x[i] = 300000;
        this.data[7].x[i] = 350000;
        this.data[8].x[i] = 400000;
        this.data[9].x[i] = 450000;
        this.data[10].x[i] = 500000;
        this.data[11].x[i] = 550000;
        this.data[12].x[i] = 600000;
        this.data[13].x[i] = 650000;
        this.data[14].x[i] = 700000;
        this.data[15].x[i] = 750000;
        this.data[16].x[i] = 800000;
        this.data[17].x[i] = 850000;
        this.data[18].x[i] = 900000;
        this.data[19].x[i] = 950000;
      }

      axios.post("/api/readlive", JSON.stringify(this.form)).then(() => {
        let conn = new WebSocket(
          "ws://" + window.location.host + "/api/readlive"
        );
        conn.binaryType = "arraybuffer";
        conn.onmessage = event => {
          // this.data.globalY[this.i] = this.i;
          if (this.i === 99) {
            this.i = 0;
          }
          let view = new Int32Array(event.data);
          this.data[0].x[this.i] = view[0];
          this.data[0].x[this.i + 1] = null;
          this.data[1].x[this.i] = view[1] + 50000;
          this.data[1].x[this.i + 1] = null;
          this.data[2].x[this.i] = view[2] + 100000;
          this.data[2].x[this.i + 1] = null;
          this.data[3].x[this.i] = view[3] + 150000;
          this.data[3].x[this.i + 1] = null;
          this.data[4].x[this.i] = view[4] + 200000;
          this.data[4].x[this.i + 1] = null;
          this.data[5].x[this.i] = view[5] + 250000;
          this.data[5].x[this.i + 1] = null;
          this.data[6].x[this.i] = view[6] + 300000;
          this.data[6].x[this.i + 1] = null;
          this.data[7].x[this.i] = view[7] + 350000;
          this.data[7].x[this.i + 1] = null;
          this.data[8].x[this.i] = view[8] + 400000;
          this.data[8].x[this.i + 1] = null;
          this.data[9].x[this.i] = view[9] + 450000;
          this.data[9].x[this.i + 1] = null;
          this.data[10].x[this.i] = view[10] + 500000;
          this.data[10].x[this.i + 1] = null;
          this.data[11].x[this.i] = view[11] + 550000;
          this.data[11].x[this.i + 1] = null;
          this.data[12].x[this.i] = view[12] + 600000;
          this.data[12].x[this.i + 1] = null;
          this.data[13].x[this.i] = view[13] + 650000;
          this.data[13].x[this.i + 1] = null;
          this.data[14].x[this.i] = view[14] + 700000;
          this.data[14].x[this.i + 1] = null;
          this.data[15].x[this.i] = view[15] + 750000;
          this.data[15].x[this.i + 1] = null;
          this.data[16].x[this.i] = view[16] + 800000;
          this.data[16].x[this.i + 1] = null;
          this.data[17].x[this.i] = view[17] + 850000;
          this.data[17].x[this.i + 1] = null;
          this.data[18].x[this.i] = view[18] + 900000;
          this.data[18].x[this.i + 1] = null;
          this.data[19].x[this.i] = view[19] + 950000;
          this.data[19].x[this.i + 1] = null;
          // this.$set(this.data[19].x, this.i, view[19] + 950000);
          this.i++;
        };
        conn.onclose = () => {
          // window.location.replace("/api/getfile");
          this.$set(this.data[19].x, this.i, 950000);
        };
      });
    }
  }
};
</script>

<style lang="scss" scoped></style>
