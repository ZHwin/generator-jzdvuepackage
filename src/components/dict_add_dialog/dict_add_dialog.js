export default {
  name: 'DictAddDialog',
  data () {
    return {
      title: '',
      dialogVisible: false,
      formLabelWidth: '120px',
      name: '',
      dictId: '',
      dictName: '',
      remark: '',
      dictIdDisabled: false,
      selectMainDict: '',
      mainId: '',
      subCzddm: '',
      subCzb: '',
      mainCzddm: ''
    }
  },
  methods: {
    openDialog (name, node) {
      this.dialogVisible = true
      this.name = name
      console.log(name)
      console.log(node)
      switch (name) {
        case 'addMain':
          this.dictIdDisabled = false
          this.title = '新增'
          this.dictId = ''
          this.dictName = ''
          this.remark = ''
          break
        case 'editMain':
          this.dictIdDisabled = true
          this.title = '编辑'
          this.dictId = node.data.czddm
          this.dictName = node.data.czdmc
          this.remark = node.data.cbz
          break
        case 'addSub':
          this.dictIdDisabled = false
          this.title = '新增'
          this.dictId = ''
          this.dictName = ''
          this.remark = ''
          this.selectMainDict = node
          break
        case 'editSub':
          this.dictIdDisabled = true
          this.title = '修改'
          this.mainId = node.data.id
          this.dictId = node.data.cdm
          this.dictName = node.data.cmc
          this.remark = node.data.cbz
          this.mainCzddm = node.data.czddm
          break
        default:
          this.dictIdDisabled = false
          this.title = '添加'
          this.dictId = ''
          this.dictName = ''
          this.remark = ''
          this.subCzddm = node.data.czddm
          this.subCzb = node.data.cdm
          break
      }
    },
    async submit () {
      switch (this.name) {
        case 'addMain':
          let params = {
            czddm: this.dictId,
            czdmc: this.dictName,
            cbz: this.remark
          }
          // 请求增加主表接口
          let resData = await this.$api.bgCheckApi.addMainDictRow(params)
          if (resData.success) {
            this.dialogVisible = false
            // 通知外层刷新
            this.$emit('RefreshMainDict')
          } else {
            this.$message.error(resData.prompMessage)
          }
          break
        case 'editMain':
          let params1 = {
            czddm: this.dictId,
            czdmc: this.dictName,
            cbz: this.remark
          }
          let resData1 = await this.$api.bgCheckApi.editMainDictRow(params1)
          if (resData1.success) {
            this.dialogVisible = false
            // 通知外层刷新
            this.$emit('RefreshMainDict')
          } else {
            this.$message.error(resData1.prompMessage)
          }
          break
        case 'addSub':
          let params2 = {
            czddm: this.selectMainDict[0].czddm,
            cdm: this.dictId,
            cmc: this.dictName,
            cbz: this.remark
          }
          let resData2 = await this.$api.bgCheckApi.addDetailDictRow(params2)
          if (resData2.success) {
            this.dialogVisible = false
            // 通知外层刷新
            this.$emit('RefreshDetailDict')
          } else {
            this.$message.error(resData2.prompMessage)
          }
          break
        case 'editSub':
          let params3 = {
            czddm: this.mainCzddm,
            id: this.mainId,
            cdm: this.dictId,
            cmc: this.dictName,
            cbz: this.remark
          }
          let resData3 = await this.$api.bgCheckApi.editDetailDictRow(params3)
          if (resData3.success) {
            this.dialogVisible = false
            // 通知外层刷新
            this.$emit('RefreshDetailDict')
          } else {
            this.$message.error(resData3.prompMessage)
          }
          break
        default:
          let params4 = {
            czddm: this.subCzddm,
            csjdm: this.subCzb,
            cdm: this.dictId,
            cmc: this.dictName,
            cbz: this.remark
          }
          let resData4 = await this.$api.bgCheckApi.addDetailDictRow(params4)
          if (resData4.success) {
            this.dialogVisible = false
            // 通知外层刷新
            this.$emit('RefreshDetailDict')
          } else {
            this.$message.error(resData4.prompMessage)
          }
          break
      }
    }
  }
}
