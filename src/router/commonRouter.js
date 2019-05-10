export default [
  // 登陆
  {
    path: '/login',
    name: 'Login',
    component: resolve => require(['@views/login'], resolve),
    hidden: true
  },
  // 导航界面
  {
    path: '/',
    name: 'Navigation',
    component: resolve => require(['@views/navigation'], resolve),
    hidden: true,
    meta: {
      requireAuth: true // 添加该字段，表示进入这个路由是需要登录的
    }
  },

  {
    path: '/404',
    name: 'FourZeroFour',
    component: resolve => require(['@views/error_page/404_page'], resolve),
    hidden: true
  },

  { path: '*', redirect: '/404', name: 'FourZeroFour', hide: true }
]
