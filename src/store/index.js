import Vue from "vue";
import Vuex from "vuex";
import axios from "@/plugins/axios";

Vue.use(Vuex);

function deleteTreeItem(root, path) {
  for (let i = 0; i < root.length; i++) {
    if (root[i].path === path) {
      root[i].open = false;
      return true;
    }
  }
  for (let i = 0; i < root.length; i++) {
    if (this.deleteTreeItem(root[i].children, path)) {
      return true;
    }
  }
}

export default new Vuex.Store({
  debug: true,
  state: {
    projects: [],
    activePath: "/",
    currentID: 0,
  },
  mutations: {
    OPEN_PROJECT(state, id) {
      state.projects[
        state.projects.findIndex((el) => el.id === id)
      ].open = true;
    },
    // setOpenProjects(state, arr) {
    //   arr.sort((a, b) => {
    //     return a.id - b.id;
    //   });
    //   state.openProjects = arr.slice();
    // },
    CLOSE_PROJECT(state, path) {
      deleteTreeItem(state.projects, path);
    },
    REMOVE_ALL_PROJECTS(state) {
      state.projects = [];
    },
    SET_ALL_PROJECTS(state, items) {
      state.projects = items.slice();
    },
    SET_CURRENT_ID(state, currentID) {
      state.currentID = currentID;
    },
    ADD_PROJECT(state, project) {
      state.projects.push(project);
    },
    SET_ACTIVE_PATH(state, path) {
      state.activePath = path;
    },
  },
  actions: {
    refreshProjects(context) {
      let openProjects = context.getters.openProjects;
      context.commit("REMOVE_ALL_PROJECTS");
      let currentID = 0;
      let projects = [];
      axios
        .get("/api/tree/")
        .then((resp) => {
          for (const item of resp.data.items) {
            currentID++;
            if (item.dir) {
              let open =
                openProjects.find(
                  (el) => el.path === resp.data.directory + item.name
                ) !== undefined;

              projects.push({
                id: currentID.toString(),
                path: resp.data.directory + item.name,
                name: item.name,
                children: [],
                open: open,
              });
            } else {
              projects.push({
                id: currentID.toString(),
                path: resp.data.directory + item.name,
                name: item.name,
              });
            }
          }
        })
        .then(() => {
          context.commit("SET_ALL_PROJECTS", projects);
          context.commit("SET_CURRENT_ID", currentID);
        });
    },
    createProject(context, projectName) {
      let id = context.state.currentID + 1;
      axios
        .post("/api/tree", { name: projectName })
        .then((resp) => {
          console.log(resp);
          let item = {
            id: id.toString(),
            path: "/" + projectName,
            name: projectName,
            children: [],
            open: true,
          };
          context.commit("ADD_PROJECT", item);
          context.commit("SET_CURRENT_ID", id);
        })
        .catch((err) => {
          console.log(err);
        });
    },
    openProjects(context, projectIDs) {
      let projects = context.state.projects;
      projects.forEach((el) => {
        el.open = projectIDs.includes(el.id);
      });

      context.commit("SET_ALL_PROJECTS", projects);
    },
    setActivePath(context, path) {
      context.commit("SET_ACTIVE_PATH", path);
    },
    removeOpenProjectByPath(context, path) {
      context.commit("CLOSE_PROJECT", path);
    },
  },
  getters: {
    openProjects(state) {
      return state.projects.filter((project) => project.open);
    },
    openProjectIDs(state) {
      let obj = state.projects.filter((project) => project.open);
      return obj.map((el) => el.id);
    },
    activeProject(state) {
      return state.projects.find(
        (project) => project.path === state.activePath
      );
    },
    allProjects(state) {
      return state.projects;
    },
  },
  modules: {},
});
