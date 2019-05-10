export default {
  name: 'Navigation',
  async mounted () {
    this.pendingNum = await this.$api.highScoreApi.getPendingNum()
  },
  data () {
    return {
      searchVal: '',
      num: 8,
      pendingNum: '' // 待办消息数
    }
  },
  methods: {
    /**
     *待办消息详情页面
     *
     * @param {*} item
     */
    itemsDetail () {
      let routeUrl = this.$router.resolve({
        path: '/items-detail'
      })
      window.open(routeUrl.href, '_blank')
    }
  }
}
