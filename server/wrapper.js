(function() {
  'use strict'

  var express = require('express')
  var path = require('path')
  var winston = require('winston')
  var expressWinston = require('express-winston')
  var cookieParser = require('cookie-parser')
  var bodyParser = require('body-parser')
  var session = require('express-session'); // session中间件
  var settings = require('./setting')

  var app = express()
  var port = 3000

  // root参数指定静态文件的根目录
  var rootDir = path.resolve(__dirname, '../client/dist')
  app.use('/', express.static(rootDir))
  app.use(bodyParser.urlencoded({
    extended: true
  }))
  app.use(bodyParser.json())
  app.use(cookieParser())
  app.use(session(settings.session));

  // 正常请求的日志
  app.use(expressWinston.logger({
    transports: [
      new(winston.transports.Console)({
        json: true,
        colorize: true
      }),
      new winston.transports.File({
        filename: './logs/success.log'
      })
    ]
  }));

  // 跨域设置
  app.all('*', function(req, res, next) {
    res.header("Access-Control-Allow-Credentials", true)
    res.header("Access-Control-Allow-Origin", "*")
    res.header("Access-Control-Allow-Headers", "X-Requested-With")
    res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS")
    res.header("X-Powered-By", ' 3.2.1')
    res.header("Content-Type", "application/json;charset=utf-8")
    next()
  })

  app.use('/api', require('./api'));

  // 错误请求的日志
  app.use(expressWinston.errorLogger({
    transports: [
      new winston.transports.Console({
        json: true,
        colorize: true
      }),
      new winston.transports.File({
        filename: './logs/error.log'
      })
    ]
  }));

  var server = app.listen(port, function() {
    console.log('info', '本地前台服务器启动，正在监听端口<' + port + '>...')
  })

}());