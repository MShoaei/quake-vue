<template>
  <v-container>
    <vue-plotly :data="data" :layout="layout" :options="options" />
    <v-form class="d-flex" id="form">
      <v-row class="">
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

export default {
  name: "PlotStream",
  components: {
    VuePlotly
  },
  data() {
    return {
      i: 0,
      delay: 1,
      form: { file: "", skip: 1, duration: 1000 },
      data: [
        {
          x: [],
          y: [],
          type: "scatter",
          marker: { color: "blue" }
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
      this.data[0].y = [];
      let localX = [];
      let localY = [];
      axios.post("/api/readlive", JSON.stringify(this.form)).then(() => {
        let conn = new WebSocket(
          "ws://" + window.location.host + "/api/readlive"
        );
        conn.onmessage = event => {
          localX.push(this.i);
          localY.push(parseInt(event.data.split(",")[0]));
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
