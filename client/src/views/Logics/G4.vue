<template>
  <el-tabs type="border-card">
    <el-tab-pane label="数独">
      <Sudoku level="4" ref="sudoku"></Sudoku>
    </el-tab-pane>
    <el-tab-pane label="迷宫">
      <Puzzle level="4" ref="puzzle"></Puzzle>
    </el-tab-pane>
    <el-tab-pane label="找单词">
      <Search level="4" :url="url" :grade="grade" ref="search"></Search>
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
  import Search from '../../components/logic/Search.vue'
  import logger from '../../logger'
  import yuchg from "../../base"

  export default {
    components: {Sudoku, Puzzle, Search},
    data: function () {
      return {
        url: '',
        grade: ''
      }
    },
    computed: {},
    created: function () {
      let source = this.$store.getters.source
      this.url = `/api/whole/${source}`
      this.grade = 'g4'
    },
    mounted: function () {

    }
  }
</script>
