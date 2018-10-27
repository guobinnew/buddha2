<template>
    <div class="container">
      <MathsG3 v-if="grade <= 3"></MathsG3>
    </div>
</template>

<style scoped>
.container {
  overflow: hidden;
  height: 100%;
  line-height: 20px;
  min-width: 800px; 
}

.el-tabs {
  height: 100%;
}

.el-collapse {
  margin-top: 10px;
}

.buddha-page {
  background-color: white;
  margin: 0 auto;
  width: 600px;
  font-family: Microsoft YaHei;
}

.el-form-item {
  text-align: left;
}

.line {
  text-align: right;
  float: left;
  font-size: 14px;
  color: #606266;
  line-height: 40px;
  padding: 0 12px 0 0;
}
</style>

<script>
import MathsG3 from '../components/maths/G3.vue'
import logger from '../logger'

export default {
  data: function() {
    return {
      grade: 0
    }
  },
  computed: {
  },
  components: {
    MathsG3
  },
  created: function () {
   
  },
  mounted: function() {
    
  },
  beforeRouteEnter(to, from, next) {
        // do someting
        // 在渲染该组件的对应路由被 confirm 前调用
         logger.debug('route beforeRouteEnter =', to)
         next()
  },
  beforeRouteUpdate: (to, from, next) => {
     // ...
     logger.debug('route beforeRouteUpdate =', to)
      // 计算年级
      let items = this.$route.params.grade.split('-')
      if (items[0] == 1) {
        this.grade = Number(items[1])
      } else if (items[0] == 2) {
        this.grade = 6 + Number(items[1])
      } else if (items[0] == 3) {
        this.grade = 9 + Number(items[1])
      } else {
        this.grade = 0
      }
      next()
  }
}
</script>
