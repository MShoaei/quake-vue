<template>
  <v-app>
    <v-dialog v-model="networkDialog" max-width="600px">
      <v-card>
        <v-card-title class="headline">
          Available networks
        </v-card-title>
        <v-card-text>
          <v-list shaped>
            <v-subheader>WiFi networks</v-subheader>
            <v-list-item-group v-model="selectedItem" color="primary">
              <v-list-item
                @click="passwordDialog = true"
                v-for="(item, i) in allNetworks"
                :key="i"
              >
                <v-list-item-content>
                  <v-list-item-title v-text="item.essid"></v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </v-list-item-group>
          </v-list>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn text @click="networkDialog = false">
            Close
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="passwordDialog" max-width="600px">
      <v-card>
        <v-card-title class="headline">
          Password
        </v-card-title>
        <v-card-text>
          <v-text-field
            v-model="password"
            :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
            :rules="[rules.required, rules.min]"
            :type="showPassword ? 'text' : 'password'"
            name="input-10-1"
            label="Normal with hint text"
            hint="At least 8 characters"
            counter
            @click:append="showPassword = !showPassword"
          ></v-text-field>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn text @click="passwordDialog = false">
            Close
          </v-btn>
          <v-btn text color="success" @click.prevent="connectToNetwork">
            Connect
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-app-bar app color="primary" dark>
      <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
      <v-spacer></v-spacer>
      <v-btn icon @click="openNetworkDialog"><v-icon>mdi-wifi</v-icon></v-btn>
    </v-app-bar>
    <v-navigation-drawer v-model="drawer" color="white" fixed light temporary>
      <v-list>
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
        <v-list-item link to="/info">
          <v-list-item-icon>
            <v-icon>mdi-information</v-icon>
          </v-list-item-icon>
          <v-list-item-content>Board Info</v-list-item-content>
        </v-list-item>
        <v-list-item link to="/command">
          <v-list-item-icon>
            <v-icon></v-icon>
          </v-list-item-icon>
          <v-list-item-content>Commands</v-list-item-content>
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
      <router-view />
    </v-main>
  </v-app>
</template>

<script>
import Vue from "vue";
import axios from "@/plugins/axios";

export default Vue.extend({
  name: "App",

  data: () => ({
    showPassword: false,
    drawer: false,
    networkDialog: false,
    passwordDialog: false,
    allNetworks: [],
    selectedItem: Number,
    password: "",
    rules: {
      required: (value) => !!value || "Required.",
      min: (v) => v.length >= 8 || "Min 8 characters",
    },
  }),
  methods: {
    openNetworkDialog: function() {
      axios.get("/api/wifi/scan").then((resp) => {
        this.allNetworks = resp.data.accessPoints;
        this.networkDialog = true;
      });
    },
    connectToNetwork: function() {
      axios
        .post("/api/wifi/connect", {
          essid: this.allNetworks[this.selectedItem].essid,
          password: this.password,
        })
        .then(() => {
          this.selectedItem = Number;
          this.password = "";
          this.passwordDialog = false;
          this.networkDialog = false;
        })
        .catch(() => {});
    },
    shutdownSequence: () => {
      axios.post("/api/rpi/shutdown");
    },
    restartSequence: () => {
      axios.post("/api/rpi/restart");
    },
  },
});
</script>
