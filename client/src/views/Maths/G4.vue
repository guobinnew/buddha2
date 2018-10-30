<template>
    <el-tabs type="border-card">
        <el-tab-pane label="每日口算">
            <HardOral :source="source" ref="oral"></HardOral>
        </el-tab-pane>
        <el-tab-pane label="成绩统计" name="score">
            <Score :source="source" ref="chart"></Score>
        </el-tab-pane>
    </el-tabs>
</template>

<style scoped>
.el-tabs {
    line-height: 20px;
}
</style>

<script>
import HardOral from '../../components/maths/HardOral.vue'
import logger from '../../logger'
import Score from '../../components/maths/Score.vue'
import $ from "jquery"
import yuchg from "../../base"

export default {
  components: { HardOral, Score },
  data: function() {
    return {
      source: 'g4'
    }
  },
  computed: {
  },
  created: function () {
  },
  mounted: function() {
  }
}
</script>
