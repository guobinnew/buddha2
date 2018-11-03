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
      loadedType: "",
      words: [],
      svg: null,
      width: 800,
      height: 800,
      content: [],
      currentLevel: 0,
      levels: [6, 8, 10, 12, 15, 18, 20],
      types: {
        "1": "words",
        "2": "glossary"
      }
    };
  },
  computed: {},
  methods: {
    onClickTest() {
      const callback = () => {
        this.content = [];
        if (!this.searchGenerate()) {
          return;
        }
        this.makeSearch(this.content);
      };
      if (!this.loadedType !== this.form.type) {
        this.fetchWords(this.form.type, callback);
      } else {
        callback();
      }
    },
    onClickExport() {
      // 导出为PNG文件
      let date = yuchg.currentTimeString();
      svg2png.saveSvgAsPng(this.svg, "找单词" + date + ".png");
    },
    onClickAnswer() {
      let keys = document.querySelectorAll(
        "svg.buddha-search .buddha-cell-key"
      );
      keys.forEach(function(v) {
         v.classList.toggle("buddha-show")
        if (v.tagName === "rect") {
          v.style.fill = v.classList.contains("buddha-show") ? "#999" : "#fff";
        } else {
          v.style.fontWeight = v.classList.contains("buddha-show") ? "bold" : "normal";
        }
      });
    },
    searchGenerate() {
      // 生成游戏数据
      try {
        if (this.words.length < 10) {
          this.$message.error("词汇数目太少，请录入语文或英语词汇");
          return false;
        }

        // 根据难度确定曲线节点数目
        this.currentLevel = Number(this.level) + Number(this.form.level);
        if (this.currentLevel >= this.levels.length) {
          this.currentLevel = this.levels.length - 1;
        }

        this.gridGenerate();
        return true;
      } catch (e) {
        logger.warn(e);
        return false;
      }
    },
    gridGenerate() {
      //
      const size = this.levels[this.currentLevel];

      this.content = new Array(size);
      for (let i = 0; i < size; i++) {
        this.content[i] = new Array(size).fill(null).map(v => {
          return {
            word: "",
            key: false
          };
        });
      }
      const data = this.content;
      const sortedWords = yuchg.shuffle(this.words);

      const check = (pos, dir, word) => {
        let found = true;
        let cur = Object.assign({}, pos);
        for (let i = 0; i < word.length; i++) {
          if (cur.col >= size || cur.row >= size) {
            found = false;
            break;
          }
          let cell = data[cur.row][cur.col];
          if (dir === 1) {
            cur.col += 1;
          } else if (dir === 2) {
            cur.row += 1;
          } else {
            cur.col += 1;
            cur.row += 1;
          }
          if (cell.word === "" ||  cell.word === word[i]) {
            continue;
          }
          found = false;
          break;
        }
        return found;
      };

      const samplePos = (dir, word) => {
        let pos = {
          row: yuchg.randomNumber(size - 1, 0),
          col: yuchg.randomNumber(size - 1, 0),
          valid: false
        };
        // 判断是否符合条件，如果不符合，则继续搜索
        let tryNum = size;
        while (!check(pos, dir, word) && tryNum > 0) {
          // 沿对角线移动
          pos.row = (pos.row + 1) % size;
          pos.col = (pos.col + 1) % size;
          tryNum -= 1;
        }

        pos.valid = tryNum > 0;
        return pos;
      };

      // 填字
      let maxnum = Math.floor((size * size) / 2); // 最多填字比例
      let wordIndex = 0;
      let num = 0;
      let directions = [1, 2, 3]; // 水平 垂直 对角线
      let fail = sortedWords.length; // 允许失败次数，如果超过则中止
      let c = { row: 0, col: 0, valid: false };
      let valids = [];
      while (num < maxnum && fail > 0) {
        let w = sortedWords[wordIndex];
        let success = false;
        if (w.length < size * 0.8) {
          // 如果一个方向找不到则换一个方向
          directions = yuchg.shuffle(directions)
          for (let m=0; m<directions.length; m++) {
            let dir = directions[m]
            // 随机选取一个起始位置
            c = samplePos(dir, w);
            if (!c.valid) {
              continue;
            }

            if (dir === 1) {
              for (let j = 0; j < w.length; j++) {
                data[c.row][c.col + j].word = w[j];
                data[c.row][c.col + j].key = true;
              }
            } else if (dir === 2) {
              for (let j = 0; j < w.length; j++) {
                data[c.row + j][c.col].word = w[j];
                data[c.row + j][c.col].key = true;
              }
            } else {
              for (let j = 0; j < w.length; j++) {
                data[c.row + j][c.col + j].word = w[j];
                data[c.row + j][c.col + j].key = true;
              }
            }
            num += w.length;
            success = true;
            valids.push(wordIndex);
            break;
          }
        }
        fail -= success ? 0 : 1;
        while (
          valids.indexOf(wordIndex) >= 0 &&
          wordIndex < sortedWords.length
        ) {
          wordIndex += 1;
        }
        if (wordIndex >= sortedWords.length) {
          break;
        }
      }

      // 在空白区域随机填字
      let disturb = [];
      num = 0;
      wordIndex = wordIndex % sortedWords.length;
      while (num < maxnum) {
        wordIndex = yuchg.randomNumber(sortedWords.length - 1, 0);
        let w = sortedWords[wordIndex];
        for (let i = 0; i < w.length; i++) {
          disturb.push(w[i]);
        }
        num += w.length;
      }

      disturb = yuchg.shuffle(disturb);

      data.forEach(row => {
        row.forEach(v => {
          if (v.word === "") {
            v.word = disturb[yuchg.randomNumber(disturb.length - 1, 0)];
          }
        });
      });
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
      rect.setAttribute("stroke", "#333");
      rect.setAttribute("fill", "#fff");
      option.key && rect.classList.add("buddha-cell-key");
      rect.classList.add("buddha-cell-bg");
      g.appendChild(rect);

      let text = document.createElementNS(ycSvgNS, "text");
      text.setAttribute("x", option.width / 2);
      text.setAttribute("y", option.height / 2);
      text.setAttribute("dy", "0");
      text.setAttribute("text-anchor", "middle");
      text.setAttribute("dominant-baseline", "central");
      text.classList.add("buddha-cell-text");
      option.key && text.classList.add("buddha-cell-key");
      text.textContent = option.text;
      g.appendChild(text);
      return g;
    },
    makeSearch(data) {
      $(this.svg).empty();

      const size = this.levels[this.currentLevel];
      let boxWidth = size * 40;
      let boxHeight = size * 40;
      let offsetx = (this.width - boxWidth) / 2;
      let offsety = (this.height - boxHeight) / 2;

      // 计算偏移位置
      let g = document.createElementNS(ycSvgNS, "g");
      g.setAttribute("transform", `translate(${offsetx}, ${offsety})`);

      //边框
      let rect = document.createElementNS(ycSvgNS, "rect");
      rect.setAttribute("width", boxWidth);
      rect.setAttribute("height", boxHeight);
      rect.setAttribute("stroke", "#333");
      rect.setAttribute("stroke-width", "5");
      rect.setAttribute("fill", "#fff");
      rect.classList.add("buddha-cell-bg");
      g.appendChild(rect);

      for (let i = 0; i < size; i++) {
        for (let j = 0; j < size; j++) {
          let cell = data[i][j];
          g.appendChild(
            this.searchCell({
              translatex: j * 40,
              translatey: i * 40,
              width: 40,
              height: 40,
              text: cell.word,
              key: cell.key
            })
          );
        }
      }

      this.svg.appendChild(g);
    },
    statWords(type, data) {
      this.words = [];
      for (let sec of Object.values(data)) {
        sec.forEach(ch => {
          ch.forEach(v => {
            this.words.push(type === "1" ? v : v[0].toLowerCase());
          });
        });
      }
    },
    fetchWords(type, callback) {
      if (this.url === "" || this.loaded) {
        return;
      }

      ycUtils.ajaxGet({
        url: this.url + `/${this.types[this.form.type]}/${this.grade}`,
        success: data => {
          if (data.result === 0) {
            this.statWords(type, data.content);
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
