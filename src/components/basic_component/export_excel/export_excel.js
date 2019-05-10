export default {
  name: 'ExportExcel',
  props: ['columnDefs', 'rowData'],
  data () {},
  methods: {
    exportExcel (ColumnParams) {
      let aggrid = this.$refs['aggrid']
      let gridOptions = {
        columnDefs: this.columnDefs,
        rowData: this.rowData,
        excelStyles: [
          {
            id: 'stringType',
            dataType: 'string'
          }
        ]
      }
      new agGrid.Grid(aggrid, gridOptions)
      gridOptions.api.exportDataAsExcel(ColumnParams)
      $(aggrid).empty()
    }
  }
}
