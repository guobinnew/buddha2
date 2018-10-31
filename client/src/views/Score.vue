<template>
    <div class="container">
        <el-row style="text-align: left;">
            <el-button-group>
                <el-button type="primary" round @click="onClickReturn">返回上一页</el-button>
            </el-button-group>
        </el-row>
        <el-tabs tab-position="left" value="chart">
            <el-tab-pane label="统计图表" name="chart">
                <div id="buddha-chart"></div>
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
                                <el-radio-group v-model="form.type">
                                    <el-radio label="1">奖励积分</el-radio>
                                    <el-radio label="2">兑换积分</el-radio>
                                    <el-radio label="3">扣除积分</el-radio>
                                </el-radio-group>
                            </el-form-item>
                            <el-form-item label="积分值">
                                <el-input-number v-model="form.number" :step="10" :min="1" :max="1000000"
                                                 controls-position="right"></el-input-number>
                            </el-form-item>
                            <el-form-item label="说明">
                                <el-input
                                        type="textarea"
                                        :autosize="{ minRows: 2, maxRows: 4}"
                                        placeholder="请输入说明内容"
                                        v-model="form.desc"
                                        style="width:60%;">
                                </el-input>
                            </el-form-item>
                            <el-form-item>
                                <el-button type="primary" @click="onAddRecord">添 加</el-button>
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
    </div>
</template>

<style scoped>
    .container {
        line-height: 20px;
    }

    .el-button-group {
        margin: 10px;
    }

</style>

<script>
  export default {
    data: function () {
      return {
        currentPage: 1,
        pageSize: 10,
        scoreData: [],
        form: {
          date: '',
          type: '1',
          number: 1,
          desc: ''
        }
      }
    },
    methods: {
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
      }
    },
    mounted: function () {
    }
  }
</script>
