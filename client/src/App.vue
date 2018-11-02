<template>
    <div id="app">
        <el-container class="buddha-main">
            <el-aside width="96px">
                <div class="buddha-logo-menu">
                    <img src="./assets/logo.png" width="36" height="36" class="buddha-middle"/>
                </div>
                <el-menu :default-active="activeCourseIndex" class="el-menu-vertical-demo" :collapse="isCollapse"
                         @select="handleCourseSelect">
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
                        <span slot="title">逻辑</span>
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
                        <el-menu-item id="buddha-gradeclass" index="0" class="buddha-menu-title" disabled>
                            {{ profile.gradeName }}
                        </el-menu-item>
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
                        <i class="fa fa-user-circle-o fa-lg" style="margin-right: 15px; color: white;"><span
                                id="buddha-username" style="margin-left: 8px; font-size: 16px;">{{ profile.name
                            }}</span></i>
                        <el-dropdown-menu slot="dropdown">
                            <el-dropdown-item command="student">学生信息</el-dropdown-item>
                            <el-dropdown-item command="mine">我的积分</el-dropdown-item>
                            <el-dropdown-item command="score">积分管理</el-dropdown-item>
                            <el-dropdown-item command="quit">退出</el-dropdown-item>
                        </el-dropdown-menu>
                    </el-dropdown>
                </el-header>
                <el-main>
                    <router-view v-if="isRouterAlive"/>
                </el-main>
                <el-footer>
                    <h4><span class="buddha-version">{{ appTitle }}</span>{{ copyright }}</h4>
                </el-footer>
            </el-container>
        </el-container>
        <el-dialog title="学生信息" :visible.sync="dialogInfoVisible">
            <el-form :model="form" label-width="80px">
                <el-form-item label="姓名">
                    <el-input v-model="form.name" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="班号">
                    <el-input-number v-model="form.class" :step="1" :min="1" :max="10"></el-input-number>
                </el-form-item>
                <el-form-item label="教材类型">
                    <el-radio-group v-model="form.source">
                        <template v-for="item in sourceItems">
                            <el-radio :label="item.id">{{ item.name }}</el-radio>
                        </template>
                    </el-radio-group>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogInfoVisible = false">取 消</el-button>
                <el-button type="primary" @click="modifyProfile">修 改</el-button>
            </div>
        </el-dialog>
        <el-dialog title="身份确认" :visible.sync="dialogAuthVisible"  width="30%">
            <el-form :model="authForm" label-width="100px">
                <el-form-item label="管理员口令" prop="pwd" :rules="{required: true, message: '密码不能为空', trigger: 'blur'}">
                    <el-input type="password" v-model="authForm.pwd" autocomplete="off"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogAuthVisible = false">取 消</el-button>
                <el-button type="primary" @click="onAuthUser">确 定</el-button>
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
  import ycUtils from './utils';
  logger.setLevel("debug");

  export default {
    components: {ElContainer},
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
          name: "",
          class: 1,
          gradeName: "",
          source: "rj"
        },
        form: {
          name: "",
          class: 1,
          source: "rj"
        },
        isRouterAlive: true,
        dialogAuthVisible: false,
        authForm: {
          pwd: ''
        }
      };
    },
    computed: {
      sourceItems: function () {
        return this.$store.getters.sourceItems
      }
    },
    methods: {
      handleCourseSelect(key, keyPath) {
        // 根据课程和年级切换页面
        this.activeCourseIndex = key;
        this.$router.replace(this.getPage(key, this.activeGradeIndex));
        logger.debug(key, keyPath);
      },
      handleGradeSelect(key, keyPath) {
        this.showGradeName(key);
        // 根据课程和年级切换页面
        this.activeGradeIndex = key;
        this.$router.replace(this.getPage(this.activeCourseIndex, key));
        logger.debug(key, keyPath);
      },
      showGradeName(grade) {
        // 显示年级
        let grades = grade.split("-");
        this.profile.gradeName =
          this.gradePhase[Number(grades[0]) - 1] +
          yuchg.number2String(Number(grades[1])) +
          "年级";
        this.$store.commit("updateGrade", this.profile.gradeName);
      },
      updateProfile() {
        const state = this.$store.state;
        this.profile.name = state.user.name;
        this.profile.class = state.user.class;
        this.profile.source = this.$store.getters.source;
      },
      updateFooter() {
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
        logger.debug("isValidPage", course, grade);
        if (course == 0) {
          return true;
        } else if (course == 1) {
          return this.$store.state.pages["maths"].indexOf(grade) >= 0;
        } else if (course == 2) {
          return this.$store.state.pages["chineses"].indexOf(grade) >= 0;
        } else if (course == 3) {
          return this.$store.state.pages["englishs"].indexOf(grade) >= 0;
        } else if (course == 4) {
          return this.$store.state.pages["logics"].indexOf(grade) >= 0;
        }
        return false;
      },
      getPage(course, grade) {
        let page = {
          name: "empty"
        };
        let no = this.getGradeNo(grade);
        if (this.isValidPage(course, no)) {
          let cid  = +course
          if (cid === 0) {
            page.name = "welcome";
          } else if (cid === 1) {
            page.name = "math#g" + no;
          } else if (cid === 2) {
            page.name = "chinese#g" + no;
          } else if (cid === 3) {
            page.name = "english#g" + no;
          } else if (cid === 4) {
            page.name = "logic#g" + no;
          }
        }
        return page;
      },
      handleCommand(command) {
        if (command === "student") {
          this.form.name = this.profile.name;
          this.form.class = this.profile.class;
          this.form.source = this.profile.source;
          this.dialogInfoVisible = true;
        } else if (command === 'mine') {
          // 如果当前已经是
          if (this.$router.history.current.name === 'mine') {
            return
          }
          this.$router.push({name:'mine'})
        } else if (command === 'score') {
          // 如果当前已经是
          if (this.$router.history.current.name === 'score') {
            return
          }
          this.authForm.pwd = ''
          this.dialogAuthVisible = true
        } else if (command === 'quit') {
          ycUtils.ajaxPost({
            url: "http://localhost:3000/api/quit",
            success: (data) => {}
          })
        }
      },
      modifyProfile() {
        if (this.form.name === "") {
          this.$message("姓名不能为空");
          return;
        }

        ycUtils.ajaxPost({
          url: "http://localhost:3000/api/updateProfile",
          data: this.form,
          success: (data) => {
            if (data.result == 0) { // 成功
              this.$store.commit("updateUser", this.form);
              this.$store.commit("updateSource", this.form.source);
              this.updateProfile()
              this.profile.source = this.$store.getters.source;
              this.dialogInfoVisible = false;
              this.$message("学生信息修改成功");
              // 重新加载当前页面
              this.reload()
            } else {
              this.$message("学生信息修改失败: " + data.err);
            }
          }
        });
      },
      reload() {
        this.isRouterAlive = false
        this.$nextTick(function () {
          this.isRouterAlive = true
        })
      },
      onAuthUser() {
        if (this.authForm.pwd === '') {
          return
        }
        // 提交验证请求
        ycUtils.ajaxPost({
          url: "http://localhost:3000/api/login",
          data: {pwd: ycUtils.sha256(this.authForm.pwd)},
          success: (data) => {
            if (data.result == 0) {
              this.dialogAuthVisible = false
              this.$nextTick(function () {
                this.$router.push({name: 'score'});
              })
            } else {
              this.$message.error('身份验证失败 -' + data.err)
            }
          }
        });
      }
    },
    created: function () {
      this.updateFooter();
    },
    mounted: function () {
      this.showGradeName(this.activeGradeIndex);
      // 读取配置信息，初始化状态
      ycUtils.ajaxGet({
        url: "http://localhost:3000/api/manifest",
        success: (data) => {
          if (data.result == 0) {
            this.$store.commit("updateManifest", data.content);
            this.updateProfile();
            this.updateFooter();
          } else {
            this.$message.error('读取配置信息失败，请退出重试')
          }
        }
      });
      this.$router.push(
        this.getPage(this.activeCourseIndex, this.activeGradeIndex)
      );
    }
  };
</script>
