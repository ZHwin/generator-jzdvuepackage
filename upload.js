var main = require('./src/utils/ftpUpload')
main({
  host: 'hezbno1.gotoftp5.com', // 你的主机域名
  user: 'hezbno1', // ftp用户名
  password: 'he1335385', // ftp密码
  sourceDir: './dist', // 上传文件目录
  targetDir: 'wwwroot/test-ftp' // 服务端目标目录
})
