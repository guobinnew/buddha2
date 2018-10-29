<template>
    <div style="overflow: hidden;">
        <el-container>
            <el-aside width="100px">
                <el-menu
                        :default-active="activeSection"
                        class="el-menu-vertical-demo"
                        @select="handleSectionSelect">
                    <el-menu-item index="first">
                        <i class="el-icon-menu"></i>
                        <span slot="title">上册</span>
                    </el-menu-item>
                    <el-menu-item index="second">
                        <i class="el-icon-document"></i>
                        <span slot="title">下册</span>
                    </el-menu-item>
                    <el-menu-item index="extend">
                        <i class="el-icon-setting"></i>
                        <span slot="title">扩展</span>
                    </el-menu-item>
                </el-menu>
            </el-aside>
            <el-main>
                <el-button-group>
                    <el-button type="primary" icon="el-icon-edit" @click="onClickAddRow">添加</el-button>
                    <el-button type="primary" icon="el-icon-edit" @click="onClickRefresh">重新加载</el-button>
                    <el-button type="success" icon="el-icon-share" @click="onClickSave">保存</el-button>
                    <el-button type="danger" icon="el-icon-delete" @click="onClickDownload">下载</el-button>
                </el-button-group>
                <el-table
                        ref="wordTable"
                        :data="currentData.slice((currentPage-1) * pageSize, currentPage * pageSize)"
                        stripe
                        tooltip-effect="dark"
                        style="width: 100%">
                    <el-table-column type="selection" width="55">
                    </el-table-column>
                    <el-table-column prop="id" label="#" width="50">
                    </el-table-column>
                    <el-table-column label="词汇">
                        <template slot-scope="scope">
                            <el-tag v-for="tag in scope.row.data" size="medium" closable type="success"
                                    @close="handleClose(scope.row.id, tag)">{{ tag }}
                            </el-tag>
                        </template>
                    </el-table-column>
                    <el-table-column label="操作" width="250">
                        <template slot-scope="scope">
                            <el-button
                                    size="mini"
                                    type="primary"
                                    @click="handleAdd(scope.row.id)">添加
                            </el-button>
                            <el-button
                                    size="mini"
                                    type="danger"
                                    @click="handleClear(scope.row.id)">清空
                            </el-button>
                            <el-button
                                    size="mini"
                                    type="success"
                                    @click="handleReset(scope.row.id)">恢复
                            </el-button>
                        </template>
                    </el-table-column>
                </el-table>
                <el-pagination
                        background
                        @current-change="handleCurrentChange"
                        :current-page="currentPage"
                        :page-size="pageSize"
                        layout="prev, pager, next"
                        :total="currentData.length">
                </el-pagination>
            </el-main>
        </el-container>
        <el-dialog title="添加词语" :visible.sync="dialogAddVisible">
            <el-input
                    type="textarea"
                    autosize
                    placeholder="词语(以空格隔开)"
                    v-model="addForm.words">
            </el-input>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogAddVisible = false">取 消</el-button>
                <el-button type="primary" @click="onAddWords">保 存</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<style scoped>
    .hidden {
        display: none;
    }

    .el-tabs {
        width: 100%;
        height: 100%;
    }

    .el-main {
        background-color: white;
        line-height: 20px;
    }

    .el-table {
        text-align: left;
    }

    .el-tag {
        margin-right: 10px;
        margin-bottom: 4px;
    }

    .buddha-newtag {
        margin-left: 10px;
        height: 32px;
        line-height: 30px;
        padding-top: 0;
        padding-bottom: 0;
    }

    .input-new-tag {
        width: 90px;
        margin-left: 10px;
        vertical-align: bottom;
    }

    .el-pagination {
        margin-top: 20px;
        text-align: center;
    }
</style>

