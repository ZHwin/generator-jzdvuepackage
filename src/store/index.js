import Vue from 'vue'
import Vuex from 'vuex'
import mutations from './mutations.js'
import actions from './actions.js'
Vue.use(Vuex)
const state = {
  userName: '',
  loginName: '',
  userId: '',
  jgmc: '', // 警察单位
  idno: '', // 警察身份证号
  token: '',
  hasGetInfo: false,
  roleName: '',
  allowBack: true, // 此处增加一个allowBack
  ypid: ''
}

export default new Vuex.Store({
  state,
  mutations,
  actions
})
