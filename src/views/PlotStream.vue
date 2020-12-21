<template>
  <v-col>
    <v-btn icon outlined large color="primary" link to="/">
      <v-icon dark>mdi-arrow-left</v-icon>
    </v-btn>
    <div>
      <vue-plotly
        ref="plot"
        :data="plotData"
        :layout="layout"
        :options="options"
      />
    </div>
  </v-col>
</template>

<script>
import VuePlotly from "@statnett/vue-plotly";
import axios from "@/plugins/axios";
import router from "@/router";

export default {
  name: "PlotStream",
  components: {
    VuePlotly,
  },
  data() {
    return {
      i: 0,
      delay: 1,
      window: 1,
      globalY: [],
      form: router.currentRoute.query,
      plotData: [],
      movingAverage: [],
      layout: {
        // width: 320,
        height: 800,
        autosize: true,
        hovermode: false,
        dragmode: "pan",
        transition: {
          duration: 0,
        },
        title: "A Fancy Plot",
        yaxis: {
          visible: true,
        },
        xaxis: {
          visible: true,
          // range: [-100000000,100000000]
        },
      },
      options: {
        displayModeBar: true,
        displaylogo: false,
        responsive: true,
        autoScale: false,
        doubleClickDelay: 100,
        modeBarButtonsToRemove: [
          "toImage",
          "autoScale2d",
          "zoomIn2d",
          "zoomOut2d",
          "toggleSpikelines",
          "hoverCompareCartesian",
        ],
      },
    };
  },
  created: function() {
    axios
      .post("/api/plot", this.form)
      .then((resp) => {
        console.log(resp.data);
        let size = resp.data.size;
        this.i = 0;
        if (this.form.window === undefined) {
          this.window = resp.data.window;
        }
        this.globalY = Array(size);
        for (let i = 0; i < size; i++) {
          this.globalY[i] = i;
        }

        let channels = resp.data.channels;
        for (let i = 0; i < channels.length; i++) {
          if (channels[i]) {
            this.plotData.push({
              y: this.globalY,
              x: Array(size),
              type: "scatter",
              name: "Channel " + (i + 1),
              marker: { color: "red" },
            });
            this.movingAverage.push({
              sum: 0,
              x: new Array(size),
            });
          }
        }
        this.layout.xaxis.range = [
          this.plotData.length * 5000000,
          this.plotData.length * -5000000,
        ];
        this.$set(this.layout.xaxis.range, 1, this.plotData.length * 5000000);
      })
      .then(() => {
        let conn = new WebSocket(
          "ws://" +
            window.location.host +
            "/api/plot?file=" +
            router.currentRoute.query.file
        );
        conn.binaryType = "arraybuffer";
        conn.onmessage = (event) => {
          let view = new Int32Array(event.data);
          for (let i = 0; i < this.plotData.length; i++) {
            this.plotData[i].x[this.i] = view[i] + i * 50000;
            if (this.window == 1) {
              continue;
            }
            if (this.i < this.window) {
              this.movingAverage[i].sum += view[i] + i * 50000;
              this.movingAverage[i].x[this.i] =
                this.movingAverage[i].sum / this.i;
            } else {
              this.movingAverage[i].sum += view[i] + i * 50000;
              this.movingAverage[i].sum -= this.plotData[i].x[
                this.i - this.window
              ];
              this.movingAverage[i].x[this.i] =
                this.movingAverage[i].sum / this.window;
            }
          }
          this.i++;
        };
        conn.onclose = () => {
          this.layout.yaxis.range = [0, this.globalY.length + 20];
          this.$set(this.layout.yaxis.range, 1, this.globalY.length + 20);
          this.layout.xaxis.range = [-100000000, 100000000];
          this.$set(this.layout.yaxis.range, 1, 100000000);
          if (this.window > 1) {
            for (let i = 0; i < this.plotData.length; i++) {
              this.plotData[i].x = this.movingAverage[i].x;
            }
          }
          this.$set(
            this.plotData[this.plotData.length - 1].x,
            this.i,
            this.plotData[this.plotData.length - 1].x[this.i]
          );
        };
      });
  },
};
</script>

<style lang="scss" scoped></style>
