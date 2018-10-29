/**
 * Created by ods_h on 2018/5/27.
 */
var express = require('express')
var router = express.Router()
var logger = require('./logger.js').logger
var path = require('path')
var fs = require('fs')


const emptyWords = {
  first:[],
  second:[],
  extend:[]
}
const errorCodes = {
  OK:  {result: 0,err: ''},
  SOURCE_TYPE_ERROR: {result: 1,err: '教程类型错误'},
  WRITE_DATAFILE_ERROR: {result: 100,err: '更新数据文件时发生错误'}
}

// 同步读取文件
function readWordFileSync(path, create = true) {
  let content = emptyWords
  try {
    if (!fs.existsSync(path)) {
      if (create) {
        fs.writeFileSync(path, JSON.stringify(emptyWords))
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

router.get('/manifest', function(req, res, next) {
  var _path = path.join(__dirname, 'data/manifest.json')
  var data = fs.readFileSync(_path)
  var json = JSON.parse(data)
  res.json(json)
})

// 更新用户信息
router.post('/updateProfile', function(req, res, next) {

  var _path = path.join(__dirname, 'data/manifest.json')
  var manifest = JSON.parse(fs.readFileSync(_path))

  manifest.user.name = req.body.name
  manifest.user.class = Number(req.body.class)
  // 计算source索引
  const src = manifest.database.sources
  src.current = src.items.map(function(item) {
    return item.id
  }).indexOf(req.body.source)

  if (src.current < 0) {
    res.json(errorCodes.SOURCE_TYPE_ERROR)
  } else {
    fs.writeFileSync(_path, JSON.stringify(manifest))
    res.json(errorCodes.OK)
  }
})

// 获取词汇表
const dbpath = path.join(__dirname, 'data/db')
router.get('/:source/:type/:grade', function(req, res, next) {
  var _path = path.join(dbpath, req.params.source, req.params.grade, req.params.type + '.json')
  var json = readWordFileSync(_path)
  res.json(json)
})

// 更新词汇表
router.post('/file/:source/:type/:grade', function(req, res, next) {
  // 覆盖目标文件
  var _path = path.join(dbpath, req.params.source, req.params.grade, req.params.type + '.json')
  try {
    fs.writeFileSync(_path, req.body)
    res.json(errorCodes.OK)
  } catch (err) {
    logger.log('error','write file <' + _path + '> failed -' + err)
    res.json(errorCodes.WRITE_DATAFILE_ERROR)
  }
})

// 更新词汇表section
router.post('/partial/:source/:type/:grade/:section', function(req, res, next) {
  // 覆盖目标文件
  var _path = path.join(dbpath, req.params.source, req.params.grade, req.params.type + '.json')
  var data = fs.readFileSync(_path)
  var json = JSON.parse(data)
  var oldSection = json[req.params.section]
  // 根据课序号进行替换, 如果没有则进行追加

  res.json(errorCodes.OK)
})


module.exports = router