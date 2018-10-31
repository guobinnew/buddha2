<template>
    <div class="container">
        <el-row>
            <el-card shadow="hover">
                <span class="buddha-score-title">当前积分: </span><span class="buddha-score">{{ scoreSum }}</span>
                <el-button type="primary" round @click="onClickReturn" class="buddha-return">返回</el-button>
            </el-card>
        </el-row>
        <el-tabs tab-position="left" value="chart">
            <el-tab-pane label="统计图表" name="chart">
                <div id="buddha-chart" v-resize="onChartResize"></div>
            </el-tab-pane>
            <el-tab-pane label="积分管理" name="manager">
                <el-collapse accordion>
                    <el-collapse-item>
                        <template slot="title">
                            添加记录<i class="header-icon fa fa-plus-square"></i>
                        </template>
                        <el-form ref="form" :model="form" label-width="80px">
                            <el-form-item label="日期">
                                <el-date-picker type="date" placeholder="选择日期" format="yyyy 年 MM 月 dd 日"
                                                value-format="yyyy-MM-dd" v-model="form.date">
                                </el-date-picker>
                            </el-form-item>
                            <el-form-item label="操作">
                                <el-radio-group v-model="form.category">
                                    <el-radio v-for="(val, key, index) in categories" :label="key">{{ val }}</el-radio>
                                </el-radio-group>
                            </el-form-item>
                            <el-form-item label="课程">
                                <el-radio-group v-model="form.type">
                                    <el-radio v-for="(val, key, index) in types"  :label="key">{{ val }}</el-radio>
                                </el-radio-group>
                            </el-form-item>
                            <el-form-item label="积分值">
                                <el-input-number v-model="form.number" :step="10" :min="1" :max="1000000"
                                                 controls-position="right"></el-input-number>
                            </el-form-item>
                            <el-form-item label="说明">
                                <el-input v-model="form.desc" placeholder="请输入内容" style="width:60%;"></el-input>
                            </el-form-item>
                            <el-form-item>
                                <el-button type="primary" @click="onAddRecord">添 加</el-button>
                            </el-form-item>
                        </el-form>
                    </el-collapse-item>
                </el-collapse>
                <el-table
                        border
                        ref="scoreTable"
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
                            prop="category"
                            label="操作类型"
                            header-align="center"
                            width="100">
                        <template slot-scope="scope">
                            {{ formatCategory(scope.row.category) }}
                        </template>
                    </el-table-column>
                    <el-table-column
                            prop="number"
                            label="积分值"
                            header-align="center"
                            width="120">
                    </el-table-column>
                    <el-table-column
                            prop="type"
                            label="课程"
                            header-align="center"
                            width="100">
                        <template slot-scope="scope">
                            {{ formatType(scope.row.type) }}
                        </template>
                    </el-table-column>
                    <el-table-column
                            prop="desc"
                            label="说明"
                            header-align="center">
                    </el-table-column>
                    <el-table-column
                            fixed="right"
                            header-align="center"
                            label="操作"
                            width="150">
                        <template slot-scope="scope">
                            <el-button
                                    size="mini"
                                    type="primary"
                                    @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
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
    </div>
</template>

<style scoped>
    .container {
        line-height: 20px;
        background-color: white;
    }

    .el-button-group {
        margin: 10px;
    }

    .el-collapse {
        margin-bottom: 10px;
    }

    #buddha-chart {
        width: 100%;
        height: 500px;
    }

    .buddha-score-title {
        font-size: 24px;
    }

    .buddha-score {
        font-size: 28px;
        font-weight: bold;
    }

    .el-row {
        line-height: 30px;
        vertical-align: center;
        margin-bottom: 10px;
    }

    .buddha-return {
        float: right;
    }

    .el-tab-pane {
        padding: 20px;
    }

    .el-pagination {
        margin-top: 10px;
    }

</style>

<script>
  import logger from "../logger";
  import $ from "jquery";
  import yuchg from "../base";
  import echarts from "echarts";
  import resize from 'vue-resize-directive'
  import CryptoJS from "crypto-js";
  import saveAs from "file-saver";

  export default {
    directives: {
      resize
    },
    data: function () {
      return {
        urls: {
          host: 'http://localhost:3000/api/score',
          query: 'record',
          update: 'update'
        },
        chart: null,
        currentPage: 1,
        pageSize: 10,
        scoreData: [],
        scoreSum: 0,
        form: {
          date: '',
          type: '1',
          number: 1,
          desc: '',
          category: '1',
        },
        types:{
          '1': '数学',
          '2': '语文',
          '3': '英语',
          '4': '逻辑',
          '255': '其他',
        },
        categories: {
          '1' : '奖励积分',
          '2' : '扣除积分',
          '3' : '兑换积分'
        }
      }
    },
    computed: {
      queryUrl: function () {
        return this.urls.host + '/' + this.urls.query
      },
      updateUrl: function () {
        return this.urls.host + '/' + this.urls.update
      },
      chartOpt: function () {
        let option = {
          title: {
            text: "积分累计趋势图"
          },
          tooltip: {
            trigger: "axis"
          },
          legend: {
            data: ["总积分"]
          },
          grid: {
            left: '10%',
            right: '10%',
            bottom: '15%'
          },
          toolbox: {
            show: true,
            feature: {
              mark: {show: true},
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
              name: '积分',
              axisLabel: {
                formatter: "{value}"
              }
            }
          ],
          series: [
            {
              name: "总积分",
              type: "line",
              data: [],
              markPoint: {
                data: [
                  {type: "max", name: "最大值"},
                  {type: "min", name: "最小值"}
                ]
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
      onClickReturn() {
        this.$router.go(-1)
      },
      onAddRecord() {

      },
      handleCurrentChange: function (currentPage) {
        this.currentPage = currentPage;
      },
      handleSizeChange(val) {
        this.pageSize = val
        this.currentPage = 1
      },
      fetchRecords() {
        // 读取成绩
        let vm = this
        $.ajax({
          url: this.queryUrl,
          type: "GET",
          dataType: "json", //指定服务器返回的数据类型
          success: function (data) {
            if (data.result === 0) {
              logger.warn(data)
              vm.scoreSum = data.data.score
              vm.refreshChart(data.data.records)
            } else {
              vm.$message.error('读取积分记录失败 -' + data.err)
            }
          }
        });
      },
      refreshChart(data) {
        if (data) {
          this.scoreData = data
        }

        let chart_date = new Array(data.length)
        let chart_sum = new Array(data.length)

        // 遍历数据项
        let sum = 0
        data.forEach((value, index) => {
          chart_date[index] = value.date
          chart_sum[index] = sum + value.sum
        })

        // 绘制图表
        this.chart.setOption({
          xAxis: {
            data: chart_date
          },
          series: [
            {
              // 根据名字对应到相应的系列
              name: '总积分',
              data: chart_sum
            }
          ]
        })
      },
      formatCategory(cate) {
        return this.categories[cate]
      },
      formatType(t) {
        return this.types[t]
      },
    },
    mounted: function () {
      this.form.date = yuchg.currentTimeString()
      let $dom = $(this.$el);
      this.chart = echarts.init($dom.find("#buddha-chart")[0]);
      this.chart.setOption(this.chartOpt);
      // 读取积分记录
      this.fetchRecords()
    }
  }
</script>
