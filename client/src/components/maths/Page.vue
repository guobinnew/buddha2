<template>
  <div style="overflow: hidden;">
    <div class="page-header">
        <h2 align="center">口算练习</h2>
        <el-row :gutter="20">
           <el-col :span="10">{{ content.info.grade }}</el-col>
           <el-col :span="6">{{ content.info.name }}</el-col>
          <el-col :span="8">{{ content.info.time }}</el-col>
        </el-row>
    </div>
    <div class='hline'></div>
    
    <el-row :gutter="20" v-for="row in content.list">
      <template v-for="v in row">
      <el-col :span="content.col">
        <div class="grid-content">{{ v.q }}<span class="answer hidden">{{ v.a }}</span></div>
      </el-col>
      </template>
    </el-row>
  </el-table>
   <div class="page-footer">
    <el-row :gutter="20">
      <el-col :span="4">对______</el-col>
      <el-col :span="4">错______</el-col>
      <el-col :span="8">用时:_____________</el-col>
      <el-col :span="8">家长签字:______________</el-col>
    </el-row>
   </div>
  </div>
  </template>

<style scoped>
.hline {
  height: 1px;
  width: 100%;
  color: #333;
}

.grid-content {
  min-height: 40px;
}

.page {
  background-color: white;
  margin: 0 auto;
  width: 600px;
  font-family: Microsoft YaHei;
}

.page-header {
  padding-bottom: 10px;
  border-bottom: 1px solid #333;
}

.page-footer {
  padding-top: 30px;
  border-top: 1px solid #333;
}


.page-header,
.page-footer {
  margin: 20px;
  height: 60px;
}

.page-header h2 {
  margin-bottom: 20px;
}

.page-footer .el-col,
.page-header .el-col{
  white-space:nowrap;
}

.answer {
  margin-left: 4px;
  color: #333;
  font-size: large;
  font-weight: bold;
}

.hidden {
  display: none;
}
</style>

<script>
import logger from "../../logger";
import utils from "./utils";
import $ from "jquery";
import yuchg from "../../base";

export default {
  name: "Page",
  props: ["content"],
  data: function() {
    return {
      showHeader: false
    };
  },
  methods: {
  },
  mounted: function() {
  },
  activated: function() {
  }
};
</script>

