import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    appName: '',
    version: '',
    subVersion: '',
    company: '',
    user: {
      name: '',
      class: 1
    },
    pages: {
      maths: [],
      chinese: [],
      english: [],
      program: []
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

      state.pages.maths = info.pages.maths
      state.pages.chinese = info.pages.chinese
      state.pages.english = info.pages.english
      state.pages.program = info.pages.program
    },
    updateUser(state, user) {
      state.user.name = user.name
      state.user.class = user.class
    }
  },
  actions: {

  }
})
