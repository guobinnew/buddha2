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
                        <el-input-number v-model="form.number" :step="5" :min="10" :max="40"></el-input-number>
                    </el-form-item>
                </el-form>
            </el-collapse-item>
        </el-collapse>
        <div class="buddha-svg-wrap">
          <svg class="buddha-eyetrack" :width='width' :height='height' version="1.1" xmlns="http://www.w3.org/2000/svg">
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
        number: 1
      },
      loaded: false,
      wordSum: 0,
      words: [],
      svg: null,
      width: 800,
      height: 800,
      content: [],
      currentLevel: 0,
      levels: [1, 2, 3, 4, 5, 6, 8, 10, 12, 15, 18, 20]
    };
  },
  computed: {},
  methods: {
    onClickTest() {
      this.content = [];
      this.eyetrackGenerate();
      this.makeEyetrack(this.content);
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
    shuffleWords(num) {
      // if (num < 10) {
      //   num = 10
      // }
      num = 10;

      let list = [];
      while (list.length <= num) {
        let ch = yuchg.randomNumber(this.words.length - 1, 0);
        list = list.concat(this.words[ch]);
      }

      let indexs = new Array(num).fill(null).map((v, i) => {
        return i;
      });
      indexs = yuchg.shuffle(indexs);

      return indexs.map((v, i) => {
        return { index: v, word: list[i] };
      });
    },
    eyetrackGenerate() {
      // 生成填字游戏数据
      try {
        if (!this.loaded) {
          this.fetchWords();
          this.$message.error("正在加载词汇表，请稍后重试");
          return
        }

        if (this.wordSum < this.form.number) {
          this.$message.error("数目太多，请减少数目或者录入语文或英语词汇");
          return;
        }
        // 根据数据随机选取单词
        this.content = this.shuffleWords(this.form.number);
        // 根据难度确定曲线节点数目
        this.currentLevel = Number(this.level) + Number(this.form.level);
        if (this.currentLevel >= this.levels.length) {
          this.currentLevel = this.levels.length - 1;
        }

      } catch (e) {
        logger.warn(e);
      }
    },
    eyetrackLine(option) {
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
    textWidth(text) {
      let t = document.createElementNS(ycSvgNS, "text");
      t.textContent = text;
      t.style.visibility = "hidden";
      this.svg.appendChild(t);
      let w = t.getComputedTextLength();
      t.remove();
      return w;
    },
    eyetrackPath(option) {
      let path = document.createElementNS(ycSvgNS, "path");
      path.classList.add("buddha-cell-path");
      path.setAttribute(
        "stroke-width",
        option.strokeWidth ? option.strokeWidth : 1
      );
      let pt = option.path[0];
      let d = `M ${pt.x} ${pt.y} `;
      // 生成路径
      if (option.path.length < 5) {
        // 绘制折线
        for (let i = 1; i < option.path.length; i++) {
          pt = option.path[i];
          d += `L ${pt.x} ${pt.y} `;
        }
      } else {
        d += `L ${option.path[1].x} ${option.path[1].y}`// C ${option.path[2].x} ${option.path[2].y}, ${option.path[3].x} ${option.path[3].y}, ${option.path[4].x} ${option.path[4].y} `;
        for (let i = 2; i < option.path.length - 1; i += 2) {
          d += `T ${option.path[i].x} ${option.path[i].y}, ${option.path[i + 1].x} ${option.path[i + 1].y} `;
        }
         d += `L ${option.path[option.path.length - 1].x} ${option.path[option.path.length - 1].y} `;
      }

      path.setAttribute("d", d);
      path.setAttribute("stroke", "#333");
      path.setAttribute("fill", "#fff");
      path.setAttribute("fill-opacity", 0);
      return path;
    },
    eyetrackCell(option) {
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
    makeEyetrack(data) {
      $(this.svg).empty();

      const ptnum = 1//this.levels[this.currentLevel];
      // 绘制迷宫
      let g = document.createElementNS(ycSvgNS, "g");

      let rect = document.createElementNS(ycSvgNS, "rect");
      rect.setAttribute("width", this.width);
      rect.setAttribute("height", this.height);
      rect.setAttribute("stroke", "#fff");
      rect.setAttribute("fill", "#fff");
      rect.classList.add("buddha-cell-bg");
      g.appendChild(rect);

      let margin = 40;
      let padding = 80;
      let space = (this.height - 80) / this.content.length;
      let offsety = margin;

      let box = {
        left: padding + 120,
        right: this.width - padding - 120,
        top: margin + 60,
        bottom: this.height - margin - 60
      };

      const sample = (pt) => {
        return {
          x: yuchg.randomNumber(box.right, box.left),
          y: yuchg.randomNumber(box.top, box.bottom)
        };
      };

      const cell = [];
      logger.warn(data);
      // 生成曲线path数据
      data.forEach((w, i) => {
        let txtWidth = this.textWidth(w.word);
        // 计算起点
        let pts = [];
        pts.push( { x: padding, y: offsety + 20 })
        let lastpt = { x: padding + 60, y: offsety + 20 }
        pts.push(lastpt)


        // 随机生成中间控制点
        for (let j = 0; j < ptnum; j++) {
          let newpt = sample(lastpt)
          if ( j===0) {
          //pts.push({x: lastpt.x, y: newpt.y})
          pts.push({x: newpt.x, y: lastpt.y})
          pts.push(newpt);
          } else {
             pts.push({x: newpt.x, y: lastpt.y})
             pts.push(newpt);
          }
          lastpt = newpt
        }
        pts.push({
          x: this.width - padding,
          y: lastpt.y
        });
        pts.push({
          x: this.width - padding -60,
          y: offsety + 20 + w.index * space
        });
        pts.push({
          x: this.width - padding,
          y: offsety + 20 + w.index * space
        });

        logger.warn(pts);
        g.appendChild(
          this.eyetrackPath({
            path: pts
          })
        );

        // 绘制单词
        cell.push({
          translatex: this.width - padding,
          translatey: offsety,
          width: txtWidth + 16,
          height: 40,
          text: w.word
        });
        cell.push({
          translatex: padding - 20,
          translatey: offsety,
          width: 40,
          height: 40,
          shape: "round",
          text: "" + (i + 1)
        });

        offsety += space;
      });

      // 绘制索引
      cell.forEach(v => {
        g.appendChild(this.eyetrackCell(v));
      });

      this.svg.appendChild(g);
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
    fetchWords(callback) {
      if (this.url === "" || this.loaded) {
        return;
      }
      ycUtils.ajaxGet({
        url: this.url + `/words/${this.grade}`,
        success: data => {
          if (data.result === 0) {
            this.statWords(data.content);
            this.loaded = true;
            callback && callback();
          } else {
            this.$message.error("读取词汇表失败 -" + data.err);
          }
        }
      });
    }
  },
  mounted: function() {
    this.svg = document.querySelector(".buddha-eyetrack");
    this.fetchWords();
  },
  activated: function() {}
};
</script>
