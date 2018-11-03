<template>
    <el-tabs type="border-card">
        <el-tab-pane label="数独">
            <Sudoku level="2" ref="sudoku"></Sudoku>
        </el-tab-pane>
        <el-tab-pane label="迷宫">
            <Puzzle level="2" ref="puzzle"></Puzzle>
        </el-tab-pane>
        <el-tab-pane label="填字">
            <Crossword level="2" :url="url" :grade="grade" ref="crossword"></Crossword>
        </el-tab-pane>
         <el-tab-pane label="找单词">
            <Search level="2" :url="url" :grade="grade" ref="search"></Search>
        </el-tab-pane>
         <el-tab-pane label="视觉追踪">
            <Eyetrack level="2" :url="url" :grade="grade" ref="eyetrack"></Eyetrack>
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
  import Crossword from '../../components/logic/Crossword.vue'
  import Eyetrack from '../../components/logic/Eyetrack.vue'
  import Search from '../../components/logic/Search.vue'
  import logger from '../../logger'
  import yuchg from "../../base"

  export default {
    components: {Sudoku, Puzzle, Crossword, Eyetrack, Search},
    data: function () {
      return {
        url: '',
        grade: ''
      }
    },
    computed: {},
    created: function () {
      let source = this.$store.getters.source
      this.url = `http://localhost:3000/api/whole/${source}`
      this.grade = 'g3'
    },
    mounted: function () {
    }
  }
</script>
