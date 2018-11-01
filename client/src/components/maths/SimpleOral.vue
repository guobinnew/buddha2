<template>
    <div class="container" id="simple-oral">
         <el-button-group>
          <el-button type="primary" icon="el-icon-edit" @click="onClickTest">生成卷子</el-button>
          <el-button type="success" icon="el-icon-share" @click="onClickAnswer">显示/隐藏答案</el-button>
          <el-button type="danger" icon="el-icon-delete" @click="onClickSave">保存PDF</el-button>
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
                <el-date-picker type="date" placeholder="选择日期" format="yyyy 年 MM 月 dd 日" value-format="yyyy-MM-dd" v-model="form.date" style="width: 100%;"></el-date-picker>
              </el-col>
              <el-col class="line" :span="2">数目</el-col>
              <el-col :span="11">
                <el-input-number v-model="form.number" :step="10" :min="10" :max="80"></el-input-number>
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
        <div id="buddha-page" class="buddha-page">
          <Page v-if="content" :content="content"></Page>
        </div>
    </div>
</template>

<style scoped>
.container {
  line-height: 20px;
  min-width: 800px;
}

.el-collapse {
  margin-top: 10px;
}

.buddha-page {
  background-color: white;
  margin: 0 auto;
  width: 601px;
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

.hidden {
  display: none;
}
</style>

<script>
import Page from "./Page.vue";
import logger from "../../logger";
import utils from "./utils";
import yuchg from "../../base";
import html2canvas from "html2canvas";
import * as jsPDF from "jspdf";

export default {
  props: ["source"],
  components: { Page },
  data: function() {
    return {
      activeName: "1",
      form: {
        grade: "",
        name: "",
        date: "",
        number: 40,
        level: "2",
        column: "4"
      },
      content: null
    };
  },
  methods: {
    onClickTest() {
      this.makeTest(Number(this.form.number), Number(this.form.column));
    },
    onClickAnswer() {
      const answer = document.querySelectorAll("#simple-oral span.answer")
      answer.forEach((elem) => {
        elem.classList.toggle('hidden')
      })
    },
    onClickSave() {
      const page = document.querySelector("#simple-oral #buddha-page");
      let date = this.form.date;
      if (!date || date == "") {
        date = utils.currentTimeString();
      }

      html2canvas(page, {}).then(function(canvas) {
        var context = canvas.getContext("2d");
        // 关闭抗锯齿
        context.mozImageSmoothingEnabled = false;
        context.webkitImageSmoothingEnabled = false;
        context.msImageSmoothingEnabled = false;
        context.imageSmoothingEnabled = false;
        //返回图片dataURL，参数：图片格式和清晰度(0-1)
        var pageData = canvas.toDataURL("image/jpeg", 1.0);
        //方向默认竖直，尺寸ponits，格式a4[595.28,841.89]
        var pdf = new jsPDF("", "pt", "a4");
        //addImage后两个参数控制添加图片的尺寸，此处将页面高度按照a4纸宽高比列进行压缩
        pdf.addImage(
          pageData,
          "JPEG",
          20,
          40,
          535.28,
          (535.28 / canvas.width) * canvas.height
        );
        pdf.save(date + ".pdf");
      });
    },
    makeTest(num, col) {
      // 生成Data
      let data = {};
      data.info = {};
      data.info.time = this.form.date;
      data.info.grade = this.form.grade;
      data.info.name = this.form.name;
      data.col = 24 / col;

      let level = Number(this.form.level);
      let list = [];
      let row = [];
      for (let i = 0; i < num; i++) {
        if (i % col == 0) {
          row = [];
        }
        row.push(utils.randomSimpleTest(level));
        if (i % col == col - 1) {
          list.push([].concat(row));
        }
      }

      data.list = list;
      this.content = data;
    },
    updateProfile() {
      this.form.grade = this.$store.getters.gradeFullName;
      this.form.name = this.$store.state.user.name;
    }
  },
  mounted: function() {
    this.form.date = utils.currentTimeString();
    this.updateProfile();
    logger.debug("Profile", this.$store.state);
  },
  activated: function() {
    this.updateProfile();
  }
}
</script>

