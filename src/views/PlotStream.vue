<template>
  <v-container>
    <vue-plotly :data="data" :layout="layout" :options="options" />
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
          name: "Ch0.0",
          marker: { color: "blue" }
        },
        {
          y: this.globalY,
          x: [],
          type: "scatter",
          name: "Ch0.1",
          marker: { color: "blue" }
        },
        {
          y: this.globalY,
          x: [],
          type: "scatter",
          name: "Ch0.2",
          marker: { color: "blue" }
        },
        {
          y: this.globalY,
          x: [],
          type: "scatter",
          name: "Ch0.3",
          marker: { color: "blue" }
        },
        {
          y: this.globalY,
          x: [],
          type: "scatter",
          name: "Ch1.0",
          marker: { color: "green" }
        },
        {
          y: this.globalY,
          x: [],
          type: "scatter",
          name: "Ch1.1",
          marker: { color: "green" }
        },
        {
          y: this.globalY,
          x: [],
          type: "scatter",
          name: "Ch1.2",
          marker: { color: "green" }
        },
        {
          y: this.globalY,
          x: [],
          type: "scatter",
          name: "Ch1.3",
          marker: { color: "green" }
        },
        {
          y: this.globalY,
          x: [],
          type: "scatter",
          name: "Ch2.0",
          marker: { color: "orange" }
        },
        {
          y: this.globalY,
          x: [],
          type: "scatter",
          name: "Ch2.1",
          marker: { color: "orange" }
        },
        {
          y: this.globalY,
          x: [],
          type: "scatter",
          name: "Ch2.2",
          marker: { color: "orange" }
        },
        {
          y: this.globalY,
          x: [],
          type: "scatter",
          name: "Ch2.3",
          marker: { color: "orange" }
        },
        {
          y: this.globalY,
          x: [],
          type: "scatter",
          name: "Ch3.0",
          marker: { color: "red" }
        },
        {
          y: this.globalY,
          x: [],
          type: "scatter",
          name: "Ch3.1",
          marker: { color: "red" }
        },
        {
          y: this.globalY,
          x: [],
          type: "scatter",
          name: "Ch3.2",
          marker: { color: "red" }
        },
        {
          y: this.globalY,
          x: [],
          type: "scatter",
          name: "Ch3.3",
          marker: { color: "red" }
        },
        {
          y: this.globalY,
          x: [],
          type: "scatter",
          name: "Ch5.0",
          marker: { color: "black" }
        },
        {
          y: this.globalY,
          x: [],
          type: "scatter",
          name: "Ch5.1",
          marker: { color: "black" }
        },
        {
          y: this.globalY,
          x: [],
          type: "scatter",
          name: "Ch5.2",
          marker: { color: "black" }
        },
        {
          y: this.globalY,
          x: [],
          type: "scatter",
          name: "Ch5.3",
          marker: { color: "black" }
        }
      ],
      layout: {
        // width: 320,
        // height: 240,
        title: "A Fancy Plot",
        yaxis: {
          visible: false,
          range: [500, 0]
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
      this.data[0].x = Array(500);
      this.data[1].x = Array(500);
      this.data[2].x = Array(500);
      this.data[3].x = Array(500);
      this.data[4].x = Array(500);
      this.data.globalY = Array(500);

      for (let i = 0; i < 500; i++) {
        this.data.globalY[i] = i;
        this.data[0].x[i] = 0;
        this.data[1].x[i] = 500000;
        this.data[2].x[i] = 1000000;
        this.data[3].x[i] = 1500000;
        this.data[4].x[i] = 2000000;
      }

      axios.post("/api/readlive", JSON.stringify(this.form)).then(() => {
        let conn = new WebSocket(
          "ws://" + window.location.host + "/api/readlive"
        );
        conn.binaryType = "arraybuffer";
        conn.onmessage = event => {
          // this.data.globalY[this.i] = this.i;
          if (this.i === 500) {
            this.i = 0;
          }
          let view = new Int32Array(event.data);
          this.data[0].x[this.i] = view[0];
          this.data[1].x[this.i] = view[1] + 500000;
          this.data[2].x[this.i] = view[2] + 1000000;
          this.data[3].x[this.i] = view[3] + 1500000;
          this.data[4].x[this.i] = view[4] + 2000000;
          this.data[4].x.push();
          this.i++;
        };
        // conn.onclose = () => {
        //   window.location.replace("/api/getfile");
        // };
      });
    }
  }
};
</script>

<style lang="scss" scoped></style>
