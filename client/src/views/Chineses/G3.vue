<template>
    <div class="container">
      <el-tabs type="border-card">
        <el-tab-pane label="单词听写">
         <el-button-group>
          <el-button type="primary" icon="el-icon-edit" @click="onClickStart">开始听写</el-button>
          <el-button type="success" icon="el-icon-share" @click="onClickReset">重新开始</el-button>
        </el-button-group>
        <el-collapse v-model="activeName" accordion>
          <el-collapse-item title="听写选项" name="1">
           <el-form ref="form" :model="form" label-width="80px">
            <el-form-item label="听写模式">
              <el-radio-group v-model="form.mode">
                <el-radio label="1">顺序</el-radio>
                <el-radio label="2">随机</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="上册">
              <el-checkbox-group v-model="form.select.first">
                <el-checkbox v-for="index of form.words.first.length" :label="index" border size="medium">第{{ index }}课</el-checkbox>
              </el-checkbox-group>
            </el-form-item>
            <el-form-item label="下册">
              <el-checkbox-group v-model="form.select.second">
                <el-checkbox v-for="index of form.words.second.length" :label="index" border size="medium">第{{ index }}课</el-checkbox>
              </el-checkbox-group>
            </el-form-item>
            <el-form-item label="扩展">
              <el-checkbox-group v-model="form.select.extend">
                <el-checkbox v-for="index of form.words.second.length" :label="index" border size="medium">第{{ index }}课</el-checkbox>
              </el-checkbox-group>
            </el-form-item>
           </el-form>
          </el-collapse-item>
        </el-collapse>
        <div id="buddha-page" class="buddha-page">
          <Word :content="content"></Word>
        </div>
        </el-tab-pane>
        <el-tab-pane label="记录统计">
         记录统计
        </el-tab-pane>
      </el-tabs>
    </div>
</template>

<style scoped>
.container {
  line-height: 20px;
  min-width: 800px;
}

.el-tabs {
  height: 100%;
}

.el-collapse {
  margin-top: 10px;
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

.buddha-page {
  margin-top: 20px;
}
</style>

<script>
import Word from '../../components/chinese/Word.vue'
import $ from 'jquery'

export default {
  components: { Word },
  data: function() {
    return {
      form: {
        grade: "",
        name: "",
        mode: "2",
        select: {
          first:[],
          second:[],
          extend:[]
        },
        words: {
          first:[],
          second:[],
          extend:[]
        }
      },
      content: []
    }
  },
  methods: {
    onClickStart() {
      
    },
    onClickReset() {
      const $dom = $(this.$el);
    },
    updateProfile() {
      this.form.grade = this.$store.getters.gradeFullName;
      this.form.name = this.$store.state.user.name;
    }
  },
  created: function() {
    // 读取单词表
    $.getJSON("data/g3/words.json", "", data => {
      this.form.words.first = data.first
      this.form.words.second = data.second
      this.form.words.extend = data.extend
    });
  },
  mounted: function() {
    this.updateProfile();
  },
  activated: function() {
    this.updateProfile();
  }
}
</script>
