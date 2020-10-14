<template>
  <div>
    <vue-plotly ref="plot" :data="data" :layout="layout" :options="options" />
  </div>
</template>

<script>
import VuePlotly from "@statnett/vue-plotly";
import axios from "@/plugins/axios";

// eslint-disable-next-line no-unused-vars
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

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
      form: {
        file: "",
        skip: 1,
        duration: 1000
      },
      data: [
        {
          y: this.globalY,
          x: [],
          type: "scatter",
          name: "ADC0.0",
          marker: { color: "blue" }
        },
        {
          y: this.globalY,
          x: [],
          type: "scatter",
          name: "ADC0.1",
          marker: { color: "blue" }
        },
        {
          y: this.globalY,
          x: [],
          type: "scatter",
          name: "ADC0.2",
          marker: { color: "blue" }
        },
        {
          y: this.globalY,
          x: [],
          type: "scatter",
          name: "ADC0.3",
          marker: { color: "blue" }
        },
        {
          y: this.globalY,
          x: [],
          type: "scatter",
          name: "ADC1.0",
          marker: { color: "green" }
        },
        {
          y: this.globalY,
          x: [],
          type: "scatter",
          name: "ADC1.1",
          marker: { color: "green" }
        },
        {
          y: this.globalY,
          x: [],
          type: "scatter",
          name: "ADC1.2",
          marker: { color: "green" }
        },
        {
          y: this.globalY,
          x: [],
          type: "scatter",
          name: "ADC1.3",
          marker: { color: "green" }
        },
        {
          y: this.globalY,
          x: [],
          type: "scatter",
          name: "ADC2.0",
          marker: { color: "orange" }
        },
        {
          y: this.globalY,
          x: [],
          type: "scatter",
          name: "ADC2.1",
          marker: { color: "orange" }
        },
        {
          y: this.globalY,
          x: [],
          type: "scatter",
          name: "ADC2.2",
          marker: { color: "orange" }
        },
        {
          y: this.globalY,
          x: [],
          type: "scatter",
          name: "ADC2.3",
          marker: { color: "orange" }
        },
        {
          y: this.globalY,
          x: [],
          type: "scatter",
          name: "ADC3.0",
          marker: { color: "red" }
        },
        {
          y: this.globalY,
          x: [],
          type: "scatter",
          name: "ADC3.1",
          marker: { color: "red" }
        },
        {
          y: this.globalY,
          x: [],
          type: "scatter",
          name: "ADC3.2",
          marker: { color: "red" }
        },
        {
          y: this.globalY,
          x: [],
          type: "scatter",
          name: "ADC3.3",
          marker: { color: "red" }
        },
        {
          y: this.globalY,
          x: [],
          type: "scatter",
          name: "ADC5.0",
          marker: { color: "black" }
        },
        {
          y: this.globalY,
          x: [],
          type: "scatter",
          name: "ADC5.1",
          marker: { color: "black" }
        },
        {
          y: this.globalY,
          x: [],
          type: "scatter",
          name: "ADC5.2",
          marker: { color: "black" }
        },
        {
          y: this.globalY,
          x: [],
          type: "scatter",
          name: "ADC5.3",
          marker: { color: "black" }
        }
      ],
      layout: {
        // width: 320,
        height: 800,
        autosize: true,
        hovermode: false,
        dragmode: "pan",
        transition: {
          duration: 0
        },
        title: "A Fancy Plot",
        yaxis: {
          visible: true
        },
        xaxis: {
          visible: true,
          range: [-10000000, 10000000]
        }
      },
      options: {
        displayModeBar: true,
        displaylogo: false,
        responsive: true,
        autoScale: false,
        doubleClickDelay: 1,
        modeBarButtonsToRemove: [
          "toImage",
          "autoScale2d",
          "zoomIn2d",
          "zoomOut2d",
          "toggleSpikelines",
          "hoverCompareCartesian"
        ]
      }
    };
  },
  methods: {
    stream: async function() {
      axios
        .post("/api/readlive", JSON.stringify(this.form))
        .then(resp => {
          console.log(resp.data.size);

          let size = resp.data.size;
          this.i = 0;
          for (let i = 0; i < this.data.length; i++) {
            this.data[i].x = Array(size);
            for (let j = 0; j < size; j++) {
              this.data[i].x[j] = j * 50000;
            }
          }

          this.data.globalY = Array(size);
          for (let i = 0; i < size; i++) {
            this.data.globalY[i] = i;
          }
        })
        .then(() => {
          let conn = new WebSocket(
            "ws://" + window.location.host + "/readlive"
          );
          conn.binaryType = "arraybuffer";
          conn.onmessage = event => {
            let view = new Int32Array(event.data);
            for (let i = 0; i < this.data.length; i++) {
              this.data[i].x[this.i] = view[i] + i * 50000;
            }
            this.i++;
          };
          conn.onclose = () => {
            this.$set(this.layout.yaxis.range, 0, this.globalY.length + 20);
            // this.$set(this.layout.yaxis.range, 1, -10);
            this.$set(
              this.data[this.data.length - 1].x,
              this.i,
              50000 * this.data.length
            );
          };
        });
    }
  }
};
</script>

<style lang="scss" scoped>
html,
body,
#plot {
  height: 100%;
}
</style>
