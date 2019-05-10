export default {
  name: 'HighScoreModelManageMain',
  mounted () {
    this.$router.push({ name: 'ScoreModelHomePage' })
    // 左侧导航栏为了方便增加hover的样式 添加的一个类名 is-hover
    $('.el-menu-item').hover(
      function () {
        $(this).addClass('is-hover')
      },
      function () {
        $(this).removeClass('is-hover')
      }
    )
  },
  data () {
    return {
      defaultRoute: 'score-model-home-page'
    }
  }
}
