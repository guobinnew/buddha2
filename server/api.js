/**
 * Created by ods_h on 2018/5/27.
 */
var express = require('express')
var router = express.Router()
var logger = require('./logger.js')
var path = require('path')
var fs = require('fs')


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
    res.json({
      result: 1,
      err: '教程类型错误'
    })
  } else {
    //console.log('modify manifest ===== ', req.body, manifest.user)
    fs.writeFileSync(_path, JSON.stringify(manifest))
    res.json({
      result: 0,
      err: ''
    })
  }
})

// 获取词汇表
const dbpath = path.join(__dirname, 'data/db')
router.get('/:source/:type/:grade', function(req, res, next) {
  //
  var _path = path.join(dbpath, req.params.source, req.params.grade, req.params.type + '.json')
  var data = fs.readFileSync(_path)
  var json = JSON.parse(data)
  res.json(json)

})

module.exports = router