<template>
  <v-container id="wrapper" class="d-flex flex-column justify-space-between">
    <v-row>
      <v-col cols="12">
        <v-textarea
          id="streamArea"
          readonly
          :rows="rows"
          clearable
          no-resize
          :value="streamData"
        ></v-textarea>
      </v-col>
    </v-row>
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
import Vue from "vue";
import axios from "@/plugins/axios";
import { AxiosError } from "axios";

export default Vue.extend({
  name: "StreamForm",
  data() {
    return {
      form: {} as {
        file: string;
        skip: number;
        duration: number;
      },
      streamData: "",
      count: 0
    };
  },
  methods: {
    stream: function(this: any) {
      let streamArea = document.getElementById("streamArea") as HTMLElement;
      axios
        .post("/api/readlive", JSON.stringify(this.form))
        .then(() => {
          let conn = new WebSocket(
            "ws://" + window.location.host + "/api/readlive"
          );
          conn.onmessage = (event: MessageEvent) => {
            this.streamData += event.data + "\n";
            streamArea.scrollTop = streamArea.scrollHeight;
          };
          conn.onclose = (event: CloseEvent) => {
            this.streamData += "connection closed\n";
            this.streamData += event.code + "\n";
            streamArea.scrollTop = streamArea.scrollHeight;
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
});
</script>

<style lang="scss" scoped>
#wrapper {
  height: 100%;
}
</style>
