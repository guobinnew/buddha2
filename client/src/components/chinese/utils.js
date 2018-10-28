

import yuchg from '../../base'
import logger from '../../logger'

const utils = {
  readWord: function(word) {
    if (!yuchg.isString(word)) {
      logger.warn('readWord failed: word is not string', word)
      return
    }

    if ('speechSynthesis' in window) {
      let words = new SpeechSynthesisUtterance(word)
      window.speechSynthesis.speak(words)
    } else {
      throw new Error('speechSynthesis is not supported')
    }
  }
}

export default utils