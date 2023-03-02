//该文件用于创建Vuex中最为核心的store
import Vue from 'vue'
//引入Vuex
import Vuex from 'vuex'
//应用Vuex插件
Vue.use(Vuex)
//创建并暴露store
export default new Vuex.Store({
    state: {
        violatePois: [],
        legalPois: [],
        minTime: 0,
        maxTime: 0,
        StudentDormitorySource: null
    },
    mutations: {
        addViolatePois(state, value) {
            state.violatePois = value
        },
        addLegalPois(state, value) {
            state.legalPois = value
        },
        addMaxTime(state, value) {
            state.maxTime = value;
        },
        addMinTime(state, value) {
            state.minTime = value;
        },
        addStudentDormitorySource(state, value) {
            state.StudentDormitorySource = value;
        }
    },
})