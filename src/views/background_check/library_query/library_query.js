import { dictTransle } from '@utils/tools'

export default {
  name: 'LibraryQuery',
  /**
   *dom加载完成后
   *
   */
  async mounted () {
    // 获取字典
    this.dictData = await this.$api.dictApi.getDictData('BJSC_SCJG_QJCS')
    this.gridApi = this.gridOptions.api
    this.gridColumnApi = this.gridOptions.columnApi
  },
  /**
   *定义数据
   *
   * @returns
   */
  data () {
    return {
      gridApi: null,
      gridShow: false,
      agLoading: false,
      excelLoading: false,
      submitLoading: false,
      exportDivVisble: true,
      rwmcInpVal: '',
      rwmcInpValid: '',
      scph: '', // 用于储存审查批号
      currentPage: 1, // 页数
      taskDataTotal: '', // 总条数
      taskDataSize: 10, // grid列表每页展示数量 默认是10
      szmjInpVal: this.$store.state.userName, // 设置民警
      szmjsfzhInpVal: this.$store.state.idno, // 设置民警身份证号
      szdwInpVal: this.$store.state.jgmc, // 设置单位
      // dateModel: '',
      queryTime: '',
      columnDefs: [
        {
          headerName: '序号',
          field: 'ROW_ID',
          width: 100
          // valueGetter: params => params.node.rowIndex + 1
        },
        {
          headerName: '审查结论',
          field: 'scjgName',
          cellClassRules: {
            cellGreenColor: params => {
              return (
                params.value === '通过' ||
                params.value === '提前3个月出所' ||
                params.value === '提前5个月出所' ||
                params.value === '已出所'
              )
            },
            cellYellowColor: params => {
              return params.value === '身份存疑' || params.value === '证件有误'
            },
            cellRedColor: params => {
              return params.value === '不予通过'
            }
          }
        },
        {
          headerName: '研判依据',
          field: 'QJCSTYPE',
          width: 300
        },
        { headerName: '任务名称', field: 'RWMC' },
        { headerName: '姓名', field: 'XM' },
        {
          headerName: '身份证号',
          field: 'SFZH',
          cellClass: 'stringType',
          width: 250
        },
        {
          headerName: '操作',
          field: 'cz',
          cellClass: ['oprateCell'],
          cellRendererFramework: Vue.component('DetailButton')
        }
      ],
      rowData: [],
      gridOptions: {
        context: {
          componentParent: this
        },
        excelStyles: [
          {
            id: 'stringType',
            dataType: 'string'
          }
        ],
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
     *排除要打印的列的方法
     *
     * @param {*} excludeColId
     * @returns
     */
    getPrintColumns (excludeColId) {
      let allColumn = this.gridColumnApi.getAllColumns()
      excludeColId = excludeColId.replace(/\b/g, '"')
      let needColumn = alasql(
        `select * from ? where colId not in(${excludeColId})`,
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
     *导出Excel
     *
     */
    async onBtExport () {
      this.excelLoading = true
      let VueInstance = Vue.extend(Vue.component('ExportExcel'))
      let exportEx = new VueInstance()
      let exportDiv = this.$refs['exportdiv']
      exportEx.$mount(exportDiv)
      // 设置对应的columnDefs
      exportEx.$props.columnDefs = this.columnDefs
      // 请求全部数据
      let libraryQueryList = await this.$api.bgCheckApi.searchBatchCheck(
        '1',
        this.taskDataTotal,
        '02',
        this.scph
      )

      // 翻译审查结论
      await dictTransle(
        'BJSC_SCJG_QJCS',
        this.dictData,
        libraryQueryList.records,
        'SCJG',
        'scjgName'
      )
      exportEx.$props.rowData = libraryQueryList.records
      let ColumnParams = this.getPrintColumns('cz')
      exportEx.exportExcel(ColumnParams)
      this.excelLoading = false
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
      let libraryQueryList = await this.$api.bgCheckApi.searchBatchCheck(
        '1',
        this.taskDataSize,
        '02',
        this.scph
      )
      // 翻译审查结论
      await ('BJSC_SCJG_QJCS',
      this.dictData,
      libraryQueryList,
      'SCJG',
      'scjgName')
      await this.gridApi.setRowData(libraryQueryList.records)
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
      let libraryQueryList = await this.$api.bgCheckApi.searchBatchCheck(
        val,
        this.taskDataSize,
        '02',
        this.scph
      )
      // 翻译审查结论
      await dictTransle(
        'BJSC_SCJG_QJCS',
        this.dictData,
        libraryQueryList.records,
        'SCJG',
        'scjgName'
      )
      await this.gridApi.setRowData(libraryQueryList.records)
      this.gridApi.sizeColumnsToFit()
      this.agLoading = false
    },
    /**
     *上一页
     *
     * @param {*} val
     */
    async prevClick (val) {
      this.agLoading = true
      let libraryQueryList = await this.$api.bgCheckApi.searchBatchCheck(
        val,
        this.taskDataSize,
        '02',
        this.scph
      )
      // 翻译审查结论
      await dictTransle(
        'BJSC_SCJG_QJCS',
        this.dictData,
        libraryQueryList.records,
        'SCJG',
        'scjgName'
      )
      await this.gridApi.setRowData(libraryQueryList.records)
      this.gridApi.sizeColumnsToFit()
      this.agLoading = false
    },

    /**
     *下一页
     *
     * @param {*} val
     */
    async nextClick (val) {
      this.agLoading = true
      let libraryQueryList = await this.$api.bgCheckApi.searchBatchCheck(
        val,
        this.taskDataSize,
        '02',
        this.scph
      )
      // 翻译审查结论
      await dictTransle(
        'BJSC_SCJG_QJCS',
        this.dictData,
        libraryQueryList.records,
        'SCJG',
        'scjgName'
      )
      await this.gridApi.setRowData(libraryQueryList.records)
      this.gridApi.sizeColumnsToFit()
      this.agLoading = false
    },
    /**
     *全库查询提交
     *
     * @returns
     */
    async submitTask () {
      // 获取选中的id
      this.rwmcInpValid = this.$refs['taskName'].getLableValue()
      // 获取选中的name
      this.rwmcInpVal = this.$refs['taskName'].getLableName()

      if (!this.rwmcInpVal) {
        this.$message({
          message: '请选择任务名称！',
          type: 'warning'
        })
        return false
      } else if (!this.queryTime) {
        this.$message({
          message: '请选择强戒出所时间！',
          type: 'warning'
        })
        return false
      }

      let params = {
        rwmc: this.rwmcInpVal,
        scType: '02', // 01：安保，02：强戒出所
        qjcsCsrq: this.queryTime
      }

      // 让grid列表显示出来
      this.gridShow = true
      this.agLoading = true
      this.submitLoading = true

      let libraryList = await this.$api.bgCheckApi.libraryQuery(params)
      // 审查批号赋值给scph
      this.scph = libraryList.scph
      // 判断是否是保存成功状态
      if (libraryList.msg !== '保存成功！') {
        this.gridShow = false
        this.$message({
          message: libraryList.msg,
          type: 'error'
        })
        this.agLoading = false
        this.submitLoading = false
        return
      }
      // 让grid列表显示出来
      this.gridShow = true
      let libraryQueryList = await this.$api.bgCheckApi.searchBatchCheck(
        '1',
        '10',
        '02',
        this.scph
      )
      // 翻译审查结论
      await dictTransle(
        'BJSC_SCJG_QJCS',
        this.dictData,
        libraryQueryList.records,
        'SCJG',
        'scjgName'
      )
      await this.gridApi.setRowData(libraryQueryList.records)
      // 将总条数赋值给taskDataTotal
      this.taskDataTotal = libraryQueryList.total
      this.gridApi.sizeColumnsToFit()
      this.agLoading = false
      this.submitLoading = false

      this.$message({
        message: '提交成功',
        type: 'success'
      })
    },
    /**
     *重置方法
     *
     */
    resetTask (event) {
      // 清空任务名称的值
      this.rwmcInpVal = ''
      this.queryTime = ''
      this.$refs['taskName'].ClearInput()
      // 判断是否点击的重置按钮
      if (event !== undefined) {
        // 隐藏下面的grid列表
        this.gridShow = false
      }
    },
    /**
     *详情页面跳转
     *
     * @param {*} rowNode
     */
    detailPage (rowNode) {
      let rowDataZj = rowNode.data.ZJ
      // 跳转新页面
      let routeUrl = this.$router.resolve({
        path: '/review-detail'
        // query: { rowDataZj: rowDataZj }
      })
      // 储存需要使用的参数
      sessionStorage.setItem('rowDataZj', rowDataZj)
      window.open(routeUrl.href, '_blank')
    },
    /**
     *获取时间选择器里面时间
     *
     * @param {*} e
     */
    getChooseTime (e) {
      this.queryTime = e
    }
  }
}
