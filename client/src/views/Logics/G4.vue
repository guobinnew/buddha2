<template>
  <el-tabs type="border-card">
    <el-tab-pane label="数独">
      <Sudoku level="4" ref="sudoku"></Sudoku>
    </el-tab-pane>
    <el-tab-pane label="迷宫">
      <Puzzle level="4" ref="puzzle"></Puzzle>
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
  import Puzzle from '../../components/logic/Puzzle.vue'
  import logger from '../../logger'
  import yuchg from "../../base"

  export default {
    components: {Sudoku, Puzzle},
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
