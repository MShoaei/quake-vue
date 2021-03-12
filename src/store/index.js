import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

function deleteTreeItem(root, path) {
  for (let i = 0; i < root.length; i++) {
    if (root[i].path === path) {
      root.splice(i, 1);
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
    allProjects: [],
    openProjects: [],
    newState: [],
  },
  mutations: {
    pushOpenProjects(state, item) {
      state.openProjects.push(item);
    },
    setOpenProjects(state, arr) {
      arr.sort((a, b) => {
        return a.id - b.id;
      });
      state.openProjects = arr.slice();
    },
    removeOpenProjectByPath(state, path) {
      deleteTreeItem(state.openProjects, path);
    },
    pushAllProjects(state, item) {
      state.allProjects.push(item);
    },
    clearAllprojects(state) {
      state.allProjects = [];
    },
  },
  actions: {},
  modules: {},
});
