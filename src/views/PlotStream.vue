<template>
  <div>
    <vue-plotly
      ref="plot"
      :data="plotData"
      :layout="layout"
      :options="options"
    />
  </div>
</template>

<script>
import VuePlotly from "@statnett/vue-plotly";
import axios from "@/plugins/axios";
import router from "@/router";

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
      form: router.currentRoute.query,
      plotData: [],
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
  created: function() {
    axios
      .post("/api/plot", this.form)
      .then(resp => {
        let size = resp.data.size;
        this.i = 0;
        for (let i = 0; i < this.plotData.length; i++) {
          this.plotData[i].x = Array(size);
          for (let j = 0; j < size; j++) {
            this.plotData[i].x[j] = j * 200000;
          }
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
              x: [],
              type: "scatter",
              name: "Channel " + i,
              marker: { color: "red" }
            });
          }
        }
      })
      .then(() => {
        let conn = new WebSocket(
          "ws://" +
            window.location.host +
            "/api/plot?file=" +
            router.currentRoute.query.file
        );
        conn.binaryType = "arraybuffer";
        conn.onmessage = event => {
          let view = new Int32Array(event.data);
          for (let i = 0; i < this.plotData.length; i++) {
            this.plotData[i].x[this.i] = view[i] + i * 50000;
          }
          this.i++;
        };
        conn.onclose = () => {
          this.$set(this.layout.yaxis.range, 0, this.globalY.length + 20);
          this.$set(
            this.plotData[this.plotData.length - 1].x,
            this.i,
            this.plotData[this.plotData.length - 1].x[this.i]
          );
        };
      });
  }
};
</script>

<style lang="scss" scoped></style>
