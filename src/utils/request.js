// 引入axios
import axios from 'axios'
import { getToken } from '@utils/auth'
// 引入elment的错误弹框，方便提示后台错误
import { Message } from 'element-ui'
import url from '@config/setUrl'
const CancelToken = axios.CancelToken
// 请求拦截器
axios.interceptors.request.use(
  conf => {
    if (getToken()) {
      conf.headers['Authorization'] = 'Bearer ' + getToken() // 让每个请求携带自定义token 请根据实际情况自行修改
    }
    return conf
  },
  error => {
    return Promise.reject(error)
  }
)

// 响应拦截器即异常处理
axios.interceptors.response.use(
  response => {
    if (response.status === 200) {
      return response.data
    }
  },
  // 处理响应失败
  err => {
    if (err.response) {
      Message.error(err.response.data['状态'])
    } else {
      Message.error('连接服务器失败！')
    }

    return Promise.reject(err) // 返回接口返回的错误信息
  }
)

axios.defaults.baseURL = url.baseUrl
axios.defaults.withCredentials = true
axios.defaults.timeout = 60000

export default {
  // get请求
  get (url, param) {
    return new Promise((resolve, reject) => {
      axios({
        method: 'get',
        url,
        params: param,
        headers: {
          'Content-Type': 'application/json'
        },
        cancelToken: new CancelToken(c => {})
      })
        .then(res => {
          resolve(res)
        })
        .catch(error => {
          reject(error)
        })
    })
  },
  // 上传文件
  uploadFileRequest (url, param) {
    return new Promise((resolve, reject) => {
      axios({
        method: 'post',
        url,
        data: param,
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        cancelToken: new CancelToken(c => {})
      })
        .then(res => {
          resolve(res)
        })
        .catch(error => {
          reject(error)
        })
    })
  },
  // post请求
  post (url, param) {
    return new Promise((resolve, reject) => {
      axios({
        method: 'post',
        url,
        data: param,
        headers: {
          'Content-Type': 'application/json'
        },
        cancelToken: new CancelToken(c => {})
      })
        .then(res => {
          resolve(res)
        })
        .catch(error => {
          reject(error)
        })
    })
  },
  // delete请求
  delete (url, param) {
    return new Promise((resolve, reject) => {
      axios({
        method: 'delete',
        url,
        data: param,
        cancelToken: new CancelToken(c => {})
      })
        .then(res => {
          resolve(res)
        })
        .catch(error => {
          reject(error)
        })
    })
  },
  // put请求
  put (url, param) {
    return new Promise((resolve, reject) => {
      axios({
        method: 'put',
        url,
        data: param,
        headers: {
          'Content-Type': 'application/json'
        },
        cancelToken: new CancelToken(c => {})
      })
        .then(res => {
          resolve(res)
        })
        .catch(error => {
          reject(error)
        })
    })
  }
}
