module.exports = {
  admin: {
    password: '123456'
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
