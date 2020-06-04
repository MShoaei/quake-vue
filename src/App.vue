<template>
  <v-app>
    <v-app-bar app color="primary" dark>
      <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
      <v-spacer></v-spacer>
      <v-btn color="green" @click="overlay = !overlay">
        Update
        <v-icon dark right>mdi-cloud-upload</v-icon>
      </v-btn>
    </v-app-bar>
    <v-navigation-drawer v-model="drawer" color="white" fixed temporary light>
      <v-list-item to="/" link>
        <v-list-item-icon>
          <v-icon>mdi-home</v-icon>
        </v-list-item-icon>
        <v-list-item-content>Home</v-list-item-content>
      </v-list-item>
      <v-list-item to="/stream" link>
        <v-list-item-icon>
          <v-icon>mdi-view-stream</v-icon>
        </v-list-item-icon>
        <v-list-item-content>Stream data</v-list-item-content>
      </v-list-item>
      <v-list-item to="/plot" link>
        <v-list-item-icon>
          <v-icon>mdi-chart-scatter-plot</v-icon>
        </v-list-item-icon>
        <v-list-item-content>plot</v-list-item-content>
      </v-list-item>
      <v-list-item to="/about" link>
        <v-list-item-icon>
          <v-icon>mdi-information</v-icon>
        </v-list-item-icon>
        <v-list-item-content>About</v-list-item-content>
      </v-list-item>
    </v-navigation-drawer>
    <v-content>
      <ConfirmUpdateOverlay :overlay="overlay" />
      <router-view />
    </v-content>
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
