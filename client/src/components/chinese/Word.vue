<template>
  <div style="overflow: hidden;">
    <el-button-group>
      <el-button type="primary" icon="el-icon-share" @click="onClickPrev">上一个单词</el-button>
      <el-button type="success" icon="el-icon-share" @click="onClickNext">下一个单词</el-button>
      <el-button type="warning" icon="el-icon-edit" @click="onClickAgain">再读一遍</el-button>
      <el-button type="danger" icon="el-icon-share" @click="onClickAnswer">查看答案</el-button>
    </el-button-group>
    <el-row :gutter="20">
      <el-col :span="8">
        <el-progress type="circle" :percentage="percent"></el-progress>
        <p class="buddha-index">{{ ratio }}</p>
      </el-col>
      <el-col :span="16">
         <p class="buddha-word">{{ currentWord }}</p>
      </el-col>
    </el-row>
  </div>
  </template>

<style scoped>
.el-row {
  margin-top: 20px;
}
.hidden {
  display: none;
}

.buddha-word{
    font-size: 100px;
}

.buddha-chinese{
    font-size: 60px;
}

.buddha-index{
    font-size: 20px;
    margin: 20px;
}
</style>

<script>
import logger from "../../logger";
import $ from "jquery";
import yuchg from "../../base";
import utils from './utils'

export default {
  name: "Word",
  props: ["content"],
  data: function() {
    return {
      percent: 0,
      ratio: '',
      currentWord: ''
    };
  },
  computed: {
  },
  methods: {
    onClickPrev() {

    },
    onClickNext() {

    },
    onClickAgain() {
      utils.readWord('高兴')
    },
    onClickAnswer() {

    }
  },
  mounted: function() {
  },
  activated: function() {
  }
};
</script>

