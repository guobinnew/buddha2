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


const emptyWords = {
  first:[],
  second:[],
  extend:[]
}
const errorCodes = {
  OK:  {result: 0, err: ''},
  SOURCE_TYPE_ERROR: {result: 1, err: '教程类型错误'},
  WRITE_DATAFILE_ERROR: {result: 100,err: '更新数据文件时发生错误'},
  READ_DATAFILE_ERROR: {result: 101,err: '读取数据文件时发生错误'},
  LOGIN_ERROR: {result: 1000, err: '密码不正确'}
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

// 身份验证
router.post('/login', function(req, res, next) {
  // 检查密码是否正确
  if (req.body.pwd === settings.admin.password) {
    res.json(errorCodes.OK)
  } else {
    res.json(errorCodes.LOGIN_ERROR)
  }
})

// 获取manifest
router.get('/manifest', function(req, res, next) {
  var _path = path.join(__dirname, 'data/manifest.json')
  var data = fs.readFileSync(_path)
  var json = JSON.parse(data)
  res.json({result: 0, err: '', data: json})
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

// 积分管理
const scorepath = path.join(__dirname, 'data/score')
router.get('/score/record', function(req, res, next) {
  var _path = path.join(scorepath, 'score_vip.json')
  try {
    var json = readWordFileSync(_path)
    res.json({result: 0, err: '', data: json})
  } catch (err) {
    logger.log('error','read file <' + _path + '> failed -' + err)
    res.json(errorCodes.READ_DATAFILE_ERROR)
  }
})

// 获取词汇表
const dbpath = path.join(__dirname, 'data/db')
router.get('/whole/:source/:type/:grade', function(req, res, next) {
  var _path = path.join(dbpath, req.params.source, req.params.grade, req.params.type + '.json')
  try {
    var json = readWordFileSync(_path)
    res.json({result: 0, err: '', data: json})
  } catch (err) {
    logger.log('error','read file <' + _path + '> failed -' + err)
    res.json(errorCodes.READ_DATAFILE_ERROR)
  }
})

// 更新词汇表
router.post('/whole/:source/:type/:grade', function(req, res, next) {
  // 覆盖目标文件
  var _path = path.join(dbpath, req.params.source, req.params.grade, req.params.type + '.json')
  try {
    var bytes  = CryptoJS.AES.decrypt(req.body.content.toString(), 'unique@buddha2');
    var json = bytes.toString(CryptoJS.enc.Utf8);
    fs.writeFileSync(_path, json)
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