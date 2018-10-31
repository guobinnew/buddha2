<template>
    <el-tabs tab-position="left" value="chart">
        <el-tab-pane label="统计图表" name="chart">
            <div id="buddha-chart" v-resize="onChartResize"></div>
            <div id="buddha-chart-time"></div>
        </el-tab-pane>
        <el-tab-pane label="成绩管理" name="manager">
            <el-collapse accordion>
                <el-collapse-item>
                    <template slot="title">
                        添加成绩<i class="header-icon fa fa-plus-square"></i>
                    </template>
                    <el-form ref="form" :model="form" label-width="80px">
                        <el-form-item label="日期">
                            <el-col :span="11">
                                <el-date-picker type="date" placeholder="选择日期" format="yyyy 年 MM 月 dd 日"
                                                value-format="yyyy-MM-dd" v-model="form.date"
                                                style="width: 100%;">
                                </el-date-picker>
                            </el-col>
                            <el-col class="line" :span="2">难度</el-col>
                            <el-col :span="11">
                                <el-radio-group v-model="form.level">
                                    <el-radio label="1">初级</el-radio>
                                    <el-radio label="2">中级</el-radio>
                                    <el-radio label="3">高级</el-radio>
                                </el-radio-group>
                            </el-col>
                        </el-form-item>
                        <el-form-item label="数目">
                            <el-input-number v-model="form.number" :step="10" :min="0" :max="100"></el-input-number>
                            <span class="buddha-tag">错误数目</span>
                            <el-input-number v-model="form.wrong" :step="1" :min="0" :max="100"></el-input-number>
                        </el-form-item>
                        <el-form-item label="用时">
                            <el-input-number v-model="form.minute" :step="10" :min="0" :max="100"
                                             controls-position="right"></el-input-number>
                            <span class="buddha-tag">分钟</span>
                            <el-input-number v-model="form.second" :step="1" :min="0" :max="100"
                                             controls-position="right"></el-input-number>
                            <span class="buddha-tag">秒</span>
                        </el-form-item>
                        <el-form-item>
                            <el-button type="primary" @click="onAddRecord">添加</el-button>
                        </el-form-item>
                    </el-form>
                </el-collapse-item>
            </el-collapse>
            <div style="text-align:left;">
                <el-button-group>
                    <el-button type="success" icon="el-icon-arrow-left">重新加载</el-button>
                    <el-button type="danger">导出<i class="el-icon-arrow-right el-icon--right"></i></el-button>
                </el-button-group>
            </div>
            <el-table
                    border
                    ref="wordTable"
                    :data="scoreData.slice((currentPage-1) * pageSize, currentPage * pageSize)"
                    stripe
                    tooltip-effect="dark"
                    style="width: 100%">
                <el-table-column
                        prop="date"
                        label="日期"
                        header-align="center"
                        width="180">
                </el-table-column>
                <el-table-column
                        prop="level"
                        label="难度"
                        header-align="center"
                        width="60">
                </el-table-column>
                <el-table-column
                        prop="sum"
                        label="题目数目"
                        header-align="center"
                        width="100">
                </el-table-column>
                <el-table-column
                        prop="wrong"
                        label="错误数目"
                        header-align="center"
                        width="100">
                </el-table-column>
                <el-table-column
                        prop="time"
                        header-align="center"
                        label="用时">
                </el-table-column>
                <el-table-column
                        fixed="right"
                        header-align="center"
                        label="操作">
                    <template slot-scope="scope">
                        <el-button type="text" size="small">编辑</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <el-pagination
                    background
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :current-page="currentPage"
                    :page-sizes="[10, 20, 50]"
                    :page-size="pageSize"
                    layout="prev, pager, next, sizes"
                    :total="scoreData.length">
            </el-pagination>
        </el-tab-pane>
    </el-tabs>
</template>

<style scoped>
    .hidden {
        display: none;
    }

    .header-icon {
        margin-left: 10px;
        font-size: 1.33333333em;
        line-height: .75em;
    }

    .el-tab-pane {
        min-width: 800px;
    }

    .el-collapse {
        margin-bottom: 20px;
    }

    .el-form-item {
        text-align: left;
    }

    .el-button-group {
        margin-bottom: 20px;
    }

    .el-pagination {
        margin-top: 20px;
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
        height: 400px;
    }

    #buddha-chart-time {
        width: 100%;
        height: 400px;
    }

    .buddha-tag {
        margin-left: 10px;
        margin-right: 10px;
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
    data: function () {
      return {
        chart: null,
        form: {
          date: "",
          number: 40,
          level: "2",
          wrong: 0,
          minute: 0,
          second: 0
        },
        currentModified: [],
        currentPage: 1,
        pageSize: 10,
        scoreData: [
          {"date":"2018-09-20","level":2,"sum":40,"wrong":3,"time":300},
          {"date":"2018-09-20","level":2,"sum":40,"wrong":3,"time":300},
          {"date":"2018-09-20","level":2,"sum":40,"wrong":3,"time":300},
          {"date":"2018-09-20","level":2,"sum":40,"wrong":3,"time":300},
          {"date":"2018-09-20","level":2,"sum":40,"wrong":3,"time":300}
        ]
      };
    },
    computed: {
      chartOpt: function () {
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
              mark: {show: true},
              dataView: {show: true, readOnly: false},
              magicType: {show: true, type: ["line", "bar"]},
              restore: {show: true},
              saveAsImage: {show: true}
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
                  {type: "max", name: "最大值"},
                  {type: "min", name: "最小值"}
                ]
              },
              markLine: {
                data: [{type: "average", name: "平均值"}]
              }
            },
            {
              name: "最低气温",
              type: "line",
              data: [1, -2, 2, 5, 3, 2, 0],
              markPoint: {
                data: [{name: "周最低", value: -2, xAxis: 1, yAxis: -1.5}]
              },
              markLine: {
                data: [{type: "average", name: "平均值"}]
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
      },
      onAddRecord() {

      },
      handleCurrentChange: function (currentPage) {
        this.currentPage = currentPage;
      },
      handleSizeChange(val) {
        this.pageSize = val
        this.currentPage = 1
      }
    },
    mounted: function () {
      let $dom = $(this.$el);
      this.chart = echarts.init($dom.find("#buddha-chart")[0]);
      this.chart.setOption(this.chartOpt);

      // 读取成绩
      $.getJSON("", "", function (data) {

      })
    },
    activated: function () {
    }
  };
</script>

