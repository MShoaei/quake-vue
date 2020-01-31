<template>
  <v-app>
    <v-app-bar app color="primary" dark>
      <v-btn icon @click.stop="drawer = !drawer"
        ><v-icon>mdi-menu</v-icon></v-btn
      >
    </v-app-bar>
    <v-navigation-drawer
      v-model="drawer"
      color="primary"
      absolute
      temporary
      src="./assets/bg-2.webp"
      dark
    >
      <v-list dense nav class="py-0"> </v-list>
    </v-navigation-drawer>
    <v-content>
      <!--      <router-view />-->
      <CommandForm />
    </v-content>
  </v-app>
</template>

<script lang="ts">
import Vue from "vue";
import CommandForm from "./components/CommandForm.vue";

export default Vue.extend({
  name: "App",

  components: {
    CommandForm
  },

  data: () => ({
    drawer: false
  })
});
</script>
