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
      sources: {
         current: -1,
         items: []
      }
    },
    pages: {
      maths: [],
      chineses: [],
      englishs: [],
      logics: []
    }
  },
  getters: {
    gradeFullName(state) {
      return state.user.gradeName + yuchg.number2String(state.user.class) + '班'
    },
    appTitle(state) {
      return `${state.appName} V${state.version}`
    },
    source(state) {
      const src = state.database.sources
      if (src.items.length === 0) {
        return 'rj'
      }

      let i = Number(src.current)
      if (i < 0 || i > src.items.length) {
        i = 0
      }
      return src.items[i].id
    },
    sourceItems(state) {
      const src = state.database.sources
      if (!src.items) {
        return []
      }
      return src.items
    },
    dbSource(state) {
      const src = state.database.sources
      let i = Number(src.current)
      if (i < 0 || i > src.items.length) {
        i = 0
      }
      return 'data/db/' + src.items[i].id
    },
    scoreSource(state) {
      return 'data/score'
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
      state.pages.logics = info.pages.logics
    },
    updateUser(state, user) {
      state.user.name = user.name
      state.user.class = user.class
    },
    updateGrade(state, grade) {
      state.user.gradeName = grade
    },
    updateSource(state, src) {
      const sources = state.database.sources
      sources.items.forEach(function(item, i) {
        if (item.id === src) {
          sources.current = i
          return false
        }
      })
    }
  },
  actions: {

  }
})
