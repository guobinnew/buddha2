<template>
    <el-tabs tab-position="left" value="chart">
        <el-tab-pane label="统计图表" name="chart">
            <div id="buddha-chart" v-resize="onChartResize"></div>
        </el-tab-pane>
        <el-tab-pane label="记录管理" name="manager">
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
                                    <el-radio v-for="(val, key, index) in levels" :label="key">{{ val }}</el-radio>
                                </el-radio-group>
                            </el-col>
                        </el-form-item>
                        <el-form-item label="数目">
                            <el-input-number v-model="form.number" :step="10" :min="0" :max="100"></el-input-number>
                            <span class="buddha-tag">错误数目</span>
                            <el-input-number v-model="form.wrong" :step="1" :min="0" :max="100"></el-input-number>
                        </el-form-item>
                        <el-form-item label="用时">
                            <el-input-number v-model="form.minute" :step="1" :min="0" :max="100"
                                             controls-position="right"></el-input-number>
                            <span class="buddha-tag">分钟</span>
                            <el-input-number v-model="form.second" :step="10" :min="0" :max="100"
                                             controls-position="right"></el-input-number>
                            <span class="buddha-tag">秒</span>
                        </el-form-item>
                        <el-form-item>
                            <el-button type="primary" @click="onAddRecord">添加</el-button>
                        </el-form-item>
                    </el-form>
                </el-collapse-item>
            </el-collapse>
            <el-button-group>
              <el-button type="primary" icon="el-icon-edit" @click="onClickSave">保存修改</el-button>
              <el-button type="success" icon="el-icon-share" @click="onClickRefresh">重新加载</el-button>
            </el-button-group>
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
                        sortable
                        header-align="center"
                        width="180">
                </el-table-column>
                <el-table-column
                        label="难度"
                        header-align="center"
                        width="60">
                        <template slot-scope="scope">
                            {{ formatLevel(scope.row.level) }}
                        </template>
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
                        header-align="center"
                        label="用时">
                    <template slot-scope="scope">
                        {{ formatTime(scope.row.time) }}
                    </template>
                </el-table-column>
                <el-table-column
                        fixed="right"
                        header-align="center"
                        label="操作">
                        <template slot-scope="scope">
                            <el-button
                                    size="mini"
                                    type="danger"
                                    @click="handleDelete(scope.$index, scope.row)">删除</el-button>
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
        height: 600px;
    }

    .buddha-tag {
        margin-left: 10px;
        margin-right: 10px;
    }
</style>

