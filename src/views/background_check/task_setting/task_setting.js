import { dictTransle } from '@utils/tools'
import DelButton from '@components/del_button'
export default {
  name: 'TaskSetting',
  components: {
    'del-button': DelButton
  },
  /**
   *dom加载完成后
   *
   */
  async mounted () {
    // 获取单位字典
    this.dictData = await this.$api.dictApi.getDictData('DWDM')
    this.gridApi = this.gridOptions.api
    this.gridColumnApi = this.gridOptions.columnApi
    //  获取所有任务列表数据
    this.agLoading = true
    let taskbgCheckApi = await this.$api.bgCheckApi.getAllTaskList(10, 1)

    // 翻译单位字典
    let list = await dictTransle(
      'DWDM',
      this.dictData,
      taskbgCheckApi.records,
      'szrjgdm',
      'szrjgdmName'
    )

    this.gridApi.setRowData(list)
    this.gridApi.sizeColumnsToFit()
    this.agLoading = false
    // 将总条数赋值给taskDataTotal
    this.taskDataTotal = taskbgCheckApi.total
  },
  /**
   *定义数据
   *
   * @returns
   */
  data () {
    return {
      dictData: '',
      gridApi: null,
      agLoading: false,
      exportDivVisble: true,
      currentPage: 1,
      rwmcInpVal: '', // 任务名称
      szmjInpVal: this.$store.state.userName, // 设置民警
      szmjsfzhInpVal: this.$store.state.idno, // 设置民警身份证号
      szdwInpVal: this.$store.state.jgmc, // 设置单位
      taskDataTotal: '', // 任务总条数
      taskDataSize: 10, // grid列表每页展示数量 默认是10
      columnDefs: [
        {
          headerName: '序号',
          field: 'order',
          width: 100,
          valueGetter: params =>
            (this.currentPage - 1) * this.taskDataSize +
            params.node.rowIndex +
            1
        },
        { headerName: '任务名称', field: 'rwmc' },
        { headerName: '设置民警', field: 'szr', tooltipField: 'xsxq' },
        {
          headerName: '设置民警身份证号',
          field: 'szrsfzh',
          cellClass: 'stringType'
        },
        { headerName: '设置单位', field: 'szrjgdmName' },
        { headerName: '设置时间', field: 'szsj', valueGetter: this.formatTime },
        {
          headerName: '操作',
          field: 'cz',
          cellClass: ['oprateCell'],
          cellRendererFramework: 'del-button'
        }
      ],
      rowData: [],
      gridOptions: {
        context: {
          componentParent: this
        },
        enableBrowserTooltips: true,
        defaultColDef: {
          editable: false,
          enableValue: false,
          sortable: false,
          resizable: true,
          filter: false
        },
        suppressPaginationPanel: true,
        getMainMenuItems: false
      }
    }
  },
  methods: {
    /**
     *获取要打印的列的方法
     *
     * @param {*} excludeColId
     * @returns
     */
    getPrintColumns (excludeColId) {
      let allColumn = this.gridColumnApi.getAllColumns()
      let needColumn = alasql(
        `select colId from ? where colId !='${excludeColId}'`,
        [allColumn]
      )
      let needColumnArr = []
      for (let item of needColumn) {
        needColumnArr.push(item.colId)
      }
      return {
        fileName: 'Excel',
        columnKeys: needColumnArr
      }
    },
    /**
     *导出excel
     *
     */
    async onBtExport () {
      let VueInstance = Vue.extend(Vue.component('ExportExcel'))
      let exportEx = new VueInstance()
      let exportDiv = this.$refs['exportdiv']
      exportEx.$mount(exportDiv)
      exportEx.$props.columnDefs = this.columnDefs
      // 请求全部数据
      let taskList = await this.$api.bgCheckApi.getAllTaskList(5000, 1)
      let list = await dictTransle(
        'DWDM',
        this.dictData,
        taskList.records,
        'szrjgdm',
        'szrjgdmName'
      )
      exportEx.$props.rowData = list

      let ColumnParams = this.getPrintColumns('cz')
      exportEx.exportExcel(ColumnParams)
    },
    /**
     *格式化时间
     *
     * @param {*} params
     * @returns
     */
    formatTime (params) {
      if (params.data.szsj) {
        return params.data.szsj.replace(/T/g, ' ')
      }
    },
    /**
     *el 分页的方法
     *
     * @param {*} val
     */
    async handleSizeChange (val) {
      // 每页展示数量发生改变时赋值给taskDataSize
      this.taskDataSize = val
      this.agLoading = true
      let taskbgCheckApi = await this.$api.bgCheckApi.getAllTaskList(
        this.taskDataSize,
        1
      )
      let list = await dictTransle(
        'DWDM',
        this.dictData,
        taskbgCheckApi.records,
        'szrjgdm',
        'szrjgdmName'
      )

      this.gridApi.setRowData(list)
      this.gridApi.sizeColumnsToFit()

      this.agLoading = false
    },
    /**
     *
     *
     * @param {*} val
     */
    async handleCurrentChange (val) {
      this.gridOptions.api.paginationGoToPage(val - 1)

      this.agLoading = true
      let taskbgCheckApi = await this.$api.bgCheckApi.getAllTaskList(
        this.taskDataSize,
        val
      )
      let list = await dictTransle(
        'DWDM',
        this.dictData,
        taskbgCheckApi.records,
        'szrjgdm',
        'szrjgdmName'
      )

      this.gridApi.setRowData(list)
      this.gridApi.sizeColumnsToFit()

      this.agLoading = false
    },
    /**
     *上一页
     *
     * @param {*} val
     */
    async prevClick (val) {
      this.currentPage = val
      this.agLoading = true
      let taskbgCheckApi = await this.$api.bgCheckApi.getAllTaskList(
        this.taskDataSize,
        val
      )
      let list = await dictTransle(
        'DWDM',
        this.dictData,
        taskbgCheckApi.records,
        'szrjgdm',
        'szrjgdmName'
      )

      this.gridApi.setRowData(list)
      this.gridApi.sizeColumnsToFit()

      this.agLoading = false
    },
    /**
     *下一页
     *
     * @param {*} val
     */
    async nextClick (val) {
      this.currentPage = val
      this.agLoading = true
      let taskbgCheckApi = await this.$api.bgCheckApi.getAllTaskList(
        this.taskDataSize,
        val
      )
      let list = await dictTransle(
        'DWDM',
        this.dictData,
        taskbgCheckApi.records,
        'szrjgdm',
        'szrjgdmName'
      )

      this.gridApi.setRowData(list)
      this.gridApi.sizeColumnsToFit()

      this.agLoading = false
    },
    /**
     *新增任务
     *
     * @returns
     */
    async submitTask () {
      if (!this.rwmcInpVal) {
        this.$message({
          message: '请填写任务名称！',
          type: 'warning'
        })
        return false
      }
      this.agLoading = true
      let tbBjscRwmc = {
        rwmc: this.rwmcInpVal
      }
      await this.$api.bgCheckApi.addNewTask(tbBjscRwmc)

      let taskbgCheckApi = await this.$api.bgCheckApi.getAllTaskList(10, 1)
      let list = await dictTransle(
        'DWDM',
        this.dictData,
        taskbgCheckApi.records,
        'szrjgdm',
        'szrjgdmName'
      )

      this.gridApi.setRowData(list)
      console.log(list)
      this.gridApi.sizeColumnsToFit()

      this.agLoading = false
      // 将总条数赋值给taskDataTotal
      this.taskDataTotal = taskbgCheckApi.total
      this.$message({
        message: '提交成功',
        type: 'success'
      })
      this.resetTask()
    },
    /**
     *重置方法
     *
     */
    resetTask () {
      // 清空任务名称的值
      this.rwmcInpVal = ''
    },
    /**
     *删除当前行数据
     *
     * @param {*} rowNode
     */
    delCurrentData (rowNode) {
      let rowDataId = rowNode.data.id
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          this.agLoading = true
          // 删除当前行数据
          await this.$api.bgCheckApi.deleteListData(rowDataId)

          let taskbgCheckApi = await this.$api.bgCheckApi.getAllTaskList(10, 1)
          let list = await dictTransle(
            'DWDM',
            this.dictData,
            taskbgCheckApi.records,
            'szrjgdm',
            'szrjgdmName'
          )

          this.gridApi.setRowData(list)
          this.gridApi.sizeColumnsToFit()

          // 将总条数赋值给taskDataTotal
          this.taskDataTotal = taskbgCheckApi.total
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
          this.agLoading = false
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    }
  }
}
