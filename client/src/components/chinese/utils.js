

const utils = {
  readWord: function(word) {
    // 在线语音合成
    responsiveVoice.speak(word, "Chinese Female", {
      rate: 0.8
    })
  }
}

export default utils