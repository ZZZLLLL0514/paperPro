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
        StudentDormitorySource: null,
        departmentInfos: [],
        isCollapse: false,
        isHeat: false,
        userInfo: null, 
        studentCount: 0
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
        },
        addDepartmentInfos(state, value) {
            state.departmentInfos = value
        },
        collapseMenu(state, value) {
            state.isCollapse = !state.isCollapse
        },
        changeHeat(state, value) {
            state.isHeat = value;
        },
        addUserInfo(state, value) {
            state.userInfo = value;
        },
        addStudentCount(state, value) {
            state.studentCount = value;
        }
    },
})

class P{
     static async startup (options, callback) {
    const startTime = Date.now()
    const randomNum = (minNum, maxNum) => parseInt(Math.random() * (maxNum - minNum + 1) + minNum, 10)
    const {container, iModelId, versionId, viewId, local, filePath} = options || {}

    try {
      callback(randomNum(0, 20))
      // 加载初始化：初始化配置项，再调用IModelApp.startup(opt)启动IModel，注册自定义工具
      await this.initialize({}, local)

      callback(randomNum(20, 40))
      // 根据id打开远程IModelConnection
      const connection = local ? await this.openLocalIModel(filePath) : await this.openOnlineIModel(iModelId, versionId)

      callback(randomNum(40, 60))
      // 获取视图id，生成ScreenViewport，并加载到对应Element元素下
      const viewport = await this.openView(connection, container, viewId)

      callback(randomNum(60, 90), viewport)
      // 初始化模型样式（可选）
      await this.setInitialViewFlags(viewport)

      callback(randomNum(90, 95), viewport)
      // 监听各视图加载情况，模型加载正式完成
      await this.onFirstFinishRender(startTime, viewport, callback)

      return {connection, viewport}
    } catch (err) {
      throw new Error(err.message)
    }
  }
}
