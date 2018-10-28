import Vue from 'vue'
import Vuex from 'vuex'
import yuchg from './base'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    appName: '',
    version: '',
    subVersion: '',
    company: '',
    user: {
      name: '',
      class: 1,
      gradeName: ''
    },
    database: {
      sources: {}
    },
    pages: {
      maths: [],
      chineses: [],
      englishs: [],
      programs: []
    }
  },
  getters: {
    gradeFullName(state) {
      return state.user.gradeName + yuchg.number2String(state.user.class) + '班'
    },
    appTitle(state) {
      return `${state.appName} V${state.version}`
    }
  },
  mutations: {
    updateManifest(state, info) {
      state.appName = info.appName
      state.version = info.version
      state.subVersion = info.subVersion
      state.company = info.company

      state.user.name = info.user.name
      state.user.class = info.user.class

      state.database.sources = Object.assign({}, info.database.sources)

      state.pages.maths = info.pages.maths
      state.pages.chineses = info.pages.chineses
      state.pages.englishs = info.pages.englishs
      state.pages.programs = info.pages.programs
    },
    updateUser(state, user) {
      state.user.name = user.name
      state.user.class = user.class
    },
    updateGrade(state, grade) {
      state.user.gradeName = grade
    }
  },
  actions: {

  }
})
