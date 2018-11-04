<template>
    <div class="container">
      <el-tabs type="border-card" @tab-click="onTabClick" value="test">
        <el-tab-pane label="单词听写" name="test">
         <el-button-group>
          <el-button type="primary" icon="el-icon-edit" @click="onClickStart" :disabled="buttons.start">开始听写</el-button>
          <el-button type="success" icon="fa fa-repeat" @click="onClickReset" :disabled="buttons.again">重新开始</el-button>
        </el-button-group>
        <el-collapse v-model="activeName" accordion>
          <el-collapse-item title="听写选项" name="1">
           <el-form ref="form" :model="form" label-width="80px">
              <el-form-item label="声音模式">
                                <el-radio-group v-model="form.voice">
                                    <el-radio v-for="(item, index) in voices" :label="index + 1">{{ item.name }}</el-radio>
                                </el-radio-group>
                            </el-form-item>
                           <el-form-item label="语速">
                                <el-input-number v-model="form.rate" :step="1" :min="1" :max="100"></el-input-number>
                                （10为标准语速）
                            </el-form-item>
            <el-form-item label="听写模式">
              <el-radio-group v-model="form.mode">
                <el-radio label="1">顺序</el-radio>
                <el-radio label="2">随机</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="上册">
              <el-checkbox-group v-model="form.select.first">
                <template v-for="(item, index) in words.first">
                  <el-checkbox v-if="item.length > 0" :label="index" border size="medium">第{{ index + 1 }}课</el-checkbox>
                </template>
              </el-checkbox-group>
            </el-form-item>
            <el-form-item label="下册">
              <el-checkbox-group v-model="form.select.second">
                <template v-for="(item, index) in words.second">
                  <el-checkbox v-if="item.length > 0" :label="index" border size="medium">第{{ index + 1 }}课</el-checkbox>
                </template>
              </el-checkbox-group>
            </el-form-item>
            <el-form-item label="扩展">
              <el-checkbox-group v-model="form.select.extend">
                <template v-for="(item, index) in words.extend">
                  <el-checkbox v-if="item.length > 0" :label="index" border size="medium">第{{ index + 1 }}课</el-checkbox>
                </template>
              </el-checkbox-group>
            </el-form-item>
           </el-form>
          </el-collapse-item>
        </el-collapse>
        <div id="buddha-page" class="buddha-page">
          <Word ref="word"></Word>
        </div>
        </el-tab-pane>
        <el-tab-pane label="单词管理" name="library">
         <WordLibrary :url="url" @update="updateWords" ref="wordlib"></WordLibrary>
        </el-tab-pane>
        <el-tab-pane label="记录统计" name="stat">
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

.el-checkbox {
  margin-left: 0px;
  margin-right: 10px;
}
</style>

<script>
import Word from "../../components/english/Word.vue";
import utils from "../../components/english/utils";
import WordLibrary from "../../components/english/WordLibrary.vue";
import yuchg from '../../base'
import ycUtils from '../../utils'
import logger from '../../logger'


export default {
  components: { Word, WordLibrary },
  data: function() {
    return {
      activeName: "1",
      voices: [],
      form: {
         rate: 10,
        voice: 1,
        grade: "",
        name: "",
        mode: "2",
        select: {
          first: [],
          second: [],
          extend: []
        }
      },
      words: {
        first: [],
        second: [],
        extend: []
      },
      buttons: {
            start: false,
            again: false
        },
      url: ''
    };
  },
  methods: {
     onTabClick(tab) {
          if (tab.name === 'library') {
              this.$refs.wordlib.fetchWords()
          }
      },
    onClickStart() {
      // 整理单词清单
      const select = this.form.select
      let selwords = []
      if (select.first.length > 0 || select.second.length > 0 || select.second.extend > 0) {
        for (let i of select.first) {
          selwords = selwords.concat(this.words.first[i])
        }
        for (let i of select.second) {
          selwords = selwords.concat(this.words.second[i])
        }
        for (let i of select.extend) {
          selwords = selwords.concat(this.words.extend[i])
        }
        
      } else {
        this.$message("请选择要听写的课文");
        return;
      }

      if (selwords.length <= 0) {
        this.$message("选择要听写的课文没有单词表，请检查单词数据表是否正确");
        return;
      }

      // 随机打乱
      if (this.form.mode == 2) {
        selwords = yuchg.shuffle(selwords);
      }
        let voice = this.voices[this.form.voice - 1]
        this.$refs.word.restart(selwords, {voice:voice, rate: this.form.rate / 10.0})
 
    },
    onClickReset() {
      this.$refs.word.restart();
    },
    updateProfile() {
      this.form.grade = this.$store.getters.gradeFullName;
      this.form.name = this.$store.state.user.name;
    },
    updateWords(data) {
      this.words.first = data.first;
      this.words.second = data.second;
      this.words.extend = data.extend;
    }
  },
  created: function() {
    // 读取单词表
    let source = this.$store.getters.source
    this.url = `http://localhost:3000/api/whole/${source}/glossary/g4`
     this.voices = utils.getVoices()

    ycUtils.ajaxGet({
        url: this.url,
        success: (data) => {
          if (data.result === 0) {
            this.updateWords(data.content)
          } else {
            this.$message.error('读取单词表失败 -' + data.err)
          }
        }
    });
  },
  mounted: function() {
    this.updateProfile();
  },
  activated: function() {
    this.updateProfile();
  }
};
</script>
