<template>
  <div style="overflow: hidden;">
    <el-collapse v-model="activeName" accordion>
          <el-collapse-item title="成绩管理" name="1">
           <el-form ref="form" :model="form" label-width="80px">
            <el-form-item label="日期">
               <el-col :span="11">
                <el-date-picker type="date" placeholder="选择日期" format="yyyy 年 MM 月 dd 日" value-format="yyyy-MM-dd" v-model="form.date" style="width: 100%;"></el-date-picker>
              </el-col>
              <el-col class="line" :span="2">数目</el-col>
              <el-col :span="11">
                <el-input-number v-model="form.number" :step="10" :min="10" :max="80"></el-input-number>
              </el-col>
            </el-form-item>
            <el-form-item label="难度">
              <el-radio-group v-model="form.level">
                <el-radio label="1">初级</el-radio>
                <el-radio label="2">中级</el-radio>
                <el-radio label="3">高级</el-radio>
              </el-radio-group>
            </el-form-item>
           </el-form>
          </el-collapse-item>
        </el-collapse>
    <div id="buddha-chart" v-resize="onChartResize"></div>
    <div id="buddha-chart-time"></div>
  </div>
</template>

<style scoped>
.hidden {
  display: none;
}

.el-collapse {
  margin-bottom: 20px;
}

.el-form-item {
  text-align: left;
}

.line {
  text-align: right;
  float: left;
  font-size: 14px;
  color: #606266;
  line-height: 40px;
  padding: 0 12px 0 0;
}


#buddha-chart {
  width: 100%;
  height: 600px;
}

#buddha-chart-time {
  width: 100%;
  height: 600px;
}

</style>

<script>
import logger from "../../logger";
import utils from "./utils";
import $ from "jquery";
import yuchg from "../../base";
import echarts from "echarts";
import resize from 'vue-resize-directive'

export default {
  props: ["source"],
  directives: {
    resize,
  },
  data: function() {
    return {
      chart: null,
      activeName: "1",
      form: {
        date: "",
        number: 40,
        level: "2"
      }
    };
  },
  computed: {
    chartOpt: function() {
      let option = {
        title: {
          text: "未来一周气温变化",
          subtext: "纯属虚构"
        },
        tooltip: {
          trigger: "axis"
        },
        legend: {
          data: ["最高气温", "最低气温"]
        },
        toolbox: {
          show: true,
          feature: {
            mark: { show: true },
            dataView: { show: true, readOnly: false },
            magicType: { show: true, type: ["line", "bar"] },
            restore: { show: true },
            saveAsImage: { show: true }
          }
        },
        calculable: true,
        xAxis: [
          {
            type: "category",
            boundaryGap: false,
            data: ["周一", "周二", "周三", "周四", "周五", "周六", "周日"]
          }
        ],
        yAxis: [
          {
            type: "value",
            axisLabel: {
              formatter: "{value} °C"
            }
          }
        ],
        series: [
          {
            name: "最高气温",
            type: "line",
            data: [11, 11, 15, 13, 12, 13, 10],
            markPoint: {
              data: [
                { type: "max", name: "最大值" },
                { type: "min", name: "最小值" }
              ]
            },
            markLine: {
              data: [{ type: "average", name: "平均值" }]
            }
          },
          {
            name: "最低气温",
            type: "line",
            data: [1, -2, 2, 5, 3, 2, 0],
            markPoint: {
              data: [{ name: "周最低", value: -2, xAxis: 1, yAxis: -1.5 }]
            },
            markLine: {
              data: [{ type: "average", name: "平均值" }]
            }
          }
        ]
      };
      return option;
    }
  },
  methods: {
    onChartResize() {
      this.chart && this.chart.resize()
    }
  },
  mounted: function() {
    let $dom = $(this.$el);
    this.chart = echarts.init($dom.find("#buddha-chart")[0]);
    this.chart.setOption(this.chartOpt);

    // 读取成绩
    $.getJSON("","",function(data){

    })
  },
  activated: function() {
  }
};
</script>

