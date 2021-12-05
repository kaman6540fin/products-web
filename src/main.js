// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from "vue";
import App from "./App";
import VueRouter from "vue-router";
import Axios from "axios";

// 1導入組件
import Goods from "./components/Goods/Goods";
import Ratings from "./components/Ratings/Ratings";
import Seller from "./components/Seller/Seller";

Vue.config.productionTip = false;

// 0安裝vue-router
Vue.use(VueRouter);
//如果要在其他元件中使用axios,需要改寫為vue的原型屬性
Vue.prototype.$axios = Axios;

// 2定義路由
const routes = [
  {
    path: "/",

    //重新定向 to /goods
    redirect: "/goods"
  },
  {
    path: "/goods",
    component: Goods
  },
  {
    path: "/ratings",
    component: Ratings
  },
  {
    path: "/seller",
    component: Seller
  }
];

//3創建路由實體
const router = new VueRouter({
  routes,
  linkActiveClass: "active"
});

/* eslint-disable no-new */
new Vue({
  el: "#app",
  components: { App },
  template: "<App/>",
  //4創建&掛載路由實體
  router
});
