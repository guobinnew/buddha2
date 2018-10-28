<template>
  <div style="overflow: hidden;">
    <el-button-group>
      <el-button type="primary" icon="fa fa-arrow-left" @click="onClickPrev" :disabled="buttons.prev">上一个单词</el-button>
      <el-button type="success" icon="fa fa-arrow-right" @click="onClickNext" :disabled="buttons.next">下一个单词</el-button>
      <el-button type="warning" icon="fa fa-repeat" @click="onClickAgain" :disabled="buttons.again">再读一遍</el-button>
      <el-button type="danger" icon="fa fa-buysellads" @click="onClickAnswer" :disabled="buttons.answer">查看答案</el-button>
    </el-button-group>
    <el-row :gutter="20">
      <el-col :span="8">
        <el-progress type="circle" :percentage="percent"></el-progress>
        <p class="buddha-index">{{ ratio }}</p>
      </el-col>
      <el-col :span="16">
         <p class="buddha-word" v-show="showAnswer">{{ currentWord }}</p>
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
    line-height: 100px;
    margin-top: 20px;
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
  data: function() {
    return {
      content: [],
      buttons: {
        prev: true,
        next: true,
        again: true,
        answer: true
      },
      currentIndex: -1,
      showAnswer: false
    };
  },
  computed: {
    currentWord: function() {
      let word = ''
      if (yuchg.isArray(this.content) &&  this.currentIndex >= 0 && this.currentIndex < this.content.length) {
        word = this.content[this.currentIndex]
      }
      return word
    },
    ratio: function() {
      let value = '0/0'
      if (yuchg.isArray(this.content) &&  this.content.length > 0) {
        value = '' + (this.currentIndex >= 0 ? (this.currentIndex + 1) : 0) + '/' + this.content.length
      }
      return value
    },
    percent: function() {
      let value = 0
      if (yuchg.isArray(this.content) &&  this.content.length > 0) {
         value =  Math.floor((this.currentIndex >= 0 ? (this.currentIndex + 1) : 0) / this.content.length * 100)
      }
      return value
    }
  },
  methods: {
    onClickPrev() {
      this.showAnswer = false
      this.currentIndex -= 1
      this.updateButtons()
      utils.readWord(this.currentWord)
    },
    onClickNext() {
      this.showAnswer = false
      this.currentIndex += 1
      this.updateButtons()
      utils.readWord(this.currentWord)
    },
    onClickAgain() {
      utils.readWord(this.currentWord)
    },
    onClickAnswer() {
      this.showAnswer = true
    },
    updateButtons() {
      if (this.content.length == 0) {
        this.buttons.next = true
        this.buttons.prev = true
        this.buttons.again = true
        this.buttons.answer = true
      } else {
        this.buttons.next = this.currentIndex >= this.content.length - 1
        this.buttons.prev = this.currentIndex < 0
        this.buttons.again = this.currentIndex < 0 || this.currentIndex >= this.content.length
        this.buttons.answer = this.currentIndex < 0 || this.currentIndex >= this.content.length
      }
    },
    restart(words) {
      if (yuchg.isArray(words)) {
        this.content = words
      }
      this.currentIndex = -1
      this.updateButtons()
    }
  },
  mounted: function() {
  },
  activated: function() {
  }
};
</script>

