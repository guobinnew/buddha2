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
                </el-form>
            </el-collapse-item>
        </el-collapse>
        <div class="buddha-svg-wrap">
          <svg class="buddha-puzzle" :width='width' :height='height' version="1.1" xmlns="http://www.w3.org/2000/svg">
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
        level: "1"
      },
      svg: null,
      width: 900,
      height: 900,
      cells: [
        {
          width: 50,
          height: 50,
          row: 4,
          col: 4
        },
        {
          width: 50,
          height: 50,
          row: 5,
          col: 5
        },
        {
          width: 50,
          height: 50,
          row: 10,
          col: 10
        },
        {
          width: 40,
          height: 40,
          row: 15,
          col: 15
        },
        {
          width: 30,
          height: 30,
          row: 20,
          col: 20
        },
        {
          width: 30,
          height: 30,
          row: 25,
          col: 25
        },
        {
          width: 20,
          height: 20,
          row: 30,
          col: 30
        },
        {
          width: 20,
          height: 20,
          row: 40,
          col: 40
        },
        {
          width: 15,
          height: 15,
          row: 50,
          col: 50
        },
        {
          width: 10,
          height: 10,
          row: 60,
          col: 60
        }
      ],
      currentLevel: 0,
      content: []
    };
  },
  computed: {},
  methods: {
    onClickTest() {
      this.content = [];
      this.puzzleGenerate();
      this.makePuzzle(this.content);
    },
    onClickExport() {
      // 导出为PNG文件
      let date = yuchg.currentTimeString();
      svg2png.saveSvgAsPng(this.svg, "迷宫" + date + ".png");
    },
    onClickAnswer() {},
    puzzleGenerate() {
      // 生成数据
      try {
        this.currentLevel = Number(this.level) + Number(this.form.level);
        if (this.currentLevel >= this.cells.length) {
          this.currentLevel = this.cells.length - 1;
        }
        //this.currentLevel = 1;
        const cell = this.cells[this.currentLevel];
        this.content = new Array(cell.row);
        for (let i = 0; i < cell.row; i++) {
          this.content[i] = new Array(cell.col).fill(null).map(v => {
            return [0, 0, 0, 0, 0]; // left top right bottom visited
          });
        }
        const data = this.content;
        let c = { row: 0, col: 0 };
        // 访问历史
        let history = [c];

        const checkCell = (row, col) => {
          if (data[row][col][4] === 1) {
            return true;
          } else if (data[row][col][4] === 0) {
            // 没有访问过
            history.push({ row: row, col: col });
            data[row][col][4] = 2; // 等待访问
          }
          return false;
        };

        while (history.length > 0) {
          // 随机选择一个单元
          let index = Math.floor(Math.random() * history.length);
          let c = history.splice(index, 1)[0];
          data[c.row][c.col][4] = 1;

          let check = []; // 左顶右底
          if (c.col > 0 && checkCell(c.row, c.col - 1)) {
            check.push(1);
          }

          if (c.row > 0 && checkCell(c.row - 1, c.col)) {
            check.push(2);
          }

          if (c.col < cell.col - 1 && checkCell(c.row, c.col + 1)) {
            check.push(3);
          }

          if (c.row < cell.row - 1 && checkCell(c.row + 1, c.col)) {
            check.push(4);
          }

          let direction = 0;
          if (check.length > 0) {
            direction = check[yuchg.randomNumber(check.length - 1, 0)];
          }

          if (direction === 1) {
            data[c.row][c.col][0] = 1; // 表示可通过
            data[c.row][c.col - 1][2] = 1;
          }

          if (direction === 2) {
            data[c.row][c.col][1] = 1;
            data[c.row - 1][c.col][3] = 1;
          }

          if (direction === 3) {
            data[c.row][c.col][2] = 1;
            data[c.row][c.col + 1][0] = 1;
          }

          if (direction === 4) {
            data[c.row][c.col][3] = 1;
            data[c.row + 1][c.col][1] = 1;
          }
        }

        // const checkCell = (row, col) => {
        //   if (data[row][col][4] === 0) {
        //     return true;
        //   }
        //   return false;
        // };

        // let c = { row: 0, col: 0 };
        // // 访问历史
        // let history = [c];

        // while (history.length > 0) {
        //   c = history[0];
        //   data[c.row][c.col][4] = 1;
        //   let check = [];

        //   if (c.col > 0 && checkCell(c.row, c.col - 1)) {
        //     check.push(1);
        //   }

        //   if (c.row > 0 && checkCell(c.row - 1, c.col)) {
        //     check.push(2);
        //   }

        //   if (c.col < cell.col - 1 && checkCell(c.row, c.col + 1)) {
        //     check.push(3);
        //   }

        //   if (c.row < cell.row - 1 && checkCell(c.row + 1, c.col)) {
        //     check.push(4);
        //   }

        //   let direction = 0;
        //   if (check.length > 0) {
        //     direction = check[yuchg.randomNumber(check.length - 1, 0)];

        //     if (direction === 1) {
        //       data[c.row][c.col][0] = 1; // 表示可通过
        //       c.col -= 1;
        //       data[c.row][c.col][2] = 1;
        //     }

        //     if (direction === 2) {
        //       data[c.row][c.col][1] = 1;
        //       c.row -= 1;
        //       data[c.row][c.col][3] = 1;
        //     }

        //     if (direction === 3) {
        //       data[c.row][c.col][2] = 1;
        //       c.col += 1;
        //       data[c.row][c.col][0] = 1;
        //     }

        //     if (direction === 4) {
        //       data[c.row][c.col][3] = 1;
        //       c.row += 1;
        //       data[c.row][c.col][1] = 1;
        //     }

        //     history.push(Object.assign({},c))
        //   } else {
        //     c = history.splice(0, 1);
        //   }
        // }

        data[0][0][0] = 1;
        data[cell.row - 1][cell.col - 1][2] = 1;
      } catch (e) {
        logger.warn(e);
      }
    },
    puzzleLine(option) {
      let line = document.createElementNS(ycSvgNS, "line");
      line.setAttribute("x1", option.startx);
      line.setAttribute("y1", option.starty);
      line.setAttribute("x2", option.endx);
      line.setAttribute("y2", option.endy);
      line.setAttribute("stroke-linecap", "round")
      line.setAttribute(
        "style",
        `stroke-width: ${
          option.strokeWidth ? option.strokeWidth : 1
        }; stroke: #333;`
      );
      return line;
    },
    makePuzzle(data) {
      $(this.svg).empty();

      const cell = this.cells[this.currentLevel];
      let boxWidth = cell.width * cell.col;
      let boxHeight = cell.height * cell.row;
      let offsetx = (this.width - boxWidth) / 2;
      let offsety = (this.height - boxHeight) / 2;
      // 绘制迷宫
      let g = document.createElementNS(ycSvgNS, "g");
      g.setAttribute("transform", `translate(${offsetx}, ${offsety})`);

      let rect = document.createElementNS(ycSvgNS, "rect");
      rect.setAttribute("width", boxWidth);
      rect.setAttribute("height", boxHeight);
      rect.setAttribute("stroke", "#fff");
      rect.setAttribute("fill", "#fff");
      rect.classList.add("buddha-cell-bg");
      g.appendChild(rect);

      const lines = [];
      // 边框
      lines.push({
        startx: 0,
        starty: 0,
        endx: boxWidth,
        endy: 0,
        strokeWidth: 5
      });
      lines.push({
        startx: 0,
        starty: boxHeight,
        endx: boxWidth,
        endy: boxHeight,
        strokeWidth: 5
      });
      lines.push({
        startx: 0,
        starty: cell.height,
        endx: 0,
        endy: boxHeight,
        strokeWidth: 5
      });
      lines.push({
        startx: boxWidth,
        starty: 0,
        endx: boxWidth,
        endy: boxHeight - cell.height,
        strokeWidth: 5
      });

      // 绘制迷宫墙
      let begin = { x: 0, y: 0, valid: false };
      let end = { x: 0, y: 0 };

      // 绘制横线
      for (let i = 1; i < cell.row; i++) {
        begin.valid = false;
        begin.y = i * cell.height;
        end.y = i * cell.height;

        for (let j = 0; j < cell.col; j++) {
          let d = data[i][j];
          if (d[1] === 0) {
            if (!begin.valid) {
              begin.valid = true;
              begin.x = j * cell.width;
            }
            end.x = (j + 1) * cell.width;
          } else {
            if (begin.valid) {
              // 绘制线段
              lines.push({
                startx: begin.x,
                starty: begin.y,
                endx: end.x,
                endy: end.y,
                strokeWidth: 5
              });
              begin.valid = false;
            }
          }
        }
        if (begin.valid) {
          // 绘制线段
          lines.push({
            startx: begin.x,
            starty: begin.y,
            endx: end.x,
            endy: end.y,
            strokeWidth: 5
          });
          begin.valid = false;
        }
      }

      // 绘制竖线
      for (let j = 1; j < cell.col; j++) {
        begin.valid = false;
        begin.x = j * cell.width;
        end.x = j * cell.width;

        for (let i = 0; i < cell.row; i++) {
          const d = data[i][j];
          if (d[0] === 0) {
            if (!begin.valid) {
              begin.valid = true;
              begin.y = i * cell.height;
            }
            end.y = (i + 1) * cell.height;
          } else {
            if (begin.valid) {
              // 绘制线段
              lines.push({
                startx: begin.x,
                starty: begin.y,
                endx: end.x,
                endy: end.y,
                strokeWidth: 5
              });
              begin.valid = false;
            }
          }
        }
        if (begin.valid) {
          // 绘制线段
          lines.push({
            startx: begin.x,
            starty: begin.y,
            endx: end.x,
            endy: end.y,
            strokeWidth: 5
          });
          begin.valid = false;
        }
      }

      lines.forEach(v => {
        g.appendChild(this.puzzleLine(v));
      });

      this.svg.appendChild(g);
    }
  },
  mounted: function() {
    this.svg = document.querySelector(".buddha-puzzle");
  },
  activated: function() {}
};
</script>