<script>
  import logger from "../../logger";
  import $ from "jquery";
  import yuchg from "../../base";
  import utils from './utils'

  export default {
    data: function () {
      return {
        activeSection: 'first',
        dialogAddVisible: false,
        words: {
          first: [
            ["早晨", "穿戴", "鲜艳", "服装", "打扮", "校园", "敬爱", "国旗", "敬礼", "铜钟", "教室", "朗读", "安静", "树枝", "这些", "好奇", "招引", "古老", "粗壮", "枝干", "影子", "绒球", "汉族", "停车"],
            ["阵雨", "荒野", "绿草", "跳舞", "狂欢", "功课", "放假", "互相", "狂风", "自然", "能够", "双臂", "飘落", "笛声", "罚站", "所以", "扬起", "猜谜语", "急急忙忙"],
            [],
            [],
            ["寒冬", "石径", "歪斜", "风霜", "赠送", "盖子", "菊叶", "残破", "君子", "橙黄", "挑战", "刘海儿"],
            ["金色", "水泥", "放晴", "明朗", "金黄", "雨珠", "落叶", "尽头", "平展", "排列", "规则", "棕红", "叶从", "歌唱", "迟到", "铺满", "紧张", "医院", "刻印", "凌乱", "亮晶晶", "闪闪发光"],
            ["清凉", "留意", "颜料", "枫叶", "邮票", "果树", "菊花", "仙子", "淡黄", "气味", "香甜", "香味", "过冬", "丰收", "勾住", "歌曲", "盒子", "飘扬", "争吵", "新闻", "鸭梨"],
            [],
            ["寒冷", "离开", "一定", "原野", "发生", "剩下", "树根", "斧子", "山谷", "火柴", "村子", "告诉", "灯火", "接着", "等候", "砍伐", "睁眼", "煤油灯"],
            [],
            ["旅游", "要好", "咱们", "草堆", "作声", "答应", "做梦", "可怜", "救命", "拼命", "马上", "消化", "当然", "刚才", "知觉", "光亮", "眼泪", "打扫", "胃口", "管理", "河流", "就算", "来得及", "大吃一惊"],
            []
          ],
          second: [
            ["阵雨", "荒野", "绿草"],
            ["阵雨", "荒野", "绿草"],
            ["阵雨", "荒野", "绿草"],
          ],
          extend: []
        },
        currentData: [],
        currentModified: [],
        currentPage: 1,
        pageSize: 5,
        addForm: {
          index: -1,
          words: ''
        }
      };
    },
    computed: {},
    methods: {
      handleClose(index, tag) {
        const row = this.currentData[index-1]
        row.data.splice(row.data.indexOf(tag), 1)
        this.setModifyFlag(index)
      },
      handleAdd(index) {
        this.addForm.index = index
        this.dialogAddVisible = true
      },
      handleDelete(index) {
        this.addForm.index = index
        this.$confirm('确认清空该行所有词语?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.currentData[index-1].data = []
          this.setModifyFlag(index)
          this.$message('词语已清空')
        }).catch(() => {

        })
      },
      handleReset(index) {
        this.addForm.index = index
        this.$confirm('确认恢复该行所有词语?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.currentData[index-1].data = this.words[this.activeSection][index-1]
          this.setModifyFlag(index, false)
          this.$message('词语已恢复')
        }).catch(() => {

        })
      },
      onClickAddRow() {

      },
      onClickRefresh() {
        this.dialogAddVisible = true
      },
      onClickSave() {

      },
      onClickDownload() {

      },
      onAddWords() {
        let words = yuchg.trimString(this.addForm.words)
        if (words.length === 0){
          this.$message('请先输入词语')
          return
        }

        if (this.addForm.index >= 1) {
          const src = this.currentData[this.addForm.index - 1]
          const newWords = this.addForm.words.split(/\s+/)
          src.data.push.apply(src.data, newWords)
          this.setModifyFlag(index)
          this.$message('词语添加成功')
        } else {
          this.$message('词语添加失败')
        }
        this.dialogAddVisible = false
      },
      handleSectionSelect(key, keyPath) {
        if (this.currentModified.length > 0) { // 有修改

        }

        this.loadWords(key)
        this.currentData = [].concat(this.words[this.activeSection])
      },
      handleCurrentChange: function(currentPage){
        this.currentPage = currentPage
      },
      loadWords(sec) {
        this.activeSection = sec
        this.currentData = this.words[this.activeSection].map(function(value, index) {
          return {id: index+1, data: value}
        })
        this.currentModified = []
      },
      setModifyFlag(index, flag = true) {
        if (flag) {
          if (this.currentModified.indexOf(index) < 0) {
            this.currentModified.push(index)
          }
        } else {
          this.currentModified.splice(this.currentModified.indexOf(index), 1)
        }
      },
    },
    created: function () {
      this.loadWords('first')
    },
    mounted: function () {

    },
    activated: function () {
    }
  };
</script>

