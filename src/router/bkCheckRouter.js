export default [
  // 背景审查导航路由
  {
    path: '/background-check-mian',
    redirect: { name: 'SecuritySingleReview' },
    name: 'BackgroundCheckMian',
    component: resolve =>
      require(['@views/background_check/background_check_mian'], resolve),
    meta: {
      requireAuth: true // 添加该字段，表示进入这个路由是需要登录的
    },
    children: [
      {
        path: 'strong-single-review',
        name: 'StrongSingleReview',
        component: resolve =>
          require(['@views/background_check/strong_single_review'], resolve),
        meta: {
          requireAuth: true, // 添加该字段，表示进入这个路由是需要登录的
          allowBack: false // 禁用浏览器后退
        }
      },
      {
        path: 'strong-batch-review',
        name: 'StrongBatchReview',
        component: resolve =>
          require(['@views/background_check/strong_batch_review'], resolve),
        meta: {
          requireAuth: true, // 添加该字段，表示进入这个路由是需要登录的
          allowBack: false // 禁用浏览器后退
        }
      },
      {
        path: 'security-single-review',
        name: 'SecuritySingleReview',
        component: resolve =>
          require(['@views/background_check/security_single_review'], resolve),
        meta: {
          requireAuth: true, // 添加该字段，表示进入这个路由是需要登录的
          allowBack: false // 禁用浏览器后退
        }
      },
      {
        path: 'security-batch-review',
        name: 'SecurityBatchReview',
        component: resolve =>
          require(['@views/background_check/security_batch_review'], resolve),
        meta: {
          requireAuth: true, // 添加该字段，表示进入这个路由是需要登录的
          allowBack: false // 禁用浏览器后退
        }
      },
      {
        path: 'statistical-query',
        name: 'StatisticalQuery',
        component: resolve =>
          require(['@views/background_check/statistical_query'], resolve),
        meta: {
          requireAuth: true, // 添加该字段，表示进入这个路由是需要登录的
          allowBack: false // 禁用浏览器后退
        }
      },
      {
        path: 'task-setting',
        name: 'TaskSetting',
        component: resolve =>
          require(['@views/background_check/task_setting'], resolve),
        meta: {
          requireAuth: true, // 添加该字段，表示进入这个路由是需要登录的
          allowBack: false // 禁用浏览器后退
        }
      },
      {
        path: 'batch-browsing-query',
        name: 'BatchBrowsingQuery',
        component: resolve =>
          require(['@views/background_check/batch_browsing_query'], resolve),
        meta: {
          requireAuth: true, // 添加该字段，表示进入这个路由是需要登录的
          allowBack: false // 禁用浏览器后退
        }
      },
      {
        path: 'library-query',
        name: 'LibraryQuery',
        component: resolve =>
          require(['@views/background_check/library_query'], resolve),
        meta: {
          requireAuth: true // 添加该字段，表示进入这个路由是需要登录的
        }
      },
      {
        path: 'picture-to-text',
        name: 'PictureToText',
        component: resolve =>
          require(['@views/background_check/picture_to_text'], resolve),
        meta: {
          requireAuth: true, // 添加该字段，表示进入这个路由是需要登录的
          allowBack: false // 禁用浏览器后退
        }
      }
    ]
  },

  {
    path: '/dict-manage',
    name: 'DictManage',
    component: resolve =>
      require(['@views/background_check/dict_manage'], resolve),
    meta: {
      requireAuth: true // 添加该字段，表示进入这个路由是需要登录的
    }
  },
  {
    path: '/user-setting',
    name: 'UserSetting',
    component: resolve =>
      require(['@views/background_check/user_setting'], resolve),
    meta: {
      requireAuth: true // 添加该字段，表示进入这个路由是需要登录的
    }
  },
  {
    path: '/review-detail',
    name: 'ReviewDetail',
    component: resolve =>
      require(['@views/background_check/review_detail'], resolve),
    meta: {
      requireAuth: true // 添加该字段，表示进入这个路由是需要登录的
    }
  },
  {
    path: '/statistical-query-detail',
    name: 'StatisticalQueryDetail',
    component: resolve =>
      require(['@views/background_check/statistical_query_detail'], resolve),
    meta: {
      requireAuth: true // 添加该字段，表示进入这个路由是需要登录的
    }
  }
]
