import Vue from 'vue'
import Router from 'vue-router'
import commonRouter from './commonRouter'
import bkCheckRouter from './bkCheckRouter'
import highScoreRouter from './highScoreRouter'
Vue.use(Router)
export default new Router({
  mode: 'history',
  routes: [
    ...commonRouter, // 登陆路由
    ...bkCheckRouter, // 背景审查路由
    ...highScoreRouter // 高危积分路由
  ]
})
