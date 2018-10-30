/**
 * Created by ods_h on 2018/5/27.
 */
var express = require('express')
var router = express.Router()
var logger = require('./logger.js').logger
var path = require('path')
var fs = require('fs')
var CryptoJS = require('crypto-js')
var settings = require('./setting')


var emptyIndex = {
  "rootPath": "data/download",
  "indexes": []
}

var errorCodes = {
  OK:  {result: 0, err: ''},
  SOURCE_TYPE_ERROR: {result: 1, err: '教程类型错误'},
  WRITE_DATAFILE_ERROR: {result: 100, err: '更新数据文件时发生错误'},
  MISSING_DATAFILE_ERROR: {result: 101, err: '数据文件没有找到'},
  LOGIN_ERROR: {result: 1000, err: '密码不正确'}
}

// 同步读取文件
var dataPath = path.join(__dirname, 'data')
var downloadIndexPath = path.join(dataPath, 'download.json')

function readIndexFileSync(path, create = true) {
  var content = emptyIndex
  try {
    if (!fs.existsSync(path)) {
      if (create) {
        fs.writeFileSync(path, JSON.stringify(emptyIndex))
      }
    } else {
      var data = fs.readFileSync(path)
      content = JSON.parse(data)
    }
  } catch(err) {
    logger.log('error','read file <' + path + '> failed, reason -' + err)
  }
  return content
}

function convertUTCDateToLocal(UTCDateString) {
  if (!UTCDateString) {
    return '-'
  }

  function formatFunc(str) { //格式化显示
    return str > 9 ? str : '0' + str
  }
  var date2 = new Date(UTCDateString)
  var year = date2.getFullYear()
  var mon = formatFunc(date2.getMonth() + 1)
  var day = formatFunc(date2.getDate())
  var dateStr = year + '-' + mon + '-' + day
  return dateStr
}

// 身份验证
router.post('/login', function(req, res, next) {
  // 检查密码是否正确
  if (req.body.pwd === settings.admin.password) {
    res.json(errorCodes.OK)
  } else {
    res.json(errorCodes.LOGIN_ERROR)
  }
})

var downloadLength = 0
var downloadRootPath = ''
var downloadIndexMap = null
var downloadIndexGradeMap = null
var downloadIndexTypeMap = null
var downloadIndexUpdateTime = Date.now()
// 更新download索引
function updateDownloadIndex() {
  // 比较时间
  var interval = Date.now() - downloadIndexUpdateTime
  if (!downloadIndexMap || !downloadIndexGradeMap || !downloadIndexTypeMap || interval > 300000 ){  // 更新周期为5分钟
    // 重新读取文件
    let data = readIndexFileSync(downloadIndexPath)
    downloadIndexUpdateTime = Date.now()
    downloadRootPath = data.rootPath
    downloadLength = data.indexes.length
    downloadIndexMap = {}
    downloadIndexGradeMap = {}
    downloadIndexTypeMap = {}
    data.indexes.forEach(function (value) {
      downloadIndexMap[value.id] = value
      if (!downloadIndexGradeMap[value.grade]) {
        downloadIndexGradeMap[value.grade] = []
      }
      downloadIndexGradeMap[value.grade].push(value)

      if (!downloadIndexTypeMap[value.type]) {
        downloadIndexTypeMap[value.type] = []
      }
      downloadIndexTypeMap[value.type].push(value)
    })
  }
}

// 获取文件索引
router.get('/index/:type/:grade', function(req, res, next) {
  // 更新索引
  updateDownloadIndex()
  // 根据类型遍历
  var gradeSet = downloadIndexGradeMap[req.params.grade]
  if (!gradeSet) {
    res.json(errorCodes.OK)
  } else {
    // 匹配类型
    var type = req.params.type
    let data = gradeSet.filter(function (value, index) {
      return value.type === type
    })
    res.json({result: 0, err: '', data: data.map(function (value) {
      return {
        id: value.id,
        source: value.source,
        type: value.type,
        grade: value.grade,
        author: value.author,
        title: value.title
      }
    })})
  }
})

router.get('/indextype/:type', function(req, res, next) {
  // 更新索引
  updateDownloadIndex()
  // 根据类型遍历
  var typeSet = downloadIndexTypeMap[req.params.type]
  if (!typeSet) {
    res.json(errorCodes.OK)
  } else {
    res.json({result: 0, err: '', data: typeSet.map(function (value) {
      return {
        id: value.id,
        source: value.source,
        type: value.type,
        grade: value.grade,
        author: value.author,
        title: value.title
      }
    })})
  }
})

router.get('/indexgrade/:grade', function(req, res, next) {
  // 更新索引
  updateDownloadIndex()
  // 根据类型遍历
  var gradeSet = downloadIndexGradeMap[req.params.grade]
  if (!gradeSet) {
    res.json(errorCodes.OK)
  } else {
    // 匹配类型
    res.json({result: 0, err: '', data: gradeSet.map(function (value) {
      return {
        id: value.id,
        source: value.source,
        type: value.type,
        grade: value.grade,
        author: value.author,
        title: value.title
      }
    })})
  }
})

// 下载文件
router.get('/download/:fileid', function(req, res, next) {
  // 更新索引
  updateDownloadIndex()
  // 根据fileid检索文件路径
  let info = downloadIndexMap[req.params.fileid]
  if (!info) {
    res.status(404).end()
  } else {
    res.download(path.join(dataPath, downloadRootPath, info.path))
  }
})

module.exports = router