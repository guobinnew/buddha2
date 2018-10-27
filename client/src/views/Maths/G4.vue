<template>
    <div class="container">
      <Hard></Hard>
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
import Hard from '../../components/maths/Hard.vue'
import logger from '../../logger'

export default {
  data: function() {
    return {
      grade: 0
    }
  },
  computed: {
  },
  components: {
    Hard
  },
  created: function () {
  },
  mounted: function() {
  }
}
</script>
