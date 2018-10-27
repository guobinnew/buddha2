<template>
      <el-tabs type="border-card">
        <el-tab-pane label="每日口算">
         <el-button-group>
          <el-button type="primary" icon="el-icon-edit" @click="a">生成卷子</el-button>
          <el-button type="primary" icon="el-icon-share">显示/隐藏答案</el-button>
          <el-button type="primary" icon="el-icon-delete">保存PDF</el-button>
        </el-button-group>
        <el-collapse v-model="activeName" accordion>
          <el-collapse-item title="生成选项" name="1">
           <el-form ref="form" :model="form" label-width="80px">
            <el-form-item label="班级">
              <el-col :span="11">
                <el-input v-model="form.grade"></el-input>
              </el-col>
              <el-col class="line" :span="2">姓名</el-col>
              <el-col :span="11">
                <el-input v-model="form.name"></el-input>
              </el-col>
            </el-form-item>
            <el-form-item label="日期">
               <el-col :span="11">
                <el-date-picker type="date" placeholder="选择日期" v-model="form.date" style="width: 100%;"></el-date-picker>
              </el-col>
              <el-col class="line" :span="2">数目</el-col>
              <el-col :span="11">
                <el-input-number v-model="form.number" :step="10" :min="10" :max="100"></el-input-number>
              </el-col>
            </el-form-item>
            <el-form-item label="列数">
              <el-radio-group v-model="form.column">
                <el-radio label="1">1列</el-radio>
                <el-radio label="2">2列</el-radio>
                <el-radio label="3">3列</el-radio>
                <el-radio label="4">4列</el-radio>
                <el-radio label="5">5列</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="难度">
              <el-radio-group v-model="form.level">
                <el-radio label="1">初级</el-radio>
                <el-radio label="2">中级</el-radio>
                <el-radio label="3">高级</el-radio>
              </el-radio-group>
            </el-form-item>
           </el-form>
          </el-collapse-item>
        </el-collapse>
        <div id="page" class="buddha-page"></div>
        </el-tab-pane>
        <el-tab-pane label="成绩统计">
         成绩统计
        </el-tab-pane>
      </el-tabs>
</template>

<style scoped>
.container {
  overflow: hidden;
  height: 100%;
  line-height: 20px;
  min-width: 800px; 
}

.el-tabs {
  height: 100%;
}

.el-collapse {
  margin-top: 10px;
}

.buddha-page {
  background-color: white;
  margin: 0 auto;
  width: 600px;
  font-family: Microsoft YaHei;
}

.el-form-item {
  text-align: left;
}

.line {
  text-align: right;
  float: left;
  font-size: 14px;
  color: #606266;
  line-height: 40px;
  padding: 0 12px 0 0;
}
</style>

<script>
export default {
  data: function() {
    return {
      activeName: '1',
      form: {
        grade: '',
        name: '',
        date: '',
        number: '40',
        level: '2',
        column: '4'
      }
    };
  },
  methods: {
  },
  mounted: function() {}
};
</script>
