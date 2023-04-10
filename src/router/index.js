import Vue from "vue"
import VueRouter from 'vue-router'

Vue.use(VueRouter)
//避免重复点击报错
const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(location) {
    return originalPush.call(this, location).catch(err => err)
}
const routes = [
    {
        path: "/home",
        component: () => import("../components/main.vue"),
        name: "home",
        children: [
            {
                path: "/map",
                component: () => import("../components/heatmap.vue"),
                name: "map"
            },
            {
                path: "/statistics",
                component: () => import("../components/statistics.vue"),
                name: "statistics"
            },
            {
                path: "/userCenter",
                component: () => import("../components/userCenter.vue"),
                name: "userCenter"
            }
        ]
    },
    {
        path: "/login",
        component: () => import("../components/login.vue"),
        name: "login"
    },
    // {
    //     path: "/statistics",
    //     component: () => import("../components/statistics.vue"),
    //     name: "statistics"
    // }
]
export default new VueRouter({
    mode: "history",
    routes,
})