let url = {
  baseUrl: '', // 这里是一个基本请求的url
  pkiUrl: '' // 这里是pki登陆的url
}
switch (process.env.NODE_ENV) {
  case 'development':
    url.baseUrl = 'http://192.168.0.6:18081/zhjd/api' // 这里是本地的请求url
    url.pkiUrl = 'http://192.168.0.105:8889/zhjd/pki'
    break
  case 'alpha': // 注意这里的名字要和设置的环境名字对应起来
    url.baseUrl = 'http://192.168.0.6:18081/zhjd/api' // 这里是测试环境中的url
    url.pkiUrl = 'http://192.168.0.105:8889/zhjd/pki'
    break
  case 'production':
    url.baseUrl = 'http://192.168.0.6:18081/zhjd/api' // 生产环境url
    url.pkiUrl = 'http://192.168.0.105:8889/zhjd/pki'
    break
}

export default url
