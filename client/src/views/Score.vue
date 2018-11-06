<template>
    <div class="container">
        <el-row>
            <el-card shadow="hover">
                <span class="buddha-score-title">当前积分: </span><span class="buddha-score">{{ scoreSum }}</span>
                <el-button type="primary" round @click="onClickReturn" class="buddha-return">返回</el-button>
            </el-card>
        </el-row>
        <div class="buddha-row-tabs">
            <el-tabs tab-position="left" value="chart" @tab-click="onClickTab">
                <el-tab-pane label="统计图表" name="chart">
                    <div id="buddha-chart-pie" v-resize="onChartPieResize"></div>
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
                        <el-table-column
                                fixed="right"
                                header-align="center"
                                label="操作"
                                width="150">
                            <template slot-scope="scope">
                                <el-button
                                        disabled
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
    </div>
</template>

<style scoped>

    .container {
        line-height: 20px;
        background-color: white;
    }

    .buddha-row-tabs {
        overflow: auto;
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
        margin-top: 40px;
    }

    #buddha-chart-pie {
        width: 100%;
        height: 300px;
        border-bottom: solid 1px #eee;
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
          query: 'record',
          update: 'update'
        },
        chart: null,
        chartPie: null,
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
        let series = []
        const legend = Object.keys(this.types).map((k) => {
          series.push({
            id: k,
            name: this.types[k],
            type: "line",
            stack: "总积分",
            areaStyle: {},
            data: []
          })
          return this.types[k]
        })

        let option = {
          title: {
            text: "积分累计趋势图"
          },
          tooltip : {
            trigger: 'axis',
            axisPointer: {
              type: 'cross',
              label: {
                backgroundColor: '#6a7985'
              }
            }
          },
          legend: {
            data: legend
          },
          grid: {
            left: '10%',
            right: '10%',
            bottom: '15%'
          },
          toolbox: {
            show: true,
            feature: {
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
          series: series
        };
        return option;
      },
      chartPieOpt: function () {
        let option = {
          title: {
            text: '积分活动比例',
            left: 'left'
          },
          tooltip : {
            trigger: 'item',
            formatter: "{b} : {c} ({d}%)"
          },
          legend: {
            bottom: 10,
            left: 'center',
            data: []
          },
          series : [
            {
              name: 'score',
              type: 'pie',
              radius : '65%',
              center: ['50%', '50%'],
              selectedMode: 'single',
              data:[],
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
      onChartResize() {
        this.chart && this.chart.resize()
      },
      onChartPieResize() {
        this.chart && this.chart.resize()
      },
      onClickTab(tab) {
        if (tab.name === 'chart' && this.modified) {
          this.refreshChart()
          this.modified = false
        }
      },
      onClickReturn() {
        this.$router.go(-1)
      },
      onAddRecord() {
        if (this.form.number === 0) {
          this.$message.error('积分值不能为0')
          return
        }

        // 添加新记录, 按日期排序
        const newRecord = yuchg.cloneObject(this.form)
        if (!newRecord.date || newRecord.date === '') {
          newRecord.date = new Date()
        }

        // 发送更新请求，请求成功后，更新本地数据
        let vm = this
        ycUtils.ajaxPost({
          url: this.updateUrl,
          data: {type: 'add',record: newRecord},
          success:  (data) => {
            if (data.result === 0) {
              let inserted = false
              vm.scoreSum = data.content.score
              newRecord.id = data.content.id  // 返回的记录带ID
              vm.scoreData.forEach((value, index) => {
                let res = yuchg.dateCompare(value.date, newRecord.date)
                if (res > 0) {
                  vm.scoreData.splice(index, 0, newRecord)
                  inserted = true
                  return false
                }
              })
              if (!inserted) {
                vm.scoreData.push(newRecord)
              }
              vm.modified = true
              vm.$message('积分记录添加成功')
            } else {
              vm.$message.error('添加积分记录失败 -' + data.err)
            }
          }
        });
      },
      handleCurrentChange: function (currentPage) {
        this.currentPage = currentPage;
      },
      handleSizeChange(val) {
        this.pageSize = val
        this.currentPage = 1
      },
      handleEdit(index, value) {
        this.$message('功能尚未实现')
      },
      handleDelete(index, value) {
        let vm = this
        // 删除所在行数据
        const realIndex = (this.currentPage - 1) * this.pageSize + index
        this.$confirm("确认删除该条记录(不可恢复）?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(() => {
          // 发送删除请求
          // 发送更新请求，请求成功后，更新本地数据
          ycUtils.ajaxPost({
            url: this.updateUrl,
            data: {
              type: 'delete',
              id: value.id
            },
            success: (data) => {
              if (data.result === 0) {
                vm.scoreData.splice(realIndex, 1)
                vm.scoreSum = data.content.score
                vm.modified = true
                this.$message('积分记录删除成功')
              } else {
                vm.$message.error('删除积分记录失败 -' + data.err)
              }
            }
          });
        }).catch(() => {
        });
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

        // 提取日期(去重）
        let chart_date = yuchg.concatArray([], this.scoreData.map((v) => {
          return v.date
        }))

        // 按类型进行数据统计
        const cateSum = {}
        for (let [k, v] of Object.entries(this.categories)) {
          cateSum[k] = {
            value:0, name: v
          }
        }

        const sum = {}
        const seriesData = {}
        const series = Object.keys(this.types).map((k) => {
          sum[k] = 0
          seriesData[k] = new Array(chart_date.length)
          return {
            id: k,
            name: this.types[k],
            data: seriesData[k]
          }
        })

        // 遍历数据项
        this.scoreData.forEach((value) => {
          let index = chart_date.indexOf(value.date)

          let v = Number(value.number)
          if (value.category !== '1') {
            v = 0 - v
          }
          cateSum[value.category].value += value.number
          sum[value.type] +=  v

          for (let key of Object.keys(this.types)) {
            seriesData[key][index] = sum[key]
          }
        })

        // 绘制图表
        this.chart.setOption({
          xAxis: {
            data: chart_date
          },
          series: series
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
      this.form.date = yuchg.currentTimeString()
      this.chart = echarts.init(document.querySelector("#buddha-chart"));
      this.chart.setOption(this.chartOpt);
      this.chartPie = echarts.init(document.querySelector("#buddha-chart-pie"));
      this.chartPie.setOption(this.chartPieOpt);
      // 读取积分记录
      this.fetchRecords()
    }
  }
</script>
