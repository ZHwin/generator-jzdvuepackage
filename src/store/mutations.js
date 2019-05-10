import * as types from './types.js'

const mutations = {
  [types.TOKEN]: (state, token) => {
    state.token = token
  },
  [types.ALLOWBACK]: (state, allowBack) => {
    state.allowBack = allowBack
  },
  [types.ROLENAME]: (state, roleName) => {
    state.roleName = roleName
  },
  [types.USERNAME]: (state, userName) => {
    state.userName = userName
  },
  [types.LOGINNAME]: (state, loginName) => {
    state.loginName = loginName
  },
  [types.JGMC]: (state, jgmc) => {
    state.jgmc = jgmc
  },
  [types.IDNO]: (state, idno) => {
    state.idno = idno
  },
  [types.HASGETINFO]: (state, hasGetInfo) => {
    state.hasGetInfo = hasGetInfo
  },
  [types.DETAILYPID]: (state, ypid) => {
    state.ypid = ypid
  }
}

export default mutations
