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
                v-for="(item, i) in allNetworks"
                :key="i"
                @click="passwordDialog = true"
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
            counter
            hint="At least 8 characters"
            label="Normal with hint text"
            name="input-10-1"
            @click:append="showPassword = !showPassword"
          ></v-text-field>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn text @click="passwordDialog = false">
            Close
          </v-btn>
          <v-btn color="success" text @click.prevent="connectToNetwork">
            Connect
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-app-bar app color="primary" dark>
      <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
      <v-spacer></v-spacer>
      <v-tooltip bottom>
        <template v-slot:activator="{ on, attrs }">
          <v-btn icon @click="openNetworkDialog" v-bind="attrs" v-on="on">
            <v-icon>mdi-wifi</v-icon>
          </v-btn>
        </template>
        <span>{{ currentIP }}</span>
      </v-tooltip>

      <div class=".text-body-1">{{ currentSSID }}</div>
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
          <v-list-item-content>Plot</v-list-item-content>
        </v-list-item>
        <v-list-item link to="/info">
          <v-list-item-icon>
            <v-icon>mdi-information</v-icon>
          </v-list-item-icon>
          <v-list-item-content>Board Info</v-list-item-content>
        </v-list-item>
        <v-list-item link @click="restoreDefaults">
          <v-list-item-icon>
            <v-icon>mdi-restart</v-icon>
          </v-list-item-icon>
          <v-list-item-content>Restore Defaults</v-list-item-content>
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
    currentIP: "Not connected",
    currentSSID: "",
    selectedItem: Number,
    password: "",
    rules: {
      required: (value) => !!value || "Required.",
      min: (v) => v.length >= 8 || "Min 8 characters",
    },
  }),
  created() {
    axios.get("/api/wifi").then((resp) => {
      this.currentSSID = resp.data.ssid;
      this.currentIP = resp.data.ip;
    });
  },

  methods: {
    openNetworkDialog: function() {
      axios.get("/api/wifi/list").then((resp) => {
        this.allNetworks = resp.data.accessPoints;
        this.networkDialog = true;
      });
    },
    connectToNetwork: function() {
      axios
        .post("/api/wifi", {
          essid: this.allNetworks[this.selectedItem].essid,
          password: this.password,
        })
        .then((resp) => {
          console.log(resp.data);
          this.currentIP = resp.data[1].addr_info[0].local;
          this.currentSSID = this.allNetworks[this.selectedItem].essid;
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
    restoreDefaults: () => {
      axios.post("/api/restore");
    },
  },
});
</script>
