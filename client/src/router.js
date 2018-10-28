import Vue from 'vue'
import Router from 'vue-router'
import Welcome from './views/Welcome.vue'
import Editor from './views/ScriptEditor.vue'
import Empty from './views/Empty.vue'

import Maths_G3 from './views/Maths/G3.vue'
import Maths_G4 from './views/Maths/G4.vue'

import Chs_G3 from './views/Chineses/G3.vue'

Vue.use(Router)

const Progs = [null, null, null, null, null, null, null]
const Engs = [null, null, null, null, null, null, null]
const Chs = [null, null, null, Chs_G3, null, null, null]
const Maths = [null, null, null, Maths_G3, Maths_G4, null, null]

export default new Router({
  routes: [
    {
      path: '/empty',
      name: 'empty',
      component: Empty
    },
    {
      path: '/',
      name: 'welcome',
      component: Welcome
    },
    {
      path: '/editor',
      name: 'editor',
      component: Editor
    },
    {
      path: '/maths/g3',
      name: 'mathsg3',
      component: Maths[3]
    },
    {
      path: '/maths/g4',
      name: 'mathsg4',
      component: Maths[4]
    },
    {
      path: '/chineses/g3',
      name: 'chsg3',
      component: Chs[3]
    }
  ]
})
