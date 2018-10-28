

const utils = {
  readWord: function(word) {
    if ('speechSynthesis' in window) {
      let words = new SpeechSynthesisUtterance(word)
      window.speechSynthesis.speak(words)
    } else {
      throw new Error('speechSynthesis is not supported')
    }
  }
}

export default utils