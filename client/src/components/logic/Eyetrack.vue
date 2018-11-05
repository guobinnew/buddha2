<template>
    <div style="overflow: hidden;">
        <el-button-group>
            <el-button type="primary" icon="fa fa-arrow-left" @click="onClickTest">随机生成</el-button>
            <el-button type="success" icon="fa fa-arrow-right" @click="onClickExport">保存为图片</el-button>
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
                            <el-radio label="3">数学</el-radio>
                        </el-radio-group>
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
import * as d3 from "d3";

const ycSvgNS = "http://www.w3.org/2000/svg";

export default {
  props: ["url", "grade"],
  data: function() {
    return {
      form: {
        level: "1",
        type: "1"
      },
      loadedType: "",
      words: [],
      svg: null,
      width: 1200,
      height: 1600,
      content: [],
      currentLevel: 1,
      types: {
        "1": "words",
        "2": "glossary"
      },
      levels: [
        { num: 10, fontSize: 50},
        { num: 50, fontSize: 40},
        { num: 100, fontSize: 30},
        { num: 200, fontSize: 20}
      ]
    };
  },
  computed: {},
  methods: {
    onClickTest() {
      const callback = () => {
        this.content = [];
        if (!this.eyetrackGenerate()) {
          return;
        }
        this.makeEyetrack(this.content);
      };
      if (!this.loadedType !== this.form.type && this.form.type !== '3') {
        this.fetchWords(this.form.type, callback);
      } else {
        callback();
      }
    },
    onClickExport() {
      // 导出为PNG文件
      let date = yuchg.currentTimeString();
      svg2png.saveSvgAsPng(this.svg, "视觉追踪" + date + ".png");
    },
    shuffleWords(num) {
      if (num < 10) {
        num = 10;
      }
      let list = [];
      if (num >= this.words.length) {
        list = this.words.map(v => {
          return { word: v, value: yuchg.randomNumber(1000, 1) };
        });
      } else {
        let selected = [];
        while (list.length <= num) {
          let index = yuchg.randomNumber(this.words.length - 1, 0);
          if (selected.indexOf(index) < 0) {
            list.push({
              word: this.words[index],
              value: yuchg.randomNumber(1000, 1)
            });
            selected.push(index);
          }
        }
      }
      list = yuchg.shuffle(list);
      return list;
    },
    eyetrackGenerate() {
      // 生成填字游戏数据
      try {
       
        // 根据难度确定曲线节点数目
        this.currentLevel = Number(this.form.level);
        // 根据数据随机选取单词
        if (this.form.type === '3') {
          this.content = d3.range(this.levels[this.currentLevel].num).map(function(v, i) {
              return {
                name: "" + (i + 1),
                count: yuchg.randomNumber(10000, 1000)
              };
          });
        } else {
           if (this.words.length < 10) {
          this.$message.error("数目太多，请减少数目或者录入语文或英语词汇");
          return false;
        }
          this.content = this.shuffleWords(this.currentLevel * 10).map(function(v, i) {
              return {
                name: v,
                count: yuchg.randomNumber(10000, 1000)
              };
          })
        }
        return true;
      } catch (e) {
        logger.warn(e);
      }
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

      let svg = d3.select(this.svg),
        width = +svg.attr("width"),
        height = +svg.attr("height");
      let format = d3.format(",d");

      let pack = d3
        .pack()
        .size([width, height])
        .padding(1.5);
      let num, pid;
      let root = d3
        .hierarchy({ children: data })
        .sum(function(d) {
          return d.count;
        })
        .each(function(d) {
          if (d.parent == null) {
            num = d.value;
          }
          let id = d.data.name;
          if (id) {
            d.id = id;
            d.class = id;
          }
        });
      let node = svg
        .selectAll(".node")
        .data(pack(root).leaves())
        .enter()
        .append("g")
        .attr("class", "node")
        .attr("transform", function(d) {
          return "translate(" + d.x + "," + d.y + ")";
        });

      node
        .append("circle")
        .attr("id", function(d) {
          return d.id;
        })
        .attr("r", function(d) {
          return d.r;
        })
        .style("stroke", function(d) {
          return "#333";
        })
        .style("fill", function(d) {
          return "#fff";
        });

      node
        .append("clipPath")
        .attr("id", function(d) {
          return "clip-" + d.id;
        })
        .append("use")
        .attr("xlink:href", function(d) {
          return "#" + d.id;
        });

      node
        .append("text")
        .attr("text-anchor", "middle")
        .attr("font-size", `${this.levels[this.currentLevel].fontSize}`)
        .attr("clip-path", function(d) {
          return "url(#clip-" + d.id + ")";
        })
        .selectAll("tspan")
        .data(function(d) {
          var arr = new Array();
          arr.push(d.class);
          return arr; //圆内显示内容
        })
        .enter()
        .append("tspan")
        .attr("x", 0)
        .attr("y", function(d, i, nodes) {
          return `${i - nodes.length / 2 + 0.8}em`;
        })
        .text(function(d) {
          return d;
        });

      node.append("title").text(function(d) {
        return d.id;
      });
      node.on("click", function(d) {
        clickBubble(d.id); //自定义点击事件
      });
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
    this.svg = document.querySelector(".buddha-eyetrack");
  },
  activated: function() {}
};
</script>
