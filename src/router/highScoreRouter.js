export default [
  // 高危积分
  {
    path: '/high-score-model-manage-main',
    redirect: { name: 'ScoreModelHomePage' },
    name: 'HighScoreModelManageMain',
    component: resolve =>
      require([
        '@views/high_score_model_manage/high_score_model_manage_main'
      ], resolve),
    meta: {
      requireAuth: true // 添加该字段，表示进入这个路由是需要登录的
    },
    children: [
      {
        path: 'score-model-home-page',
        name: 'ScoreModelHomePage',
        component: resolve =>
          require([
            '@views/high_score_model_manage/score_model_home_page'
          ], resolve),
        meta: {
          requireAuth: true, // 添加该字段，表示进入这个路由是需要登录的
          allowBack: false // 禁用浏览器后退
        }
      },
      {
        path: 'score-model-inquire',
        name: 'ScoreModelInquire',
        component: resolve =>
          require([
            '@views/high_score_model_manage/score_model_inquire'
          ], resolve),
        meta: {
          requireAuth: true, // 添加该字段，表示进入这个路由是需要登录的
          allowBack: false // 禁用浏览器后退
        }
      }
    ]
  },
  {
    path: '/research-judgment-detail',
    name: 'ResearchJudgmentDetail',
    component: resolve =>
      require([
        '@views/high_score_model_manage/research_judgment_detail'
      ], resolve),
    meta: {
      requireAuth: true // 添加该字段，表示进入这个路由是需要登录的
    }
  },
  {
    path: '/items-detail',
    name: 'ItemsDetail',
    component: resolve =>
      require(['@views/high_score_model_manage/items_detail'], resolve),
    meta: {
      requireAuth: true // 添加该字段，表示进入这个路由是需要登录的
    }
  }
]
