<template>
  <v-container>
    <Plotly :data="data" :layout="layout" :displayModeBar="true"></Plotly>
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

<script lang="ts">
import Plotly from "vue-plotly.js";
import axios from "@/plugins/axios";
import { AxiosError } from "axios";

export default {
  name: "PlotStream",
  components: {
    Plotly
  },
  data() {
    return {
      form: {} as {
        file: string;
        skip: number;
        duration: number;
      },
      data: [
        {
          type: "scatter",
          mode: "lines+points",
          x: [],

          y: [],
          marker: { color: "red" }
        }
      ],
      layout: {
        // width: 320,
        // height: 240,
        title: "A Fancy Plot"
      }
    };
  },
  methods: {
    stream: function(this: any) {
      let i = 1;
      axios
        .post("/api/readlive", JSON.stringify(this.form))
        .then(() => {
          let conn = new WebSocket(
            "ws://" + window.location.host + "/api/readlive"
          );
          conn.onmessage = (event: MessageEvent) => {
            this.data.x.push(i);
            this.data.y.push(parseInt(event.data.split(",")[0]));
          };
          conn.onclose = () => {
            window.location.replace("/api/getfile");
          };
        })
        .catch((error: AxiosError<string>) => {
          this.streamData = error;
        });
    }
  }
};
</script>

<style lang="scss" scoped></style>
