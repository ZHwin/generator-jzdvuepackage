import router from './router'
import store from './store'
import { getToken } from '@utils/auth'
import config from '@config'
import { setTitle } from '@utils/tools'
let allowBack = true

router.beforeEach((to, from, next) => {
  if (to.meta.requireAuth) {
    // 判断该路由是否需要登录权限
    if (getToken()) {
      // 通过vuex state获取当前的token是否存在
      store.dispatch('GetUserInfo')
      next()
    } else {
      next({
        path: '/login'
      })
    }
  } else {
    next()
    if (to.meta.allowBack !== undefined) {
      allowBack = to.meta.allowBack
    }
    if (!allowBack) {
      history.pushState(null, null, location.href)
    }
    store.dispatch('updateAppSetting', {
      //   updateAppSetting 只是store里面的一个action，用来改变store里的allowBack的值的，具体怎么改这个值 要根据各位的实际情况而定
      allowBack: allowBack
    })
  }
})

router.afterEach((to, from, next) => {
  setTitle(config.title)
  window.scrollTo(0, 0)
})
