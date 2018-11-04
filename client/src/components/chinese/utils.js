

import yuchg from '../../base'
import logger from '../../logger'

const utils = {
  readWord: function (word, option) {

    if (!yuchg.isString(word)) {
      logger.warn('readWord failed: word is not string', word)
      return
    }

    if ('speechSynthesis' in window) {
      let words = new SpeechSynthesisUtterance(word)
      if (option) {
        words.voice = option.voice
        words.rate = option.rate
      }
      window.speechSynthesis.speak(words)
    } else {
      throw new Error('speechSynthesis is not supported')
    }
  },
  getVoices: function () {
    let list = []
    if ('speechSynthesis' in window) {
      let voices = window.speechSynthesis.getVoices();
      // 只取第一个，国内window系统上微软语音引擎可用，Google需要翻墙
      for (let i=0; i<voices.length; i++) {
        if (voices[i].lang.indexOf('zh-') === 0 || voices[i].name === 'native') {
          list.push(voices[i])
          break
        }
      }
    } else {
      throw new Error('speechSynthesis is not supported')
    }
    return list
  }
}

export default utils