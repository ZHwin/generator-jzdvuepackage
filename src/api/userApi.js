import request from '@/utils/request'
import { getRealPath } from '@utils/tools'
export default {
  /**
   *
   *登陆
   * @param {*} key
   * @param {*} id
   * @param {*} limit
   * @param {*} offset
   * @returns
   */
  login (userName, passWord) {
    const param = {
      username: userName,
      password: passWord
      // passwd: Base64.encode(passWord),
    }
    return request.post('/authenticate', param)
  },
  /**
   *获取用户相关信息
   *
   * @param {*} userId
   * @returns
   */
  getUserInfo () {
    return request.get('/account/account')
  },

  /**
   * 修改用户密码
   *
   * @param {*} userName 用户名
   * @param {*} passWord  用户密码
   * @param {*} phoneNumber 联系方式
   */
  updatePassword (userName, passWord, phoneNumber) {
    const param = {
      username: userName,
      password: passWord,
      lxfs: phoneNumber
    }
    return request.put('/account/updatePassword', param)
  },

  /**
   *pki登陆校验
   *
   */
  enterByPki () {
    return request.post(getRealPath + '/pki/pass')
  }
}
