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
          <svg class="buddha-sudoku" :width='width' :height='height' version="1.1" xmlns="http://www.w3.org/2000/svg">
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

.buddha-sudoku {
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
      width: 600,
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
      this.sudokuGenerate();
      this.makeSudoku(this.content);
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
    sudokuGenerate() {
      // 生成数独数据
      try {
        // 先生成一个数独矩阵作为模版
        const data = new Array(9);
        for (let i = 0; i < 9; i++) {
          data[i] = [0, 0, 0, 0, 0, 0, 0, 0, 0];
        }

        const checkColumn = (n, col) => {
          let result = true;
          for (let i = 0; i < 9; i++) {
            if (data[i][col] === n) {
              result = false;
              break;
            }
          }
          return result;
        };

        const checkRow = (n, row) => {
          let result = true;
          for (let i = 0; i < 9; i++) {
            if (data[row][i] === n) {
              result = false;
              break;
            }
          }
          return result;
        };

        const checkBlock = (n, x, y) => {
          let result = true;
          let sx = x * 3;
          let sy = y * 3;
          for (let i = sx; i < sx + 3; i++) {
            for (let j = sy; j < sy + 3; j++) {
              if (data[i][j] === n) {
                result = false;
                break;
              }
            }
            if (!result) {
              break;
            }
          }
          return result;
        };

        let n = yuchg.randomNumber(9, 1);
        for (let i = 0; i < 9; i++) {
          for (let j = 0; j < 9; j++) {
            let p = Math.floor(i / 3.0);
            let q = Math.floor(j / 3.0);
            for (let k = 0; k < 9; k++) {
              if (checkColumn(n, j) && checkRow(n, i) && checkBlock(n, p, q)) {
                data[i][j] = n;
                break;
              } else {
                n = (n % 9) + 1;
              }
            }
          }
          n = (n % 9) + 1;
        }

        const upset = () => {
          //按行交换
          let tmp = 0;
          for (let i = 0; i < 9; i++) {
            let n = yuchg.randomNumber(2, 0) * 3;
            let p = yuchg.randomNumber(2, 0) + n;
            for (let j = 0; j < 9; j++) {
              tmp = data[n][j];
              data[n][j] = data[p][j];
              data[p][j] = tmp;
            }
          }
          //按列交换
          for (let i = 0; i < 9; i++) {
            let n = yuchg.randomNumber(2, 0) * 3;
            let q = yuchg.randomNumber(2, 0) + n;
            for (let j = 0; j < 9; j++) {
              tmp = data[j][n];
              data[j][n] = data[j][q];
              data[j][q] = tmp;
            }
          }
        };

        const maskCells = level => {
          const maxLevel = 7;
          let min = 1;
          let max = 1;
          if (level > maxLevel) {
            level = maxLevel;
          }

          let copy = yuchg.cloneObject(data);
          // 每次从每行随机抽取一个
          for (let i = 0; i < level; i++) {
            let arr = [].concat(this.numArr);
            arr.sort(yuchg.randomSort);
            for (let j = 0; j < arr.length; j++) {
              let v = copy[j][arr[j] - 1];
              if (yuchg.isNumber(v)) {
                copy[j][arr[j] - 1] = { value: v };
              }
            }
          }
          return copy;
        };

        const currentLevel = Number(this.level) + Number(this.form.level);
        logger.warn("level", this.level, currentLevel);
        for (let i = 0; i < this.form.number; i++) {
          upset();
          this.content.push(maskCells(currentLevel));
        }
      } catch (e) {
        logger.warn(e);
      }
    },
    sudokuLine(option) {
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
    sudokuCell(option) {
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
    makeSudoku(data) {
      $(this.svg).empty();

      let offsetx = (this.width - 360) / 2;
      for (let m = 0; m < data.length; m++) {
        // 计算偏移位置
        let g = document.createElementNS(ycSvgNS, "g");
        g.setAttribute(
          "transform",
          `translate(${offsetx}, ${m * (360 + 20) + 20})`
        );
        const box = data[m];
        for (let i = 0; i < 9; i++) {
          for (let j = 0; j < 9; j++) {
            let cell = box[i][j];
            g.appendChild(
              this.sudokuCell({
                translatex: j * this.cellWidth,
                translatey: i * this.cellHeight,
                width: this.cellWidth,
                height: this.cellHeight,
                text: yuchg.isNumber(cell) ? cell : cell.value,
                isKey: !yuchg.isNumber(cell)
              })
            );
          }
        }

        // 绘制分割线
        for (let i = 0; i < 4; i++) {
          g.appendChild(
            this.sudokuLine({
              startx: 0,
              starty: i * 120,
              endx: 360,
              endy: i * 120,
              strokeWidth: 3
            })
          );

          g.appendChild(
            this.sudokuLine({
              startx: i * 120,
              starty: 0,
              endx: i * 120,
              endy: 360,
              strokeWidth: 3
            })
          );
        }

        this.svg.appendChild(g);
      }
    }
  },
  mounted: function() {
    this.svg = document.querySelector(".buddha-sudoku");
  },
  activated: function() {}
};
</script>
