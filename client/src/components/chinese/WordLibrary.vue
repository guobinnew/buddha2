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
import yuchg from "../../base";
import utils from "./utils";
import ycUtils from "../../utils";
import saveAs from 'file-saver';

export default {
  props: ["url", "update"],
  data: function() {
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
        words: ""
      }
    };
  },
  computed: {},
  methods: {
    handleClose(index, tag) {
      const row = this.currentData[index - 1];
      row.data.splice(row.data.indexOf(tag), 1);
      this.setModifyFlag(index);
    },
    handleAdd(index) {
      this.addForm.index = index;
      this.dialogAddVisible = true;
    },
    handleClear(index) {
      this.addForm.index = index;
      this.$confirm("确认清空该行所有词语?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.currentData[index - 1].data = [];
          this.setModifyFlag(index);
          this.$message("词语已清空");
        })
        .catch(() => {});
    },
    handleReset(index) {
      this.addForm.index = index;
      this.$confirm("确认恢复该行所有词语?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.currentData[index - 1].data = this.words[this.activeSection][
            index - 1
          ];
          this.setModifyFlag(index, false);
          this.$message("词语已恢复");
        })
        .catch(() => {});
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
           this.fetchWords()
        })
        .catch(() => {
          
        });
      } else {
         this.fetchWords()
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
            this.$message("词语表保存成功");
          } else {
            this.$message("词语表保存失败: " + data.err);
          }
        }
      });
    },
    onClickExport() {
      let str = JSON.stringify(this.words)
      var file = new File([str], "word" + yuchg.randomString(8) + ".json", {type: "text/plain;charset=utf-8"});
      saveAs(file);
    },
    onAddWords() {
      let words = yuchg.trimString(this.addForm.words);
      if (words.length === 0) {
        this.$message("请先输入词语");
        return;
      }

      if (this.addForm.index >= 1) {
        const src = this.currentData[this.addForm.index - 1];
        const newWords = this.addForm.words.split(/\s+/).filter(function(value){
          return value.length > 0
        });

        // 如果存在则跳过
        newWords.forEach(function (v) {
          if (src.data.indexOf(v) < 0) {
            src.data.push(v)
          }
        })

        this.addForm.words = ''
        this.setModifyFlag(this.addForm.index);
        this.$message("词语添加成功");
      } else {
        this.$message("词语添加失败");
      }
      this.dialogAddVisible = false;
    },
    saveCurrent() {
      this.words[this.activeSection] = this.currentData.map(function(
        value,
        index
      ) {
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
            this.$message("词语已保存");
            this.loadWords(key);
          })
          .catch(() => {
            this.loadWords(key);
          });
      } else {
        this.loadWords(key);
      }
    },
    handleCurrentChange: function(currentPage) {
      this.currentPage = currentPage;
    },
    handleSizeChange(val) {
      this.pageSize = val;
      this.currentPage = 1;
    },
    loadWords(sec) {
      this.activeSection = sec;
      this.currentData = this.words[this.activeSection].map(function(
        value,
        index
      ) {
        return { id: index + 1, data: [].concat(value) };
      });
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
        success: (data) => {
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
  created: function() {
  },
  mounted: function() {
    this.fetchWords()
  },
  activated: function() {}
};
</script>

