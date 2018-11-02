<template>
  <el-tabs type="border-card">
    <el-tab-pane label="数独">
      <Sudoku level="4" ref="sudoku"></Sudoku>
    </el-tab-pane>
  </el-tabs>
</template>

<style scoped>
  .el-tabs {
    line-height: 20px;
  }
</style>

<script>
  import Sudoku from '../../components/logic/Sudoku.vue'
  import logger from '../../logger'
  import yuchg from "../../base"

  export default {
    components: {Sudoku},
    data: function () {
      return {
      }
    },
    computed: {},
    created: function () {
    },
    mounted: function () {
    }
  }
</script>
