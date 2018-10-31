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
                    <el-button type="primary" icon="el-icon-edit" @click="onClickAddRow">添加章节</el-button>
                    <el-button type="primary" icon="el-icon-edit" @click="onClickRefresh">重新加载</el-button>
                    <el-button type="success" icon="el-icon-share" @click="onClickSave">保存修改</el-button>
                    <el-button type="danger" icon="el-icon-delete" @click="onClickExport">导出到文件</el-button>
                </el-button-group>
                <el-table
                        ref="wordTable"
                        :data="currentData.slice((currentPage-1) * pageSize, currentPage * pageSize)"
                        stripe
                        tooltip-effect="dark"
                        style="width: 100%">
                    <el-table-column type="selection" width="55">
                    </el-table-column>
                    <el-table-column prop="id" label="章节" width="50">
                    </el-table-column>
                    <el-table-column label="词汇">
                        <template slot-scope="scope">
                            <el-tag v-for="tag in scope.row.data" size="medium" closable type="success"
                                    @close="handleClose(scope.row.id, tag)">{{ tag[0] + ' - ' + tag[1] }}
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
                        @size-change="handleSizeChange"
                        @current-change="handleCurrentChange"
                        :current-page="currentPage"
                        :page-sizes="[5, 10, 20]"
                        :page-size="pageSize"
                        layout="prev, pager, next, sizes"
                        :total="currentData.length">
                </el-pagination>
            </el-main>
        </el-container>
        <el-dialog title="添加词语" :visible.sync="dialogAddVisible">
            <p>中英文使用#分隔开，格式实例： english#英语</p>
            <el-tag
                    v-for="tag in addForm.words"
                    closable
                    :disable-transitions="false"
                    @close="handleNewTagClose(tag)">
                {{tag[0] + ' - ' + tag[1]}}
            </el-tag>
            <el-input
                    class="input-newtag"
                    v-if="addForm.inputVisible"
                    v-model="addForm.inputValue"
                    ref="saveTagInput"
                    size="small"
                    @keyup.enter.native="handleInputConfirm"
                    @blur="handleInputConfirm"
            >
            </el-input>
            <el-button v-else class="buddha-newtag" size="small" @click="showInput">添加词语</el-button>

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

    .input-newtag {
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
  import utils from "./utils";
  import ycUtils from "../../utils";
  import saveAs from "file-saver";

  export default {
    props: ["url", "update"],
    data: function () {
      return {
        activeSection: "first",
        dialogAddVisible: false,
        loaded: false,
        words: {
          first: [],
          second: [],
          extend: []
        },
        currentData: [],
        currentModified: [],
        currentPage: 1,
        pageSize: 5,
        addForm: {
          index: -1,
          words: [],
          inputVisible: false,
          inputValue: ''
        }
      };
    },
    computed: {},
    methods: {
      handleClose(index, tag) {
        const row = this.currentData[index - 1];
        let idx = -1;
        row.data.forEach(function (value, index) {
          if (value[0] === tag[0]) {
            idx = index;
            return false;
          }
        });
        row.data.splice(idx, 1);
        this.setModifyFlag(index);
      },
      handleAdd(index) {
        this.addForm.index = index;
        this.dialogAddVisible = true;
      },
      handleClear(index) {
        this.addForm.index = index;
        this.$confirm("确认清空该课所有单词?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(() => {
            this.currentData[index - 1].data = [];
            this.setModifyFlag(index);
            this.$message("词语已清空");
          })
          .catch(() => {
          });
      },
      handleReset(index) {
        this.addForm.index = index;
        this.$confirm("确认恢复该课所有单词?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(() => {
            this.currentData[index - 1].data = this.words[this.activeSection][
            index - 1
              ];
            this.setModifyFlag(index, false)
            this.$message("单词已恢复")
          })
          .catch(() => {
          })
      },
      handleNewTagClose(tag) {
        let idx = -1
        this.addForm.words.forEach(function (value, index) {
          if (value[0] === tag[0]) {
            idx = index
            return false
          }
        })
        this.addForm.words.splice(idx, 1)
      },
      showInput() {
        this.addForm.inputVisible = true;
        this.$nextTick(_ => {
          this.$refs.saveTagInput.$refs.input.focus();
        });
      },
      handleInputConfirm() {
        let inputValue = this.addForm.inputValue;
        if (inputValue) {
          // 分解
          const newWords = yuchg.trimString(inputValue).split(/\s*#\s*/).filter(function (value) {
            return value.length > 0
          })
          if (newWords.length !== 2) {
            this.$message('输入格式有误')
            return
          }
          // 检查重复
          let found = false
          this.addForm.words.forEach((value) => {
            if (value[0] === newWords[0]) {
              found = true
              return false
            }
          })

          if (found) {
            this.$message('该单词已经存在')
          } else {
            this.addForm.words.push(newWords)
          }
        }
        this.addForm.inputVisible = false;
        this.addForm.inputValue = '';
      },
      onClickAddRow() {
        let index = this.currentData.length + 1;
        this.currentData.push({
          id: index,
          data: []
        });
        this.setModifyFlag(index);
      },
      onClickRefresh() {
        if (this.currentModified.length > 0) {
          // 有修改
          this.$confirm("确认重新加载单词表，放弃当前的修改?", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning"
          })
            .then(() => {
              this.fetchWords();
            })
            .catch(() => {
            });
        } else {
          this.fetchWords();
        }
      },
      onClickSave() {
        // 保存当前修改
        this.saveCurrent();

        logger.debug("saveCurrent", this.words);
        let ciphertext = ycUtils.encodeJson(this.words)
        ycUtils.ajaxPost({
          url: this.url,
          data: this.words,
          success: (data) => {
            if (data.result == 0) {
              // 成功
              // 通知父组件更新
              this.$emit("update", this.words);
              this.$message("单词表保存成功");
            } else {
              this.$message("单词表保存失败: " + data.err);
            }
          }
        });
      },
      onClickExport() {
        let str = JSON.stringify(this.words);
        var file = new File([str], "word" + yuchg.randomString(8) + ".json", {
          type: "text/plain;charset=utf-8"
        });
        saveAs(file);
      },
      onAddWords() {
        if (this.addForm.words.length === 0) {
          this.$message("请先输入单词")
          return;
        }
        if (this.addForm.index >= 1) {
          const src = this.currentData[this.addForm.index - 1]
          // 如果存在则替换
          let keys = src.data.map(function (value) {
              return value[0];
          })
          this.addForm.words.forEach(function (v) {
            let i = keys.indexOf(v[0])
            if (i < 0) {
              src.data.push(v)
            } else {
              src.data[i][1] = v[1]
            }
          })
          this.setModifyFlag(this.addForm.index)
          this.$message("单词添加成功")
        } else {
          this.$message("单词添加失败")
        }
        this.dialogAddVisible = false
        this.addForm.words = []
      },
      saveCurrent() {
        this.words[this.activeSection] = this.currentData.map(function (value,index) {
          return value.data;
        });
        this.clearModifyFlag();
      },
      handleSectionSelect(key, keyPath) {
        if (this.currentModified.length > 0) {
          // 有修改
          this.$confirm("是否保存当前的修改?", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning"
          })
            .then(() => {
              this.saveCurrent();
              this.$message("单词已保存");
              this.loadWords(key);
            })
            .catch(() => {
              this.loadWords(key);
            });
        } else {
          this.loadWords(key);
        }
      },
      handleCurrentChange: function (currentPage) {
        this.currentPage = currentPage;
      },
      handleSizeChange(val) {
        this.pageSize = val;
        this.currentPage = 1;
      },
      loadWords(sec) {
        this.activeSection = sec;
        this.currentData = this.words[this.activeSection].map(function (value, index) {
          return {id: index + 1, data: [].concat(yuchg.cloneObject(value))};
        })
        this.currentModified = [];
      },
      setModifyFlag(index, flag = true) {
        if (flag) {
          if (this.currentModified.indexOf(index) < 0) {
            this.currentModified.push(index);
          }
        } else {
          this.currentModified.splice(this.currentModified.indexOf(index), 1);
        }
      },
      clearModifyFlag() {
        this.currentModified = [];
      },
      fetchWords() {
        if (this.url === "" || this.loaded) {
          return;
        }
        ycUtils.ajaxGet({
          url: this.url,
          success:  (data) => {
            if (data.result === 0) {
              this.words = yuchg.cloneObject(data.content)
              this.loadWords(this.activeSection);
            } else {
              this.$message.error('读取词汇表失败 -' + data.err)
            }
          }
        });
      }
    },
    created: function () {
    },
    mounted: function () {
      this.fetchWords();
    },
    activated: function () {
    }
  };
</script>

