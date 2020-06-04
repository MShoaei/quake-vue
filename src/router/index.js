import Vue from "vue";
import VueRouter from "vue-router";
import Home from "../views/Home.vue";
import StreamForm from "@/components/StreamForm.vue";
import PlotStream from "@/views/PlotStream.vue";
import LoginForm from "@/components/LoginForm.vue";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "home",
    component: Home
  },
  {
    path: "/login",
    name: "login",
    component: LoginForm
  },
  {
    path: "/stream",
    name: "stream",
    component: StreamForm
  },
  {
    path: "/plot",
    name: "plot",
    component: PlotStream
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

  if (!authRequired && !loggedIn) {
    return next("/login");
  }
  next();
});

export default router;
