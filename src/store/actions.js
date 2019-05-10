import * as types from './types'
import { setToken, removeToken } from '@utils/auth'
import api from '@api/apis'
export default {
  // 提交到mutations中处理
  async Login ({ commit }, { username, password }) {
    // 获取到登陆信息，调用登陆接口
    let userName = username.trim()
    let response = await api.userApi.login(userName, password)
    if (response.id_token) {
      commit(types.TOKEN, response.id_token)
      setToken(response.id_token)
    } else {
      commit(types.TOKEN, '')
      removeToken()
    }

    // 提交到mutations
    // 失败之后会进入响应拦截器
  },
  updateAppSetting ({ commit }, { allowBack }) {
    // 增加一个可以改变allowBack的方法
    commit(types.ALLOWBACK, allowBack)
  },

  // 登出
  async LogOut ({ state, commit }) {
    // 请求登出接口
    // await api.userApi.logout(state.token);
    // 将stroe中token置空
    await commit(types.TOKEN, '')
    removeToken()
  },

  // 获取用户相关信息
  async GetUserInfo ({ state, commit }) {
    let response = await api.userApi.getUserInfo()
    commit(types.ROLENAME, response.roleName)
    const data = response.account
    commit(types.USERNAME, data.xm)
    commit(types.LOGINNAME, data.username)
    commit(types.JGMC, data.jgmc)
    commit(types.IDNO, data.idno)
    commit(types.HASGETINFO, true)
    sessionStorage.setItem('loginUserRoles', JSON.stringify(response.roles))
  },
  SetHightYPId ({ commit }, ypid) {
    commit(types.DETAILYPID, ypid)
  }
}
