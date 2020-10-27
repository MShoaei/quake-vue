import Vue from "vue";
import VueRouter from "vue-router";

Vue.use(VueRouter);

const routes = [
  {
    path: "/plot",
    name: "plot",
    // component: PlotStream
    component: () =>
      import(/* webpackChunkName: "plot" */ "../views/PlotStream.vue")
  },
  {
    path: "/command",
    name: "command",
    component: import(/* webpackChunkName: "command" */ "../views/Command.vue")
  },
  {
    path: "/setup",
    name: "setup",
    // component: Setup
    component: () =>
      import(/* webpackChunkName: "setup" */ "../views/Setup.vue")
  },
  {
    path: "/about",
    name: "about",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/About.vue")
  },
  { path: "/", redirect: "/setup" },
  { path: "*", redirect: "/" }
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes
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
