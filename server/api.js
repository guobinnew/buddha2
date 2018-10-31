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

var cryptoSecret = 'unique@buddha2'

function isString(val) {
  return typeof val === 'string'
}

// JSON解码
function decodeJson(code) {
  var bytes = CryptoJS.AES.decrypt(code, cryptoSecret);
  return bytes.toString(CryptoJS.enc.Utf8);
}

// JSON编码
function encodeJson(json) {
  var cipher = CryptoJS.AES.encrypt(
    JSON.stringify(json),
    cryptoSecret
  );
  return cipher.toString()
}

var emptyRecords = {
  "score": 0,
  "records": []
}

var errorCodes = {
  OK: {result: 0, err: ''},
  SOURCE_TYPE_ERROR: {result: 1, err: '教程类型错误'},
  WRITE_DATAFILE_ERROR: {result: 100, err: '更新数据文件时发生错误'},
  READ_DATAFILE_ERROR: {result: 101, err: '读取数据文件时发生错误'},
  LOGIN_ERROR: {result: 1000, err: '密码不正确'}
}

// 同步读取文件
function readDBFileSync(path, emptyContent, create = true) {
  var content = emptyContent
  try {
    if (!fs.existsSync(path)) {
      if (create) {
        fs.writeFileSync(path, JSON.stringify(emptyContent))
      }
    } else {
      var data = fs.readFileSync(path)
      content = JSON.parse(data)
    }
  } catch (err) {
    logger.log('error', 'read file <' + path + '> failed, reason -' + err)
  }
  return content
}

router.post('*', function (req, res, next) {
  if (isString(req.body)) {
    req.body.content = JSON.parse(decodeJson(req.body))
    next()
  }
})

// 身份验证
router.post('/login', function (req, res, next) {
  // 检查密码是否正确
  if (req.body.content.pwd === settings.admin.password) {
    res.json(errorCodes.OK)
  } else {
    res.json(errorCodes.LOGIN_ERROR)
  }
})

// 获取manifest
router.get('/manifest', function (req, res, next) {
  var _path = path.join(__dirname, 'data/manifest.json')
  var data = readDBFileSync(_path, {})
  var json = JSON.parse(data)
  res.json({result: 0, err: '', content: encodeJson(json)})
})

// 更新用户信息
router.post('/updateProfile', function (req, res, next) {

  var _path = path.join(__dirname, 'data/manifest.json')
  try {
    var manifest = readDBFileSync(_path, {})
    var json = req.body.content

    manifest.user.name = json.name
    manifest.user.class = Number(json.class)
    // 计算source索引
    const src = manifest.database.sources
    src.current = src.items.map(function (item) {
      return item.id
    }).indexOf(json.source)

    if (src.current < 0) {
      res.json(errorCodes.SOURCE_TYPE_ERROR)
    } else {
      fs.writeFileSync(_path, JSON.stringify(manifest))
      res.json(errorCodes.OK)
    }
  } catch (err) {

  }
})


const scorepath = path.join(__dirname, 'data/score')
// 获取积分记录
router.get('/score/record', function (req, res, next) {
  var _path = path.join(scorepath, 'score_vip.json')
  try {
    var json = readDBFileSync(_path, emptyRecords)
    res.json({result: 0, err: '', content: encodeJson(json)})
  } catch (err) {
    logger.log('error', 'read file <' + _path + '> failed -' + err)
    res.json(errorCodes.READ_DATAFILE_ERROR)
  }
})

// 修改积分记录
router.post('/score/update', function (req, res, next) {
  var _path = path.join(scorepath, 'score_vip.json')
  try {
    var json = readDBFileSync(_path, emptyRecords)
    // 解码数据
    if (req.body.type === 'add') {

    }


    res.json({result: 0, err: '', data: json})
  } catch (err) {
    logger.log('error', 'read file <' + _path + '> failed -' + err)
    res.json(errorCodes.READ_DATAFILE_ERROR)
  }
})


// 获取成绩表
router.get('/score/:grade/:type', function (req, res, next) {
  var _path = path.join(scorepath, req.params.grade, req.params.type + '.json')
  try {
    var json = readDBFileSync(_path, [])
    res.json({result: 0, err: '', data: json})
  } catch (err) {
    logger.log('error', 'read file <' + _path + '> failed -' + err)
    res.json(errorCodes.READ_DATAFILE_ERROR)
  }
})

// 修改成绩表
router.post('/score/:grade/:type', function (req, res, next) {
  // 覆盖目标文件
  var _path = path.join(scorepath, req.params.grade, req.params.type + '.json')
  try {
    var json = decodeJson(req.body.content.toString());
    fs.writeFileSync(_path, json)
    res.json(errorCodes.OK)
  } catch (err) {
    logger.log('error', 'write file <' + _path + '> failed -' + err)
    res.json(errorCodes.WRITE_DATAFILE_ERROR)
  }
})


// 获取词汇表
const dbpath = path.join(__dirname, 'data/db')
const emptyWords = {
  first: [],
  second: [],
  extend: []
}

router.get('/whole/:source/:type/:grade', function (req, res, next) {
  var _path = path.join(dbpath, req.params.source, req.params.grade, req.params.type + '.json')
  try {
    var json = readDBFileSync(_path, emptyWords)
    res.json({result: 0, err: '', data: json})
  } catch (err) {
    logger.log('error', 'read file <' + _path + '> failed -' + err)
    res.json(errorCodes.READ_DATAFILE_ERROR)
  }
})

// 更新词汇表
router.post('/whole/:source/:type/:grade', function (req, res, next) {
  // 覆盖目标文件
  var _path = path.join(dbpath, req.params.source, req.params.grade, req.params.type + '.json')
  try {
    var json = decodeJson(req.body.content.toString())
    fs.writeFileSync(_path, json)
    res.json(errorCodes.OK)
  } catch (err) {
    logger.log('error', 'write file <' + _path + '> failed -' + err)
    res.json(errorCodes.WRITE_DATAFILE_ERROR)
  }
})

// 更新词汇表section
router.post('/partial/:source/:type/:grade/:section', function (req, res, next) {
  // 覆盖目标文件
  var _path = path.join(dbpath, req.params.source, req.params.grade, req.params.type + '.json')
  var data = readDBFileSync(_path, emptyWords)
  var json = JSON.parse(data)
  var oldSection = json[req.params.section]
  // 根据课序号进行替换, 如果没有则进行追加

  res.json(errorCodes.OK)
})


module.exports = router