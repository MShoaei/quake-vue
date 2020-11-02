<template>
  <v-app>
    <v-app-bar app color="primary" dark>
      <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
    </v-app-bar>
    <v-navigation-drawer v-model="drawer" color="white" fixed light temporary>
      <v-list-item link to="/command">
        <v-list-item-icon>
          <v-icon></v-icon>
        </v-list-item-icon>
        <v-list-item-content>Commands</v-list-item-content>
      </v-list-item>
      <v-list-item link to="/setup">
        <v-list-item-icon>
          <v-icon>mdi-cog-outline</v-icon>
        </v-list-item-icon>
        <v-list-item-content>Setup</v-list-item-content>
      </v-list-item>
      <v-list-item link to="/stream">
        <v-list-item-icon>
          <v-icon>mdi-view-stream</v-icon>
        </v-list-item-icon>
        <v-list-item-content>Stream data</v-list-item-content>
      </v-list-item>
      <v-list-item link to="/plot">
        <v-list-item-icon>
          <v-icon>mdi-chart-scatter-plot</v-icon>
        </v-list-item-icon>
        <v-list-item-content>plot</v-list-item-content>
      </v-list-item>
      <v-list-item link to="/about">
        <v-list-item-icon>
          <v-icon>mdi-information</v-icon>
        </v-list-item-icon>
        <v-list-item-content>About</v-list-item-content>
      </v-list-item>
    </v-navigation-drawer>
    <v-main>
      <ConfirmUpdateOverlay :overlay="overlay" />
      <router-view />
    </v-main>
  </v-app>
</template>

<script>
import Vue from "vue";
import ConfirmUpdateOverlay from "@/components/ConfirmUpdateOverlay";

export default Vue.extend({
  name: "App",

  components: {
    ConfirmUpdateOverlay
  },

  data: () => ({
    drawer: false,
    overlay: false
  })
});
</script>
