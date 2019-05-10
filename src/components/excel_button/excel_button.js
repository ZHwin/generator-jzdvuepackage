export default {
  name: 'ExcelButton',
  mouted () {},
  data () {},
  methods: {
    //  导出EXCEL方法
    exportExcel () {
      this.params.context.componentParent.exportCurrentExcel(this.params.node)
    }
  }
}
