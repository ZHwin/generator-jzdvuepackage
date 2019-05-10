import valRule from '@utils/validate'
export default {
  name: 'ResearchJudgmentDialog',
  data () {
    return {
      dialogVisible: false,
      formLabelWidth: '120px',
      fkrxm: '',
      fkdw: '',
      name: '',
      nodedata: '',
      title: '',
      unitData: '',
      inputWidth: '80%',
      selectWidth: '240px',
      sPStatus: 0, // 审批状态
      SingTime: '',
      singContent: '',
      feedBackContent: '',
      approvalContent: ''
    }
  },
  async mounted () {
    this.unitData = await this.$api.dictApi.getDictTree('DWDM')
  },
  methods: {
    openDialog (name, nodedata) {
      this.dialogVisible = true
      this.name = name
      this.nodedata = nodedata
      switch (name) {
        case 'approval':
          this.title = '审批'
          break
        case 'launch':
          this.title = '发起'
          break
        default:
          this.title = '反馈'
          this.fkrxm = nodedata.data.fqrxm
          this.fkdw = nodedata.data.fqdwmc
          break
      }
    },
    async submit () {
      switch (this.name) {
        case 'launch':
          if (valRule.isNull(this.$refs.unitref.getLableValue())) {
            this.$message({
              message: '请选择接受单位！',
              type: 'warning'
            })
            return false
          }
          if (valRule.isNull(this.SingTime)) {
            this.$message({
              message: '请选择要求签收时间！',
              type: 'warning'
            })
            return false
          }
          if (valRule.isNull(this.singContent)) {
            this.$message({
              message: '请填写发起内容！',
              type: 'warning'
            })
            return false
          }

          let resData = await this.$api.highScoreApi.launchHightSorceProcess(
            this.nodedata.id,
            this.$refs.unitref.getLableValue(),
            this.$refs.unitref.getLableName(),
            this.SingTime,
            this.singContent
          )
          if (resData.success) {
            // 关闭弹框
            this.dialogVisible = false
            this.$message({
              message: '发起成功！',
              type: 'success'
            })
            // 刷新表格
            this.$emit('refreshLCAglist')
          }
          break
        case 'feedBack':
          if (valRule.isNull(this.feedBackContent)) {
            this.$message({
              message: '请填写反馈内容！',
              type: 'warning'
            })
            return false
          }
          let resData1 = await this.$api.highScoreApi.feedBackHightSorceProcess(
            this.nodedata.data.jlbh,
            this.feedBackContent
          )
          if (resData1.success) {
            // 关闭弹框
            this.dialogVisible = false
            this.$message({
              message: resData1.prompMessage,
              type: 'success'
            })
            // 刷新表格
            this.$emit('refreshLCAglist')
          }
          break

        case 'approval':
          if (valRule.isNull(this.approvalContent)) {
            this.$message({
              message: '请填写审批意见！',
              type: 'warning'
            })
            return false
          }
          let resData2 = await this.$api.highScoreApi.approvalHightSorceProcess(
            this.nodedata.data.jlbh,
            this.approvalContent,
            this.sPStatus
          )
          if (resData2.success) {
            // 关闭弹框
            this.dialogVisible = false
            this.$message({
              message: resData2.prompMessage,
              type: 'success'
            })
            // 刷新表格
            this.$emit('refreshLCAglist')
          }
      }
    },
    SingTimeChange (e) {
      this.SingTime = e
    }
  }
}
