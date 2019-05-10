export default {
  name: 'DetailButton',
  mounted () {
    // 默认文字是详情 如果父页面有btnTxt则使用btnTxt作为文字
    if (this.params.context.componentParent.btnTxt) {
      this.buttonTxt = this.params.context.componentParent.btnTxt
    }
  },
  data () {
    return {
      buttonTxt: '详情'
    }
  },
  methods: {
    //  详情
    DetailRowData () {
      this.params.context.componentParent.detailPage(this.params.node)
    }
  }
}
