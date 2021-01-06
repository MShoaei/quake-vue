import Vue from "vue";
import VueRouter from "vue-router";
// import Command from "@/views/Command";
// import Setup from "@/views/Setup";

Vue.use(VueRouter);

const routes = [
  {
    path: "/plot",
    name: "plot",
    // component: PlotStream
    component: () =>
      import(/* webpackChunkName: "plot-stream" */ "../views/PlotStream.vue"),
  },
  {
    path: "/info",
    name: "info",
    // component: Info
    component: () => import(/* webpackChunkName: "info" */ "../views/Info.vue"),
  },
  {
    path: "/command",
    name: "command",
    // component: Command,
    component: () => import(/* webpackChunkName: "command" */ "../views/Command.vue")
  },
  {
    path: "/setup",
    name: "setup",
    // component: Setup,
        // route level code-splitting
    // this generates a separate chunk (setup.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "setup" */ "../views/Setup.vue")
  },
  { path: "/", redirect: "/setup" },
  { path: "*", redirect: "/" },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

router.beforeEach((to, from, next) => {
  // redirect to login page if not logged in and trying to access a restricted page
  const publicPages = ["/login"];
  const authRequired = !publicPages.includes(to.path);
  const loggedIn = localStorage.getItem("token");

  // eslint-disable-next-line no-constant-condition
  if (authRequired && !loggedIn && false) {
    return next("/login");
  }
  next();
});

export default router;
