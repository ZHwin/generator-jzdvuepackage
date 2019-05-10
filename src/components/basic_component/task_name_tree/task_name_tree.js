export default {
  name: 'TaskNameTree',
  /**
   *dom加载完成后
   *
   */
  async mounted () {
    // 获取所有任务名称的数据 展示tree
    this.taskName = await this.$api.bgCheckApi.getAllTaskData()
    await this.taskName.forEach(function (value) {
      value.name = value.rwmc
    })
    this.rwmcData = this.taskName
  },
  /**
   *定义数据
   *
   * @returns
   */
  data () {
    return {
      inputWidth: '80%',
      selectWidth: '180px',
      rwmcData: ''
    }
  },
  methods: {
    getLableValue () {
      return this.$refs['publicTree'].getLableValue()
    },
    getLableName () {
      return this.$refs['publicTree'].getLableName()
    },
    ClearInput () {
      this.$refs['publicTree'].ClearInput()
    }
  }
}
