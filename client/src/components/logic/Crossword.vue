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
                    <el-form-item label="数目">
                        <el-input-number v-model="form.number" :step="1" :min="1" :max="2"></el-input-number>
                    </el-form-item>
                </el-form>
            </el-collapse-item>
        </el-collapse>
        <div class="buddha-svg-wrap">
          <svg class="buddha-crossword" :width='width' :height='height' version="1.1" xmlns="http://www.w3.org/2000/svg">
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

.buddha-corssword {
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
import $ from "jquery";
import svg2png from "save-svg-as-png";

const ycSvgNS = "http://www.w3.org/2000/svg";

export default {
  props: ["level"],
  data: function() {
    return {
      form: {
        level: "1",
        number: 1
      },
      svg: null,
      width: 800,
      height: 800,
      cellWidth: 40,
      cellHeight: 40,
      content: [],
      numArr: [1, 2, 3, 4, 5, 6, 7, 8, 9]
    };
  },
  computed: {},
  methods: {
    onClickTest() {
      this.content = [];
      this.crosswordGenerate();
      this.makeCrossword(this.content);
    },
    onClickExport() {
      // 导出为PNG文件
      let date = yuchg.currentTimeString();
      svg2png.saveSvgAsPng(this.svg, "数独" + date + ".png");
    },
    onClickAnswer() {
      let keys = document.querySelectorAll(
        "svg.buddha-sudoku .buddha-sudoku-key"
      );
      keys.forEach(function(v) {
        v.style.display = v.style.display === "none" ? "block" : "none";
      });
    },
    crosswordGenerate() {
      // 生成填字游戏数据
      try {

  
      } catch (e) {
        logger.warn(e);
      }
    },
    crosswordLine(option) {
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
    crosswordCell(option) {
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
      rect.setAttribute("stroke", "#333");
      rect.setAttribute("fill", option.isKey ? "#eee" : "#fff");
      option.strokeWidth &&
        rect.setAttribute("stroke-width", option.strokeWidth);
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
      if (option.isKey) {
        text.classList.add("buddha-sudoku-key");
        text.style.fontWeight = "bold";
        text.style.display = "none";
      }
      g.appendChild(text);
      return g;
    },
    makeCrossword(data) {
      $(this.svg).empty();

    }
  },
  mounted: function() {
    this.svg = document.querySelector(".buddha-crossword");
  },
  activated: function() {}
};
</script>
