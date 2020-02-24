<template>
  <v-container>
    <vue-plotly :data="data" :layout="layout" :options="options" />
    <v-form class="d-flex" id="form">
      <v-row class="">
        <v-col cols="6" md="4">
          <v-text-field
            label="File name"
            v-model.trim="form.file"
            autofocus
            required
          ></v-text-field>
        </v-col>
        <v-col cols="6" md="4">
          <v-text-field
            label="Delay (ms)"
            v-model.number="form.skip"
            required
          ></v-text-field>
        </v-col>
        <v-col cols="6" md="4">
          <v-text-field
            label="Duration (ms)"
            v-model.number="form.duration"
            required
          ></v-text-field>
        </v-col>
        <v-col cols="6" md="12">
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
      privateI: 1,
      form: { file: "", skip: 0, duration: 0 },
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
      let i = 1;
      let localX = [];
      let localY = [];
      axios.post("/api/readlive", JSON.stringify(this.form)).then(() => {
        let conn = new WebSocket(
          "ws://" + window.location.host + "/api/readlive"
        );
        conn.onmessage = event => {
          localX.push(i);
          localY.push(parseInt(event.data.split(",")[0]));
          if (i % 200 === 0) {
            this.data[0].x = localX;
            this.data[0].y = localY;
          }
          i++;
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
