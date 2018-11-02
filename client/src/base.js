// Copyright 2018 Unique. All Rights Reserved.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS-IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

let yuchg = {}

yuchg.global = this // 大多情况为window

/**
 * 判断变量是否定义
 */
yuchg.isDef = function(val) {
  // void 0 始终等于 undefined
  return val !== void 0
}

/**
 * 判断变量类型是否是字符串
 */
yuchg.isString = function(val) {
  return typeof val === 'string'
}

/**
 * 判断变量类型是否是布尔值
 */
yuchg.isBoolean = function(val) {
  return typeof val === 'boolean'
}

/**
 * 判断变量类型是否是数值
 */
yuchg.isNumber = function(val) {
  return typeof val === 'number'
}

/**
 * 根据字符串名字获取对象
 */
yuchg.getObjectByName = function(name, optObj) {
  let parts = name.split('.')
  let cur = optObj || yuchg.global
  for (let i = 0; i < parts.length; i++) {
    cur = cur[parts[i]]
    if (!yuchg.isDefAndNotNull(cur)) {
      return null
    }
  }
  return cur
}

/**
 * 打印错误日志（内部使用）
 */
yuchg.logToConsole_ = function(msg) {
  if (yuchg.global.console) {
    yuchg.global.console['error'](msg)
  }
}

/**
 * 空函数
 */
yuchg.nullFunction = function() {}

/**
 * 抽象方法占位函数
 */
yuchg.abstractMethod = function() {
  throw new Error('unimplemented abstract method')
}

/**
 * 改进typeof
 */
yuchg.typeOf = function(value) {
  let s = typeof value
  if (s === 'object') {
    if (value) {
      if (value instanceof Array) {
        return 'array'
      } else if (value instanceof Object) {
        return s
      }

      let className = Object.prototype.toString.call( /** @type {!Object} */ (value))
      if (className === '[object Window]') {
        return 'object'
      }

      // 判断是否为数组类型
      if (className === '[object Array]' ||
        (typeof value.length === 'number' &&
          typeof value.splice !== 'undefined' &&
          typeof value.propertyIsEnumerable !== 'undefined' &&
          !value.propertyIsEnumerable('splice'))) {
        return 'array'
      }

      // 判断是否为函数类型
      if (className === '[object Function]' ||
        (typeof value.call !== 'undefined' &&
          typeof value.propertyIsEnumerable !== 'undefined' &&
          !value.propertyIsEnumerable('call'))) {
        return 'function'
      }
    } else {
      return 'null'
    }
  } else if (s === 'function' && typeof value.call === 'undefined') {
    return 'object'
  }
  return s
}

/**
 * 判断是否为空
 */
yuchg.isNull = function(val) {
  return val == null
}

/**
 * 判断是否非空
 */
yuchg.isDefAndNotNull = function(val) {
  return val != null
}

/**
 * 判断是否为数组
 */
yuchg.isArray = function(val) {
  return yuchg.typeOf(val) === 'array'
}

/**
 * 判断是否为类数组
 */
yuchg.isArrayLike = function(val) {
  var type = yuchg.typeOf(val)
  return type === 'array' || (type === 'object' && typeof val.length === 'number')
}

/**
 * 判断是否为函数
 */
yuchg.isFunction = function(val) {
  return yuchg.typeOf(val) === 'function'
}

/**
 * 判断是否为对象
 */
yuchg.isObject = function(val) {
  var type = typeof val
  return (type === 'object' && val != null) || type === 'function'
}

/**
 * 克隆对象（深度递归）
 */
yuchg.cloneObject = function(obj) {
  var type = yuchg.typeOf(obj)
  if (type === 'object' || type === 'array') {
    if (obj.clone) {
      return obj.clone()
    }
    var clone = type === 'array' ? [] : {}
    for (var key in obj) {
      clone[key] = yuchg.cloneObject(obj[key])
    }
    return clone
  }
  return obj
}

/**
 * 继承对象
 */
yuchg.inherits = function(childCtor, parentCtor) {
  /** @constructor */
  function TempCtor() {}

  TempCtor.prototype = parentCtor.prototype
  childCtor.superClass_ = parentCtor.prototype
  childCtor.prototype = new TempCtor()
  /** @override */
  childCtor.prototype.constructor = childCtor

  childCtor.base = function(me, methodName, varArgs) {
    var args = new Array(arguments.length - 2)
    for (var i = 2; i < arguments.length; i++) {
      args[i - 2] = arguments[i]
    }
    return parentCtor.prototype[methodName].apply(me, args)
  }
}

/**
 * 计算中英文字节长度, 中文算2个字节
 */
yuchg.strByteLength = function(str) {
  var arr = str.match(/[^\x00-\xff]/ig)
  return str.length + (arr == null ? 0 : arr.length)
}

/**
 * 字符串trim
 */
yuchg.trimString = function(str) {
  return str.replace(/^\s+|\s+$/g, '')
}

/**
 * 合并数组并去重, 返回新数组
 */
yuchg.concatArray = function(arr1, arr2) {
  var arr = arr1.concat(arr2)
  return Array.from(new Set(arr))
}

/**
 * 
 */
const NumString = ['零', '一', '二', '三', '四', '五', ' 六', '七', '八', '九', '十', '百', '千', '万']
yuchg.number2String = function(n) {
  if (!yuchg.isNumber(n)) {
    return ''
  }

  if (n < 10) {
    return NumString[n]
  }
  // 
  return ''
}

// 随机排序
yuchg.randomSort = function(a, b) {
  return Math.random() > 0.5 ? -1 : 1
}

// 洗牌
yuchg.shuffle = function(arr) {
  var len = arr.length;
  for(var i = 0; i < len - 1; i++){
    var idx = Math.floor(Math.random() * (len - i));
    var temp = arr[idx];
    arr[idx] = arr[len - i - 1];
    arr[len - i -1] = temp;
  }
  return arr;
}

// 随机ID
yuchg.randomString = function(len) {
  len = len || 32;
  var $chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  var maxPos = $chars.length;
  var pwd = '';
  for (var i = 0; i < len; i++) {
    //0~32的整数  
    pwd += $chars.charAt(Math.floor(Math.random() * (maxPos + 1)));
  }
  return pwd;
}

// 当前日期
yuchg.currentTimeString = function() {
  let date = new Date()
  const year = date.getFullYear() //获取当前年份
  const mon = date.getMonth() + 1 //获取当前月份
  const da = date.getDate() //获取当前日
  return year + '-' + mon + '-' + da
}

// 日期比较
yuchg.dateCompare = function(d1, d2) {
  let od1 = new Date(d1);
  let od2 = new Date(d2);
  if (od1.getTime() > od2.getTime()) {
    return 1
  } else if (od1.getTime() < od2.getTime()) {
    return -1
  }
  return 0
}

yuchg.randomNumber = function(max, min = 0) {
  return Math.floor(Math.random() * (max - min + 1) + min)
}

export default yuchg