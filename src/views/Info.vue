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
// const pause = ms => new Promise(resolve => setTimeout(resolve, ms));

export default {
  name: "Info",
  data() {
    return {
      sensor0: {
        voltage: {
          ch1: 0,
          ch2: 0,
          ch3: 0
        },
        current: {
          ch1: 0,
          ch2: 0,
          ch3: 0
        }
      },
      sensor1: {
        voltage: {
          ch1: 0,
          ch2: 0,
          ch3: 0
        },
        current: {
          ch1: 0,
          ch2: 0,
          ch3: 0
        }
      },
      sensor2: {
        voltage: {
          ch1: 0,
          ch2: 0,
          ch3: 0
        },
        current: {
          ch1: 0,
          ch2: 0,
          ch3: 0
        }
      },
      sensor3: {
        voltage: {
          ch1: 0,
          ch2: 0,
          ch3: 0
        },
        current: {
          ch1: 0,
          ch2: 0,
          ch3: 0
        }
      }
    };
  },
  async mounted() {
    this.conn = new WebSocket("ws://" + window.location.host + "/api/info");
    this.conn.onmessage = event => {
      let data = JSON.parse(event.data);
      console.log(data);
      for (let i = 0; i < 4; i++) {
        let offset = i * 3;
        console.log(this["sensor" + i].voltage);
        this["sensor" + i].voltage.ch1 = data.voltage[offset];
        this["sensor" + i].voltage.ch2 = data.voltage[1 + offset];
        this["sensor" + i].voltage.ch3 = data.voltage[2 + offset];
        this["sensor" + i].current.ch1 = data.current[offset];
        this["sensor" + i].current.ch2 = data.current[1 + offset];
        this["sensor" + i].current.ch3 = data.current[2 + offset];
        console.log(this["sensor" + i].voltage);
      }
    };
    this.conn.onclose = () => {
      console.log("websocket connection closed");
    };
    // let i = 0;
    // for (let j = 0; j < 100; j++) {
    //   this["sensor" + i].voltage.ch1 = this["sensor" + i].voltage.ch1 + 1;
    //   await pause(500);
    // }
  },
  beforeDestroy() {
    console.log("before destroy");
    if (this.conn.readyState === WebSocket.OPEN) {
      this.conn.close();
    }
  }
};
</script>

<style scoped></style>
