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
      <v-col>{{ sensor0.voltage.ch1 }}</v-col>
      <v-col>{{ sensor0.current.ch1 }}</v-col>
      <v-col></v-col>
    </v-row>
    <v-row>
      <v-col>Channel 2</v-col>
      <v-col>{{ sensor0.voltage.ch2 }}</v-col>
      <v-col>{{ sensor0.current.ch2 }}</v-col>
      <v-col></v-col>
    </v-row>
    <v-row>
      <v-col>Channel 3</v-col>
      <v-col>{{ sensor0.voltage.ch3 }}</v-col>
      <v-col>{{ sensor0.current.ch3 }}</v-col>
      <v-col></v-col>
    </v-row>
    <v-row>
      <v-col>Channel 4</v-col>
      <v-col>{{ sensor1.voltage.ch1 }}</v-col>
      <v-col>{{ sensor1.current.ch1 }}</v-col>
      <v-col></v-col>
    </v-row>
    <v-row>
      <v-col>Channel 5</v-col>
      <v-col>{{ sensor1.voltage.ch2 }}</v-col>
      <v-col>{{ sensor1.current.ch2 }}</v-col>
      <v-col></v-col>
    </v-row>
    <v-row>
      <v-col>Channel 6</v-col>
      <v-col>{{ sensor1.voltage.ch3 }}</v-col>
      <v-col>{{ sensor1.current.ch3 }}</v-col>
      <v-col></v-col>
    </v-row>
    <v-row>
      <v-col>Channel 7</v-col>
      <v-col>{{ sensor2.voltage.ch1 }}</v-col>
      <v-col>{{ sensor2.current.ch1 }}</v-col>
      <v-col></v-col>
    </v-row>
    <v-row>
      <v-col>Channel 8</v-col>
      <v-col>{{ sensor2.voltage.ch2 }}</v-col>
      <v-col>{{ sensor2.current.ch2 }}</v-col>
      <v-col></v-col>
    </v-row>
    <v-row>
      <v-col>Channel 9</v-col>
      <v-col>{{ sensor2.voltage.ch3 }}</v-col>
      <v-col>{{ sensor2.current.ch3 }}</v-col>
      <v-col></v-col>
    </v-row>
    <v-row>
      <v-col>Channel 10</v-col>
      <v-col>{{ sensor3.voltage.ch1 }}</v-col>
      <v-col>{{ sensor3.current.ch1 }}</v-col>
      <v-col></v-col>
    </v-row>
    <v-row>
      <v-col>Channel 11</v-col>
      <v-col>{{ sensor3.voltage.ch2 }}</v-col>
      <v-col>{{ sensor3.current.ch2 }}</v-col>
      <v-col></v-col>
    </v-row>
    <v-row>
      <v-col>Channel 12</v-col>
      <v-col>{{ sensor3.voltage.ch3 }}</v-col>
      <v-col>{{ sensor3.current.ch3 }}</v-col>
      <v-col></v-col>
    </v-row>
  </v-container>
</template>

<script>
const pause = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

import axios from "@/plugins/axios";

export default {
  name: "Info",
  data() {
    return {
      visible: true,
      sensor0: {
        voltage: {
          ch1: 0,
          ch2: 0,
          ch3: 0,
        },
        current: {
          ch1: 0,
          ch2: 0,
          ch3: 0,
        },
      },
      sensor1: {
        voltage: {
          ch1: 0,
          ch2: 0,
          ch3: 0,
        },
        current: {
          ch1: 0,
          ch2: 0,
          ch3: 0,
        },
      },
      sensor2: {
        voltage: {
          ch1: 0,
          ch2: 0,
          ch3: 0,
        },
        current: {
          ch1: 0,
          ch2: 0,
          ch3: 0,
        },
      },
      sensor3: {
        voltage: {
          ch1: 0,
          ch2: 0,
          ch3: 0,
        },
        current: {
          ch1: 0,
          ch2: 0,
          ch3: 0,
        },
      },
    };
  },
  async mounted() {
    while (this.visible) {
      axios.get("/api/info").then((resp) => {
        let data = resp.data;
        console.log(data);
        for (let i = 0; i < 4; i++) {
          let offset = i * 3;
          this["sensor" + i].voltage.ch1 = data.voltage[offset];
          this["sensor" + i].voltage.ch2 = data.voltage[1 + offset];
          this["sensor" + i].voltage.ch3 = data.voltage[2 + offset];
          this["sensor" + i].current.ch1 = data.current[offset];
          this["sensor" + i].current.ch2 = data.current[1 + offset];
          this["sensor" + i].current.ch3 = data.current[2 + offset];
        }
      });
      await pause(5000);
    }
  },
  beforeDestroy() {
    this.visible = false;
  },
};
</script>

<style scoped></style>
