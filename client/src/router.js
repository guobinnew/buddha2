import Vue from 'vue'
import Router from 'vue-router'
import Welcome from './views/Welcome.vue'
import Editor from './views/ScriptEditor.vue'
import Empty from './views/Empty.vue'
import Score from './views/Score.vue'
import Mine from './views/Mine.vue'

import Maths_G3 from './views/Maths/G3.vue'
import Maths_G4 from './views/Maths/G4.vue'

import Chs_G3 from './views/Chineses/G3.vue'
import Chs_G4 from './views/Chineses/G4.vue'

import Engs_G3 from './views/Englishs/G3.vue'
import Engs_G4 from './views/Englishs/G4.vue'

import Logs_G3 from './views/Logics/G3.vue'
import Logs_G4 from './views/Logics/G4.vue'


Vue.use(Router)

const Logics = [null, null, Logs_G3, Logs_G4, null, null]
const Engs = [null, null, Engs_G3, Engs_G4, null, null]
const Chs = [null, null, Chs_G3, Chs_G4, null, null]
const Maths = [null, null, Maths_G3, Maths_G4, null, null]

const Routes = [
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
    path: '/mine',
    name: 'mine',
    component: Mine
  },
  {
    path: '/score',
    name: 'score',
    component: Score
  },
  {
    path: '/editor',
    name: 'editor',
    component: Editor
  }
]

function addRoute(type, defs) {
  defs.forEach((val, index) => {
    if (val) {
      Routes.push({
        path: `/${type}/g${index + 1}`,
        name: `${type}#g${index + 1}`,
        component: val
      })
    }
  })
}

addRoute('math', Maths)
addRoute('chinese', Chs)
addRoute('english', Engs)
addRoute('logic', Logics)

export default new Router({
  routes: Routes
})
