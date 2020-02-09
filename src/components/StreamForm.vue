<template>
  <v-container id="wrapper" class="d-flex flex-column justify-space-between">
    <v-row>
      <v-col cols="12">
        <v-textarea readonly :rows="rows" :value="streamData"></v-textarea>
      </v-col>
    </v-row>
    <v-form class="d-flex" id="form">
      <v-row class="">
        <v-col cols="6" md="4">
          <v-text-field label="File name" autofocus required></v-text-field>
        </v-col>
        <v-col cols="6" md="4">
          <v-text-field label="Delay (ms)" required></v-text-field>
        </v-col>
        <v-col cols="6" md="4">
          <v-text-field label="Duration (s)" required></v-text-field>
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
import axios from "@/plugins/axios";
import { AxiosError } from "axios";

export default {
  name: "StreamForm",
  data() {
    return {
      streamData: "",
      count: 0
    };
  },
  methods: {
    stream: function(this: any) {
      axios
        .post("/api/command", JSON.stringify(this.finalData))
        .then(() => {
          let conn = new WebSocket(
            "ws://" + window.location.host + "/api/readlive"
          );
          conn.onmessage = (event: MessageEvent) => {
            this.streamData += event.data + "\n";
          };
          conn.onclose = (event: CloseEvent) => {
            this.streamData += "connection closed\n";
            this.streamData += event.code;
            window.location.replace("/api/getfile");
          };
        })
        .catch((error: AxiosError<string>) => {
          this.streamData = error;
        });
    }
  },
  computed: {
    rows() {
      return 10;
    }
  }
};
</script>

<style lang="scss" scoped>
#wrapper {
  height: 100%;
}
</style>
