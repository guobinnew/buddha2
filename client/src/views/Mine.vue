<template>
    <div class="container">
        <el-card shadow="hover">
            <span class="buddha-score-title">当前积分: </span><span class="buddha-score">{{ scoreSum }}</span>
            <el-button type="primary" round @click="onClickReturn" class="buddha-return">返回</el-button>
        </el-card>
        <div class="buddha-row-tabs">
            <div id="buddha-chart-pie" v-resize="onChartPieResize"></div>
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
        </div>
    </div>
</template>

<style scoped>

    .container {
        width: 100%;
        line-height: 20px;
        background-color: white;
        overflow-x: hidden;
        border-left: solid 1px #eeeeee;
    }

    .el-card {
        width: 100%;
        float: left;
        line-height: 40px;
    }

    #buddha-chart-pie {
        padding-left: 20px;
        width: 90%;
        height: 400px;
        margin-top: 60px;
    }

    .buddha-score-title {
        font-size: 24px;
    }

    .buddha-score {
        font-size: 28px;
        font-weight: bold;
    }


    .buddha-return {
        float: left;
    }

    .el-table {
        width: 90%;
        margin: 20px 40px;
    }
    .el-pagination {
        margin-top: 10px;
        margin-bottom: 40px;
    }

</style>

<script>
  import logger from "../logger";
  import yuchg from "../base";
  import ycUtils from '../utils'
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
          host: '/api/score',
          query: 'record'
        },
        chartPie: null,
        currentPage: 1,
        pageSize: 10,
        scoreData: [],
        scoreSum: 0,
        types: {
          '1': '数学',
          '2': '语文',
          '3': '英语',
          '4': '逻辑',
          '255': '其他',
        },
        categories: {
          '1': '奖励积分',
          '2': '扣除积分',
          '3': '兑换积分'
        }
      }
    },
    computed: {
      queryUrl: function () {
        return this.urls.host + '/' + this.urls.query
      },
      chartPieOpt: function () {
        let option = {
          title: {
            text: '积分活动比例',
            left: 'left'
          },
          tooltip: {
            trigger: 'item',
            formatter: "{b} : {c} ({d}%)"
          },
          legend: {
            bottom: 10,
            left: 'center',
            data: []
          },
          series: [
            {
              name: 'score',
              type: 'pie',
              radius: '65%',
              center: ['50%', '50%'],
              selectedMode: 'single',
              data: [],
              itemStyle: {
                emphasis: {
                  shadowBlur: 10,
                  shadowOffsetX: 0,
                  shadowColor: 'rgba(0, 0, 0, 0.5)'
                }
              }
            }
          ]
        };
        return option;
      }
    },
    methods: {
      onChartPieResize() {
        this.chart && this.chart.resize()
      },
      onClickReturn() {
        this.$router.go(-1)
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
        ycUtils.ajaxGet({
          url: this.queryUrl,
          success: (data) => {
            if (data.result === 0) {
              this.scoreSum = data.content.score
              this.refreshChart(data.content.records)
            } else {
              this.$message.error('读取积分记录失败 -' + data.err)
            }
          }
        });
      },
      refreshChart(data) {
        if (data) {
          this.scoreData = data
        }

        let chart_date = new Array(data.length)
        // 按类型进行数据统计
        const cateSum = {}
        for (let [k, v] of Object.entries(this.categories)) {
          cateSum[k] = {
            value: 0, name: v
          }
        }

        // 遍历数据项
        data.forEach((value, index) => {
          chart_date[index] = value.date
          cateSum[value.category].value += value.number

        })

        // 绘制图表
        this.chartPie.setOption({
          series: [
            {
              name: 'score',
              data: Object.values(cateSum)
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
      this.chartPie = echarts.init(document.querySelector("#buddha-chart-pie"));
      this.chartPie.setOption(this.chartPieOpt);
      // 读取积分记录
      this.fetchRecords()
    }
  }
</script>
