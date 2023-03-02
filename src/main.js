import Vue from 'vue'
import App from './App.vue'
//引入elementui
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
Vue.use(ElementUI);

import axios from 'axios'
window.$axios = axios

import * as turf from "@turf/turf";
window.turf=turf
import "mapbox-gl/dist/mapbox-gl.css";
import "@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css";
import MapboxLanguage from "@mapbox/mapbox-gl-language";
import MapboxGeocoder from "@mapbox/mapbox-gl-geocoder";
// import MapboxDraw from "@mapbox/mapbox-gl-draw";  
import mapboxgl from '!mapbox-gl';
window.mapboxgl = mapboxgl;
// window.MapboxDraw=MapboxDraw;
mapboxgl.accessToken =
  "pk.eyJ1IjoieGlhb2xpYW5nbWFwYm94IiwiYSI6ImNsNHdrMnExZjJmZXkzb3F6YXc5Y3NzbzgifQ.gkq9Xyh15ZJLQcte_TmMEQ";
window.MapboxGeocoder = MapboxGeocoder
window.MapboxLanguage = MapboxLanguage
//引入echarts
import * as echarts from 'echarts';
window.echarts = echarts;
//引入vuex
import store from "./store"
import router from './router'
router.beforeEach((to, from, next) => {
  if ((from.name == null && to.name !== "login" && sessionStorage.getItem('isSignIn') != "true") || to.name == null) {
    next({ name: 'login' });
  } else if (from.name == null && to.name == "statistics") {
    next({ name: 'map' })
  }else{
    next()
  }
})
Vue.config.productionTip = false

new Vue({
  store,
  router,
  render: h => h(App),
}).$mount('#app')
