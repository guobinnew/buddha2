<template>
    <div id="app">
        <el-container class="buddha-main">
            <el-aside width="96px">
                <div class="buddha-logo-menu">
                    <img src="./assets/logo.png" width="36" height="36" class="buddha-middle"/>
                </div>
                <el-menu :default-active="activeCourseIndex" class="el-menu-vertical-demo" :collapse="isCollapse" @select="handleCourseSelect">
                     <el-menu-item index="0">
                        <i class="fa fa-reddit-alien fa-2x"></i>
                    </el-menu-item>
                     <el-menu-item index="1">
                        <i class="el-icon-location"></i>
                        <span slot="title">数学</span>
                    </el-menu-item>
                    <el-menu-item index="2">
                        <i class="el-icon-menu"></i>
                        <span slot="title">语文</span>
                    </el-menu-item>
                    <el-menu-item index="3">
                        <i class="el-icon-document"></i>
                        <span slot="title">英语</span>
                    </el-menu-item>
                    <el-menu-item index="4">
                        <i class="el-icon-setting"></i>
                        <span slot="title">编程</span>
                    </el-menu-item>
                </el-menu>
            </el-aside>
            <el-container>
                <el-header>
                  <el-menu
                            :default-active="activeGradeIndex"
                            class="el-menu-demo"
                            mode="horizontal"
                            @select="handleGradeSelect"
                            background-color="#545c64"
                            text-color="#fff"
                            active-text-color="#ffd04b">
                        <el-menu-item id="buddha-gradeclass" index="0" class="buddha-menu-title" disabled>小学一年级</el-menu-item>
                        <el-submenu index="1">
                            <template slot="title">小学</template>
                            <el-menu-item index="1-1">一年级</el-menu-item>
                            <el-menu-item index="1-2">二年级</el-menu-item>
                            <el-menu-item index="1-3">三年级</el-menu-item>
                            <el-menu-item index="1-4">四年级</el-menu-item>
                            <el-menu-item index="1-5">五年级</el-menu-item>
                            <el-menu-item index="1-6">六年级</el-menu-item>
                        </el-submenu>
                        <el-submenu index="2">
                            <template slot="title">初中</template>
                            <el-menu-item index="2-1">一年级</el-menu-item>
                            <el-menu-item index="2-2">二年级</el-menu-item>
                            <el-menu-item index="2-3">三年级</el-menu-item>
                        </el-submenu>
                        <el-submenu index="3">
                            <template slot="title">高中</template>
                            <el-menu-item index="3-1">一年级</el-menu-item>
                            <el-menu-item index="3-2">二年级</el-menu-item>
                            <el-menu-item index="3-3">三年级</el-menu-item>
                        </el-submenu>
                    </el-menu>
                     <el-dropdown class="buddha-profile" @command="handleCommand">
                      <i class="fa fa-user-circle-o fa-lg" style="margin-right: 15px; color: white;"><span id="buddha-username" style="margin-left: 8px; font-size: 16px;"></span></i>
                      <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item command="student">学生信息</el-dropdown-item>
                    </el-dropdown-menu>
                  </el-dropdown>
                </el-header>
                <el-main>
                    <router-view/>
                </el-main>
                <el-footer>
                    <h4><span class="buddha-version">{{ appTitle }}</span>{{ copyright }}</h4>
                </el-footer>
            </el-container>
        </el-container>
        <el-dialog title="学生信息" :visible.sync="dialogInfoVisible">
          <el-form :model="profile" label-width="80px">
            <el-form-item label="姓名">
              <el-input v-model="profile.name" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="班号">
              <el-input-number v-model="profile.class" :step="1" :min="1" :max="10"></el-input-number>
            </el-form-item>
            <el-form-item label="教材类型">
               <el-radio-group v-model="profile.source">
                <el-radio label="rj">人教</el-radio>
                <el-radio label="bsd">北师大</el-radio>
              </el-radio-group>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogInfoVisible = false">取 消</el-button>
         <el-button type="primary" @click="modifyProfile">修 改</el-button>
        </div>
      </el-dialog>
    </div>
</template>

<style lang="scss">
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  height: 100%;
  width: 100%;
}

#nav {
  padding: 30px;
  a {
    font-weight: bold;
    color: #2c3e50;
    &.router-link-exact-active {
      color: #42b983;
    }
  }
}

.buddha-version {
  float: left;
  margin-left: 20px;
}

.buddha-profile {
  position: absolute;
  top: 0;
  right: 0;
  width: 100px;
  height: 60px;
}

.buddha-menu-title {
  opacity: 1 !important;
  font-weight: bold;
  font-size: 16px;
}

.buddha-main {
  height: 100%;
  width: 100%;
}

.buddha-logo-menu {
  height: 58px;
  text-align: center;
  padding: 0;
}

.el-dropdown {
  cursor: pointer;
  float: right;
}

.el-dropdown-link img {
  display: inline-block;
  width: 50px;
  height: 50px;
  border-radius: 25px;
  background-color: #fff;
  margin-top: 5px;
}

.el-menu {
  border-right: solid 0px #e6e6e6 !important;
  list-style: none;
  position: relative;
  margin: 0;
  padding-left: 0;
}

.buddha-middle {
  display: inline-block;
  vertical-align: middle;
}

.el-menu-vertical-demo {
  height: 100%;
}

.el-header,
.el-footer {
  background-color: #b3c0d1;
  color: #333;
  text-align: center;
  line-height: 60px;
  padding: 0;
}

