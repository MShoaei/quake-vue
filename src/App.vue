<template>
  <v-app>
    <v-app-bar app color="primary" dark>
      <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
    </v-app-bar>
    <v-navigation-drawer v-model="drawer" color="white" fixed light temporary>
      <v-list>
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
        <v-list-group no-action>
          <template v-slot:activator>
            <v-list-item-icon>
              <v-icon>mdi-power-settings</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>Power</v-list-item-title>
            </v-list-item-content>
          </template>
          <v-list-item link @click="shutdownSequence">
            <v-list-item-icon>
              <v-icon>mdi-power</v-icon>
            </v-list-item-icon>
            <v-list-item-content>Shutdown</v-list-item-content>
          </v-list-item>
          <v-list-item link @click="restartSequence">
            <v-list-item-icon>
              <v-icon>mdi-restart</v-icon>
            </v-list-item-icon>
            <v-list-item-content>Restart</v-list-item-content>
          </v-list-item>
        </v-list-group>
      </v-list>
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
import axios from "@/plugins/axios";

export default Vue.extend({
  name: "App",

  components: {
    ConfirmUpdateOverlay
  },

  data: () => ({
    drawer: false,
    overlay: false
  }),
  methods: {
    shutdownSequence: () => {
      axios.post("/api/rpi/shutdown");
    },
    restartSequence: () => {
      axios.post("/api/rpi/restart");
    }
  }
});
</script>
