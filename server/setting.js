module.exports = {
  admin: {
    password: '90064d07434fd9548d566c95a382782d67447111bb80b00d1fb2017400e5c70a' // lanbaba
  },
  server: {
      port: 3000  //  本地服务端口
  },
  session: {
      secret:'unique-buddha2',  // 会话
      key: 'buddha2', //cookie
      cookie: {secure: false, maxAge: null},
      resave:true,
      saveUninitialized: true
  }
};