.el-aside {
  color: #333;
  text-align: center;
  line-height: 58px;
  overflow: hidden;
}

.el-main {
  background-color: #e9eef3;
  color: #333;
  text-align: center;
  line-height: 160px;
  padding: 0;
  height: 100%;
}

body > .el-container {
  margin-bottom: 40px;
}

.el-container:nth-child(5) .el-aside,
.el-container:nth-child(6) .el-aside {
  line-height: 260px;
}

.el-container:nth-child(7) .el-aside {
  line-height: 320px;
}

.el-dialog {
  line-height: 40px;
}

.el-footer {
  text-align: right;
  padding-right: 20px;
  color: #666;
}

.el-form-item {
  text-align: left;
}

</style>

<script>
import ElContainer from "../node_modules/element-ui/packages/container/src/main";
import logger from "./logger";
import yuchg from "./base";
import $ from "jquery";
import fs from 'fs'
import path from 'path'
logger.setLevel("debug");

export default {
  components: { ElContainer },
  data() {
    return {
      appTitle: "",
      copyright: "",
      gradePhase: ["小学", "初中", "高中"],
      activeCourseIndex: "0",
      activeGradeIndex: "1-3",
      isCollapse: false,
      dialogInfoVisible: false,
      profile: {
        name: '',
        class: 1,
        source: 'rj'
      },
      manifest: {}
    };
  },
  methods: {
    handleCourseSelect(key, keyPath) {
      // 根据课程和年级切换页面
      this.activeCourseIndex = key;
      this.$router.push(this.getPage(key, this.activeGradeIndex));
      logger.debug(key, keyPath);
    },
    handleGradeSelect(key, keyPath) {
      this.showGradeName(key);
      // 根据课程和年级切换页面
      this.activeGradeIndex = key
      this.$router.push(this.getPage(this.activeCourseIndex, key));
      logger.debug(key, keyPath);
    },
    showGradeName(grade) {
      // 显示年级
      let grades = grade.split("-");
      let gradeName =
        this.gradePhase[Number(grades[0]) - 1] +
        yuchg.number2String(Number(grades[1])) +
        "年级";
      this.$store.commit('updateGrade', gradeName)  
      $(this.$el)
        .find("#buddha-gradeclass")
        .html(gradeName);
    },
    showProfile() {
      const $dom = $(this.$el);
      $dom.find("#buddha-username").html(this.$store.state.user.name);
    },
    showFooter() {
      const state = this.$store.state;
      this.appTitle = this.$store.getters.appTitle;
      this.copyright = `@2018 ${state.company} 版权所有`;
    },
    getGradeNo(grade) {
      let no = 0;
      // 计算年级
      let items = grade.split("-");
      if (items[0] == 1) {
        no = Number(items[1]);
      } else if (items[0] == 2) {
        no = 6 + Number(items[1]);
      } else if (items[0] == 3) {
        no = 9 + Number(items[1]);
      }
      return no;
    },
    isValidPage(course, grade) {
      logger.debug('isValidPage', course, grade)
      if (course == 1) {
        return this.$store.state.pages["maths"].indexOf(grade) >= 0;
      } else if (course == 2) {
        return this.$store.state.pages["chineses"].indexOf(grade) >= 0;
      } else if (course == 3) {
        return this.$store.state.pages["englishs"].indexOf(grade) >= 0;
      } else if (course == 0) {
        return true
      }
      return false;
    },
    getPage(course, grade) {
      logger.debug("getPage:", course, grade);
      let page = {
        name: "empty"
      };
      let no = this.getGradeNo(grade);
      if (this.isValidPage(course, no)) {
        if (course == 4) {
          page.name = "editor";
        } else if (course == 1) {
          page.name = "mathsg" + no;
        } else if (course == 2) {
          page.name = "chsg" + no;
        } else if (course == 3) {
          page.name = "engsg" + no;
        } else if (course == 0) {
          page.name = "welcome";
        }
      }
      logger.debug("Router ==== ", course, grade, '->', page);
      return page;
    },
    handleCommand(command) {
      if (command === 'student') {
        this.profile.name = this.$store.state.user.name
        this.profile.class = this.$store.state.user.class
        this.profile.source = this.$store.getters.source
        this.dialogInfoVisible = true
      }
    },
    modifyProfile() {
      if (this.profile.name === '') {
        this.$message('姓名不能为空')
        return
      }

      this.$store.commit('updateUser', this.profile)
      this.$store.commit('updateSource', this.profile.source)
      this.$message('学生信息修改成功')
      this.dialogInfoVisible = false
    },
    saveToFile() {
        const _path = path.join(__dirname, '../data/manifest.json')
        // 写入
        this.manifest.user.name = this.$store.stateuser.name
        this.manifest.class = this.$store.stateuser.class
        this.manifest.database.sources = this.$store.state.database.sources

        fs.writeFile(_path, JSON.stringify(this.manifest),(err) => {
            if (err) {
                this.$message("Manifest保存失败")
            } else {
              logger.debug('Mainifest保存成功')
            }
        })
    }
  },
  created: function() {
    this.showFooter();
  },
  mounted: function() {
    this.showGradeName(this.activeGradeIndex);
    // 读取配置信息，初始化状态
    // 读取JSON文件
    $.getJSON("data/manifest.json", "", data => {
      this.manifest = data
      this.$store.commit("updateManifest", data);
      this.showProfile();
      this.showFooter();
    });
  
    this.$router.push(this.getPage(this.activeCourseIndex, this.activeGradeIndex));

  }
};
</script>
