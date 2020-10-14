<template>
  <v-container>
    <v-card max-width="400px" class="mx-auto" raised>
      <v-form
        @submit.prevent="login(username, password)"
        class="mx-2 text-center"
      >
        <v-list-item-avatar size="80">
          <v-icon x-large>mdi-account</v-icon>
        </v-list-item-avatar>
        <v-text-field v-model="username" label="username"></v-text-field>
        <v-text-field
          type="password"
          v-model="password"
          label="password"
        ></v-text-field>

        <v-card-actions>
          <v-btn type="submit" color="primary">login</v-btn>
        </v-card-actions>
      </v-form>
    </v-card>
  </v-container>
</template>

<script>
export default {
  name: "LoginForm",
  data: () => ({
    username: "",
    password: ""
  }),
  methods: {
    login: function(username, password) {
      const requestOptions = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password })
      };
      return fetch(`http://localhost:9090/login`, requestOptions)
        .then(handleResponse)
        .then(resp => {
          // login successful if there's a jwt token in the response
          if (resp.token) {
            // store user details and jwt token in local storage to keep user logged in between page refreshes
            localStorage.setItem("token", resp.token);
          }
          return resp;
        });
    }
  }
};

function logout() {
  // remove token from local storage to log user out
  localStorage.removeItem("token");
}

function handleResponse(response) {
  return response.text().then(text => {
    const data = text && JSON.parse(text);
    if (!response.ok) {
      if (response.status === 401) {
        // auto logout if 401 response returned from api
        logout();
        location.reload(true);
      }

      const error = (data && data.message) || response.statusText;
      return Promise.reject(error);
    }

    return data;
  });
}
</script>

<style lang="scss" scoped>
.login {
  height: 100%;
  text-align: center;
}
</style>
