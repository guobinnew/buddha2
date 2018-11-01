<template>
    <el-tabs type="border-card">
        <el-tab-pane label="每日口算">
            <SimpleOral :source="source" ref="oral"></SimpleOral>
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
  import SimpleOral from '../../components/maths/SimpleOral.vue'
  import logger from '../../logger'
  import Score from '../../components/maths/Score.vue'
  import yuchg from "../../base"

  export default {
    components: {SimpleOral, Score},
    data: function () {
      return {
        source: 'g3'
      }
    },
    computed: {},
    created: function () {
    },
    mounted: function () {
    }
  }
</script>
