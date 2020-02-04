<template>
  <Plot :data="data" :layout="layout"></Plot>
</template>

<script lang="ts">
import Plot from "vue-plotly.js";

export default {
  name: "PlotStream",
  components: {
    Plot
  },
  data: () => ({
    data: [
      {
        type: "scatter",
        mode: "lines+points",
        x: [1, 2, 3],
        y: [2, 6, 3],
        marker: { color: "red" }
      },
      {
        type: "bar",
        x: [1, 2, 3],

        y: [2, 5, 3]
      }
    ],
    layout: {
      width: 320,
      height: 240,
      title: "A Fancy Plot"
    }
  })
};
</script>

<style lang="scss" scoped></style>
