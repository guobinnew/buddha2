const Opers = ['+', '-']
const Opers2 = ['×', '÷']
const Week = ['日', '一', '二', '三', '四', '五', '六']

// 生成随机数
function randomNumber(max, min = 0) {
  return Math.floor(Math.random() * (max - min + 1) + min)
}

const utils = {
  // 随机生一个加减计算，结果在指定范围内
  randomSimpleTest: function(level) {
    let a = 0
    let b = 0
    let res = 0
    let op = Opers[randomNumber(Opers.length - 1)]
    let eq = '='
    let max = 1
    let min = 1

    do {
      if (level === 1) {
        max = 100
        // 随机取1个数字
        a = randomNumber(max - 1, 20)
        // 随机取第2个数字
        if (op === '+') {
          b = randomNumber(max - a - 1, 10)
          res = a + b
        } else {
          b = randomNumber(a - 1, 10)
          res = a - b
        }
      } else if (level === 2) {
        max = 1000
        // 随机取1个数字
        a = randomNumber(max - 21, 10)
        // 随机取第2个数字
        if (op === '+') {
          b = randomNumber(max - a - 1, 10)
          res = a + b
        } else {
          b = randomNumber(a - 1, 10)
          res = a - b
        }
      } else {
        max = 1000
        // 随机取1个数字
        a = randomNumber(max - 201, 100)
        // 随机取第2个数字
        if (op === '+') {
          b = randomNumber(max - a - 1, 100)
          res = a + b
        } else {
          b = randomNumber(a - 1, 100)
          res = a - b
        }
      }
    } while (res < min || res > max)

    var arr = [a, op, b, eq]
    return {
      q: arr.join(' '),
      a: res
    }
  },

  // 随机生一个乘除计算
  randomHardTest: function(style, level = 1) {
    let a = 0
    let b = 0
    let res = 0
    let op = Opers2[style - 1]
    let eq = '='

    if (level === 1) {
      // 随机取1个数字
      a = randomNumber(99, 10)
      // 随机取第2个数字
      b = randomNumber(9, 1)
    } else if (level === 2) {
      // 随机取1个数字
      a = randomNumber(99, 10)
      // 随机取第2个数字
      b = randomNumber(99, 10)
    } else {
      // 随机取1个数字
      a = randomNumber(999, 100)
      // 随机取第2个数字
      b = randomNumber(99, 10)
    }
    res = a * b

    let tmp = 0
    if (style === 2) { // 除法
      if (a > b) {
        tmp = b
        b = a
        a = res
        res = tmp
      } else {
        tmp = a
        a = res
        res = tmp
      }
    }

    var arr = [a, op, b, eq]
    return {
      q: arr.join(' '),
      a: res
    }
  },

  currentTime: function() {
    let date = new Date()
    const year = date.getFullYear() //获取当前年份
    const mon = date.getMonth() + 1 //获取当前月份
    const da = date.getDate() //获取当前日
    const day = date.getDay() //获取当前星期几
    return year + ' 年 ' + mon + ' 月 ' + da + ' 日' + ' 星期' + Week[day]
  },

  currentTimeString: function() {
    let date = new Date()
    const year = date.getFullYear() //获取当前年份
    const mon = date.getMonth() + 1 //获取当前月份
    const da = date.getDate() //获取当前日
    return year + '-' + mon + '-' + da
  },

  datetimeString: function(date) {
    const year = date.getFullYear() //获取当前年份
    const mon = date.getMonth() + 1 //获取当前月份
    const da = date.getDate() //获取当前日
    return year + '-' + mon + '-' + da
  },

  dateCompare(d1, d2) {
    var od1 = new Date(d1);
    var od2 = new Date(d2);
    if (od1.getTime() > od2.getTime()) {
      return 1
    } else if (od1.getTime() < od2.getTime()) {
      return -1
    }
    return 0
  },

  time2String(sec) {
    const s = sec % 60
    let m = Math.floor(sec / 60)
    let h = 0
    let d = 0
    if (m > 60) {
      h =  Math.floor(m / 60)
      m = m % 60
    }
    if (h > 24) {
      d =  Math.floor(m / 24)
      h = h % 60
    }
    return  (d ? d + ' 天' : '') + (h ? h + ' 小时' : '') + (m ? m + ' 分' : '') + (s ? s + ' 秒' : '')
  },

  debounce: function(func, wait, immediate) {
    let timeout, args, context, timestamp, result
  
    const later = function() {
      // 据上一次触发时间间隔
      const last = +new Date() - timestamp
  
      // 上次被包装函数被调用时间间隔last小于设定时间间隔wait
      if (last < wait && last > 0) {
        timeout = setTimeout(later, wait - last)
      } else {
        timeout = null
        // 如果设定为immediate===true，因为开始边界已经调用过了此处无需调用
        if (!immediate) {
          result = func.apply(context, args)
          if (!timeout) context = args = null
        }
      }
    }
  }
}

export default utils