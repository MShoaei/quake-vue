<template>
  <v-container>
    <v-row>
      <v-col></v-col>
      <v-col>Voltage</v-col>
      <v-col>Current</v-col>
      <v-col>Description</v-col>
    </v-row>
    <v-row>
      <v-col>Channel 1</v-col>
      <v-col>{{ sensors[0].voltage[0] }}</v-col>
      <v-col>{{ sensors[0].current[0] }}</v-col>
      <v-col></v-col>
    </v-row>
    <v-row>
      <v-col>Channel 2</v-col>
      <v-col>{{ sensors[0].voltage[1] }}</v-col>
      <v-col>{{ sensors[0].current[1] }}</v-col>
      <v-col></v-col>
    </v-row>
    <v-row>
      <v-col>Channel 3</v-col>
      <v-col>{{ sensors[0].voltage[2] }}</v-col>
      <v-col>{{ sensors[0].current[2] }}</v-col>
      <v-col></v-col>
    </v-row>
    <v-row>
      <v-col>Channel 4</v-col>
      <v-col>{{ sensors[1].voltage[0] }}</v-col>
      <v-col>{{ sensors[1].current[0] }}</v-col>
      <v-col></v-col>
    </v-row>
    <v-row>
      <v-col>Channel 5</v-col>
      <v-col>{{ sensors[1].voltage[1] }}</v-col>
      <v-col>{{ sensors[1].current[1] }}</v-col>
      <v-col></v-col>
    </v-row>
    <v-row>
      <v-col>Channel 6</v-col>
      <v-col>{{ sensors[1].voltage[2] }}</v-col>
      <v-col>{{ sensors[1].current[2] }}</v-col>
      <v-col></v-col>
    </v-row>
    <v-row>
      <v-col>Channel 7</v-col>
      <v-col>{{ sensors[2].voltage[0] }}</v-col>
      <v-col>{{ sensors[2].current[0] }}</v-col>
      <v-col></v-col>
    </v-row>
    <v-row>
      <v-col>Channel 8</v-col>
      <v-col>{{ sensors[2].voltage[1] }}</v-col>
      <v-col>{{ sensors[2].current[1] }}</v-col>
      <v-col></v-col>
    </v-row>
    <v-row>
      <v-col>Channel 9</v-col>
      <v-col>{{ sensors[2].voltage[2] }}</v-col>
      <v-col>{{ sensors[2].current[2] }}</v-col>
      <v-col></v-col>
    </v-row>
    <v-row>
      <v-col>Channel 10</v-col>
      <v-col>{{ sensors[3].voltage[0] }}</v-col>
      <v-col>{{ sensors[3].current[0] }}</v-col>
      <v-col></v-col>
    </v-row>
    <v-row>
      <v-col>Channel 11</v-col>
      <v-col>{{ sensors[3].voltage[1] }}</v-col>
      <v-col>{{ sensors[3].current[1] }}</v-col>
      <v-col></v-col>
    </v-row>
    <v-row>
      <v-col>Channel 12</v-col>
      <v-col
        ><p>{{ sensors[3].voltage[2] }}</p></v-col
      >
      <v-col>{{ sensors[3].current[2] }}</v-col>
      <v-col></v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: "Info",
  data() {
    return {
      sensors: [
        { voltage: [0, 0, 0], current: [0, 0, 0] },
        { voltage: [0, 0, 0], current: [0, 0, 0] },
        { voltage: [0, 0, 0], current: [0, 0, 0] },
        { voltage: [0, 0, 0], current: [0, 0, 0] }
      ]
    };
  },
  mounted() {
    let conn = new WebSocket("ws://" + window.location.host + "/api/info");
    conn.onmessage = event => {
      console.log(event.data);
    };
    conn.onclose = () => {
      console.log("websocket connection closed");
    };
  }
};
</script>

<style scoped></style>
