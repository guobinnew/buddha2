<template>
    <div style="overflow: hidden;">
        <el-button-group>
            <el-button type="primary" icon="fa fa-arrow-left" @click="onClickTest">随机生成</el-button>
            <el-button type="success" icon="fa fa-arrow-right" @click="onClickExport">保存为图片</el-button>
            <el-button type="danger" icon="fa fa-buysellads" @click="onClickAnswer">查看答案</el-button>
        </el-button-group>
        <el-collapse accordion>
            <el-collapse-item>
                <template slot="title">
                    生成选项<i class="header-icon fa fa-plus-square"></i>
                </template>
                <el-form ref="form" :model="form" label-width="80px">
                    <el-form-item label="难度">
                        <el-radio-group v-model="form.level">
                            <el-radio label="1">简单</el-radio>
                            <el-radio label="2">中级</el-radio>
                            <el-radio label="3">困难</el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item label="类型">
                        <el-radio-group v-model="form.type">
                            <el-radio label="1">语文</el-radio>
                            <el-radio label="2">英语</el-radio>
                        </el-radio-group>
                    </el-form-item>
                </el-form>
            </el-collapse-item>
        </el-collapse>
        <div class="buddha-svg-wrap">
          <svg class="buddha-search" :width='width' :height='height' version="1.1" xmlns="http://www.w3.org/2000/svg">
          </svg>
        </div>
    </div>
</template>

<style scoped>
.el-row {
  margin-top: 20px;
}

.hidden {
  display: none;
}

.header-icon {
  margin-left: 10px;
  font-size: 1.33333333em;
  line-height: 0.75em;
  color: #66cd00;
}

.el-row {
  line-height: 40px;
  margin: 0;
  border: solid 2px #000;
}

.el-collapse {
  margin: 20px 0px;
}

.buddha-eyetrack {
  overflow: visible;
}

.buddha-box {
  border: solid 2px #000;
}

.buddha-cell {
  width: 40px;
  height: 40px;
  border-left: solid 1px #333;
  border-top: solid 1px #333;
  vertical-align: middle;
  line-height: 40px;
}

.buddha-cell-bg {
  stroke: #333;
  stroke-width: 1;
  fill: #fff;
}

.sudoku-box {
  stroke: #333;
  stroke-width: 2;
  fill: #fff;
}

.sudoku-text {
  stroke: #333;
}

.sudoku-cell {
  stroke: #333;
  stroke-width: 1;
  fill: #fff;
}
</style>

<script>
import logger from "../../logger";
import yuchg from "../../base";
import ycUtils from "../../utils";
import $ from "jquery";
import svg2png from "save-svg-as-png";

const ycSvgNS = "http://www.w3.org/2000/svg";

export default {
  props: ["level", "url", "grade"],
  data: function() {
    return {
      form: {
        level: "1",
        type: "1"
      },
      loadedType: '',
      wordSum: 0,
      words: [],
      svg: null,
      width: 800,
      height: 800,
      content: [],
      currentLevel: 0,
      levels: [6, 8, 10, 12, 15, 18, 20],
      types: {
        '1' : 'words',
        '2' : 'glossary'
      }
    };
  },
  computed: {},
  methods: {
    onClickTest() {
      const callback = () => {
        this.content = [];
        if (!this.searchGenerate()) {
          return
        }
        this.makeSearch(this.content);
      }
      if (!this.loadedType !== this.form.type) {
        this.fetchWords(this.form.type, callback);
      } else {
        callback()
      }

    },
    onClickExport() {
      // 导出为PNG文件
      let date = yuchg.currentTimeString();
      svg2png.saveSvgAsPng(this.svg, "找单词" + date + ".png");
    },
    onClickAnswer() {
      let keys = document.querySelectorAll(
        "svg.buddha-search .buddha-search-key"
      );
      keys.forEach(function(v) {
        v.style.display = v.style.display === "none" ? "block" : "none";
      });
    },
    searchGenerate() {
      // 生成游戏数据
      try {
        if (this.wordSum < 10) {
          this.$message.error("词汇数目太少，请录入语文或英语词汇");
          return false;
        }
   
        // 根据难度确定曲线节点数目
        this.currentLevel = Number(this.level) + Number(this.form.level);
        if (this.currentLevel >= this.levels.length) {
          this.currentLevel = this.levels.length - 1;
        }

        // 
        if (this.form.type === '1') { // 语文模式
          this.searchChsGenerate()
        } else { // 英语模式
          this.searchEngGenerate()
        }
        return true
      } catch (e) {
        logger.warn(e);
        return false
      }
    },
    searchChsGenerate() {
      // 
      const size = this.levels[this.currentLevel]

      this.content = new Array(size)



    },
    searchEngGenerate() {

    },
    searchLine(option) {
      let line = document.createElementNS(ycSvgNS, "line");
      line.setAttribute("x1", option.startx);
      line.setAttribute("y1", option.starty);
      line.setAttribute("x2", option.endx);
      line.setAttribute("y2", option.endy);
      line.setAttribute(
        "style",
        `stroke-width: ${
          option.strokeWidth ? option.strokeWidth : 1
        }; stroke: #333;`
      );
      return line;
    },
    searchCell(option) {
      let g = document.createElementNS(ycSvgNS, "g");
      g.setAttribute("display", "block");
      g.setAttribute(
        "transform",
        `translate(${option.translatex ? option.translatex : 0}, ${
          option.translatey ? option.translatey : 0
        })`
      );
      g.classList.add("buddha-cell");

      let rect = document.createElementNS(ycSvgNS, "rect");
      rect.setAttribute("width", option.width);
      rect.setAttribute("height", option.height);
      if (option.shape === "round") {
        rect.setAttribute("rx", option.width / 2);
        rect.setAttribute("ry", option.height / 2);
      } else {
        rect.setAttribute("rx", 8);
        rect.setAttribute("ry", 8);
      }
      rect.setAttribute("stroke", "#333");
      rect.setAttribute("fill", "#eee");
      rect.classList.add("buddha-cell-bg");
      g.appendChild(rect);

      let text = document.createElementNS(ycSvgNS, "text");
      text.setAttribute("x", option.width / 2);
      text.setAttribute("y", option.height / 2);
      text.setAttribute("dy", "0");
      text.setAttribute("text-anchor", "middle");
      text.setAttribute("dominant-baseline", "central");
      text.classList.add("buddha-cell-text");
      text.textContent = option.text;
      g.appendChild(text);
      return g;
    },
    makeSearch(data) {
      $(this.svg).empty();

    },
    statWords(data) {
      let clone = yuchg.cloneObject(data);
      let num = 0;
      logger.warn("stat", clone);
      for (let sec of Object.values(clone)) {
        sec.forEach(ch => {
          this.words.push(ch);
          num += ch.length;
        });
      }
      this.wordSum = num;
    },
    fetchWords(type, callback) {
      if (this.url === "" || this.loaded) {
        return;
      }

      ycUtils.ajaxGet({
        url: this.url + `/${ this.types[this.form.type]}/${this.grade}`,
        success: data => {
          if (data.result === 0) {
            this.statWords(data.content);
            this.loadedType = type;
            callback && callback();
          } else {
            this.$message.error("读取词汇表失败 -" + data.err);
          }
        }
      });
    }
  },
  mounted: function() {
    this.svg = document.querySelector(".buddha-search");
  },
  activated: function() {}
};
</script>
