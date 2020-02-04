<template>
  <v-container id="wrapper" class="d-flex flex-column justify-space-between">
    <v-row>
      <v-col cols="12">
        <v-textarea readonly :rows="rows">{{ streamData }}</v-textarea>
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
        <v-col cols="6" sm="4">
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
export default {
  name: "StreamForm",
  methods: {
    stream: function() {
      console.log("begin!");
      let conn = new WebSocket("ws://192.168.43.28:9990/");
      conn.onmessage = (event: MessageEvent) => {
        // this += event.data + "\n";
      };
      conn.onclose = (event: CloseEvent) => {
        // streamData += "connection closed";
        window.location.replace("/getfile");
      };
    }
  },
  computed: {
    rows() {
      return 10;
    }
  },
  data: () => {
    return {
      streamData: ""
    };
  }
};
</script>

<style lang="scss" scoped>
#wrapper {
  height: 100%;
}
</style>
