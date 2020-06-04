<template>
  <v-container>
    <vue-plotly :data="data" :layout="layout" :options="options" />
    <v-form class="d-flex" id="form">
      <v-row class>
        <v-col cols="6" md="3">
          <v-text-field
            label="File name"
            v-model.trim="form.file"
            autofocus
            required
          ></v-text-field>
        </v-col>
        <v-col cols="6" md="3">
          <v-text-field
            label="skip (# of packets)"
            v-model.number="form.skip"
            required
          ></v-text-field>
        </v-col>
        <v-col cols="6" md="3">
          <v-text-field
            label="update every (# of packets)"
            v-model.number="delay"
            required
          ></v-text-field>
        </v-col>
        <v-col cols="6" md="3">
          <v-text-field
            label="Duration (ms)"
            v-model.number="form.duration"
            required
          ></v-text-field>
        </v-col>
        <v-col cols="12">
          <v-btn
            width="100%"
            type="submit"
            color="primary"
            @click.prevent="stream"
            >submit</v-btn
          >
        </v-col>
      </v-row>
    </v-form>
  </v-container>
</template>

<script>
import VuePlotly from "@statnett/vue-plotly";
import axios from "@/plugins/axios";
// function sleep(ms) {
//   return new Promise(resolve => setTimeout(resolve, ms));
// }
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
      form: { file: "", skip: 1, duration: 1000 },
      data: [
        {
          y: this.globalY,
          x: [],
          type: "scatter",
          name: "Ch0",
          marker: { color: "blue" }
        },
        {
          y: this.globalY,
          x: [],
          type: "scatter",
          name: "Ch1",
          marker: { color: "green" }
        },
        {
          y: this.globalY,
          x: [],
          type: "scatter",
          name: "Ch2",
          marker: { color: "orange" }
        },
        {
          y: this.globalY,
          x: [],
          type: "scatter",
          name: "Ch3",
          marker: { color: "red" }
        }
      ],
      layout: {
        // width: 320,
        // height: 240,
        title: "A Fancy Plot"
      },
      options: { displayModeBar: true }
    };
  },
  methods: {
    stream: function() {
      this.i = 0;
      this.data[0].x = [];
      this.data[1].x = [];
      this.data[2].x = [];
      this.data[3].x = [];
      this.data.globalY = [];
      let localX = [];
      let localY = [];
      if (process.env.NODE_ENV !== "production") {
        for (let _ = 0; _ < 500; _++) {
          this.data.globalY.push(this.i);
          this.data[0].x.push(parseInt(Math.random() * 100000));
          this.data[1].x.push(parseInt(Math.random() * 100000) + 500000);
          this.data[2].x.push(parseInt(Math.random() * 100000) + 1000000);
          this.data[3].x.push(parseInt(Math.random() * 100000) + 1500000);
          this.i++;
          // await sleep(10);
        }
        return;
      }
      axios.post("/api/readlive", JSON.stringify(this.form)).then(() => {
        let conn = new WebSocket(
          "ws://" + window.location.host + "/api/readlive"
        );
        conn.onmessage = event => {
          if (this.delay === 1) {
            this.data.globalY.push(this.i);
            this.data[0].x.push(parseInt(event.data.split(",")[0]));
            this.data[1].x.push(parseInt(event.data.split(",")[1]) + 500000);
            this.data[2].x.push(parseInt(event.data.split(",")[2]) + 1000000);
            this.data[3].x.push(parseInt(event.data.split(",")[3]) + 1500000);
            this.i++;
            return;
          }
          localY.push(this.i);
          localX.push(parseInt(event.data.split(",")[0]));
          if (this.i % this.delay === 0) {
            this.data[0].x.push(...localX.slice(this.i - this.delay));
            this.data[0].y.push(...localY.slice(this.i - this.delay));
          }
          this.i++;
        };
        conn.onclose = () => {
          window.location.replace("/api/getfile");
        };
      });
    }
  }
};
</script>

<style lang="scss" scoped></style>