<script>
  import logger from "../../logger";
  import utils from "./utils";
  import yuchg from "../../base";
  import ycUtils from '../../utils'
  import echarts from "echarts";
  import resize from 'vue-resize-directive'
  import CryptoJS from "crypto-js";
  import saveAs from "file-saver";

  export default {
    props: ["source"],
    directives: {
      resize,
    },
    data: function () {
      return {
        url: '',
        chart: null,
        form: {
          date: "",
          number: 40,
          level: "2",
          wrong: 0,
          minute: 5,
          second: 0,
          score: 0
        },
        currentModified: {},
        currentPage: 1,
        pageSize: 10,
        scoreData: [],
        modified: false,
         levels:{
          '1': '初级',
          '2': '中级',
          '3': '高级'
        },
      };
    },
    computed: {
      chartOpt: function () {
        let option = {
          title: {
            text: "口算成绩趋势图"
          },
          tooltip: {
            trigger: "axis"
          },
          grid: {
            left: '10%',
            right: '10%',
            bottom: '15%'
          },
          legend: {
            data: ["题目总数", "错误数目", "完成时间"]
          },
          toolbox: {
            show: true,
            feature: {
              mark: {show: true},
              dataView: {show: true, readOnly: true},
              restore: {show: true},
              saveAsImage: {show: true}
            }
          },
          dataZoom: [
            {
              show: true,
              type: 'slider',
              y: '90%',
              start: 0,
              end: 100
            }
          ],
          calculable: true,
          xAxis: [
            {
              type: "category",
              boundaryGap: false,
              data: []
            }
          ],
          yAxis: [
            {
              type: "value",
              name: '数目',
              axisLabel: {
                formatter: "{value}"
              }
            },
            {
              type: "value",
              name: "时间（秒）",
              axisLabel: {
                formatter: "{value}"
              }
            }
          ],
          series: [
            {
              name: "题目总数",
              type: "line",
              smooth: true,
              data: [],
            },
            {
              name: "错误数目",
              type: "line",
              smooth: true,
              data: [],
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
              name: "完成时间",
              type: "line",
              smooth: true,
              yAxisIndex: 1,
              data: [],
              markPoint: {
                data: [
                  {type: "max", name: "最大值"},
                  {type: "min", name: "最小值"}
                ]
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
        // 添加新记录, 按日期排序
        const newRecord = {
          date: this.form.date,
          level: Number(this.form.level),
          sum: this.form.number,
          time: this.form.minute * 60 + this.form.second,
          wrong: this.form.wrong
        }

        if (!newRecord.date || newRecord.date === '') {
          newRecord.date = new Date()
        }

        let inserted = false
        let newData = []
        this.scoreData.forEach((value, index) => {
          if (!inserted) {
            let res = utils.dateCompare(value.date, newRecord.date)
            if (res === 0) {
              //  替换当前项
              newData.push(newRecord)
              inserted = true
            } else if (res > 0) {
              newData.push(newRecord, value)
              inserted = true
            } else {
               newData.push(value)
            }
          } else {
            newData.push(value)
          }
        })
        if (!inserted) {
          newData.push(newRecord)
        }
        this.modified = true
        this.refreshChart(newData)
        this.$message('记录添加成功')
      },
      formatTime(time) {
        return utils.time2String(+time)
      },
      formatLevel(t) {
        return this.levels[t]
      },
      handleCurrentChange: function (currentPage) {
        this.currentPage = currentPage;
      },
      handleSizeChange(val) {
        this.pageSize = val
        this.currentPage = 1
      },
      refreshChart(data) {
        if (data) {
          this.scoreData = data
        }
   
        let chart_date = new Array(data.length)
        let chart_sum = new Array(data.length)
        let chart_wrong = new Array(data.length)
        let chart_time = new Array(data.length)

        // 遍历数据项
        data.forEach( (value, index) => {
          chart_date[index] = value.date
          chart_sum[index] = value.sum
          chart_wrong[index] = value.wrong
          chart_time[index] = value.time
        })

        // 绘制图表
        this.chart.setOption({
          xAxis: {
            data: chart_date
          },
          series: [
            {
              // 根据名字对应到相应的系列
              name: '题目总数',
              data: chart_sum
            },
            {
              // 根据名字对应到相应的系列
              name: '错误数目',
              data: chart_wrong
            },
            {
              // 根据名字对应到相应的系列
              name: '完成时间',
              data: chart_time
            }
          ]
        })
      },
      handleDelete(index, row) {
        // 删除所在行数据
        const realIndex = (this.currentPage - 1) * this.pageSize + index
        this.$confirm("确认删除该条记录?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(() => {
          // 发送删除请求
          logger.warn(this.scoreData, realIndex, index)
            this.scoreData.splice(realIndex, 1)
            this.modified = true
            this.refreshChart()
            this.$message("记录已成功删除");
        }).catch(() => {
        });
      },
      onClickRefresh() {
        if (this.modified) {
        // 有修改
        this.$confirm("确认重新加载，放弃当前的修改?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
        .then(() => {
           // 重新加载
           this.currentPage = 1
           this.fetchRecords()
        })
        .catch(() => {
        });
      } else {
        this.currentPage = 1
         this.fetchRecords()
      }
    },
    onClickSave() {
      // 保存当前修改
      let vm = this;
      ycUtils.ajaxPost({
        url: this.url,
        data: this.scoreData,
        success: (data) => {
          if (data.result == 0) {
            // 成功
            vm.$message("成绩记录保存成功")
          } else {
            vm.$message("成绩记录保存失败: " + data.err);
          }
        }
      });
    },
    fetchRecords() {
      // 读取成绩
      let vm = this
      ycUtils.ajaxGet({
        url:  this.url,
        success:  (data) => {
          if (data.result === 0) {
            logger.warn(data)
            vm.refreshChart(data.content)
          } else {
            vm.$message.error('读取成绩表失败 -' + data.err)
          }
        }
      });
    }
    },
    mounted: function () {
      this.url = `http://localhost:3000/api/score/${this.source}/oral`
      this.form.date = utils.currentTimeString()
      this.chart = echarts.init(document.querySelector("#buddha-chart"));
      this.chart.setOption(this.chartOpt);
      // 读取成绩
      this.fetchRecords()
    },
    activated: function () {
    }
  };
</script>

