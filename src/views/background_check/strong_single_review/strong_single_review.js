import { dictTransle } from '@utils/tools'

export default {
  name: 'StrongSingleReview',
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
      exportDivVisble: true,
      reviewPassVisible: false,
      nameInpVal: '',
      sfzhInpVal: '',
      rwmcInpVal: '',
      rwmcInpValid: '',
      gzdwInpVal: '',
      gzbmInpVal: '',
      gzgwInpVal: '',
      hjdxzInpVal: '',
      sjhmInpVal: '',
      rybhInpVal: '',
      szmjInpVal: this.$store.state.userName, // 设置民警
      szmjsfzhInpVal: this.$store.state.idno, // 设置民警身份证号
      szdwInpVal: this.$store.state.jgmc, // 设置单位
      // dateModel: '',
      queryTime: '',
      columnDefs: [
        {
          headerName: '序号',
          field: 'order',
          width: 100,
          valueGetter: params => params.node.rowIndex + 1
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
          field: 'qjcsType',
          width: 250
        },
        { headerName: '姓名', field: 'xm' },
        {
          headerName: '身份证号',
          field: 'sfzh',
          cellClass: 'stringType',
          width: 250
        },
        { headerName: '户籍地址', field: 'hjdxz' },
        { headerName: '任务名称', field: 'rwmc' },
        { headerName: '情况说明', field: 'rylbbj' },
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
     *导出Excel
     *
     */
    onBtExport () {
      let ColumnParams = this.getPrintColumns('cz')
      this.gridApi.exportDataAsExcel(ColumnParams)
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
      await this.gridApi.setRowData(taskbgCheckApi.records)
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
      console.log(taskbgCheckApi.records)
      await this.gridApi.setRowData(taskbgCheckApi.records)
      this.agLoading = false
    },
    /**
     *上一页
     *
     * @param {*} val
     */
    async prevClick (val) {
      this.agLoading = true
      let taskbgCheckApi = await this.$api.bgCheckApi.getAllTaskList(
        this.taskDataSize,
        val
      )
      await this.gridApi.setRowData(taskbgCheckApi.records)
      this.agLoading = false
    },

    /**
     *下一页
     *
     * @param {*} val
     */
    async nextClick (val) {
      this.agLoading = true
      let taskbgCheckApi = await this.$api.bgCheckApi.getAllTaskList(
        this.taskDataSize,
        val
      )
      await this.gridApi.setRowData(taskbgCheckApi.records)
      this.agLoading = false
    },
    /**
     *单人审查提交
     *
     * @returns
     */
    async submitTask () {
      // 验证身份证格式
      let reg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/
      // 获取选中的id
      this.rwmcInpValid = this.$refs['taskName'].getLableValue()
      // 获取选中的name
      this.rwmcInpVal = this.$refs['taskName'].getLableName()

      if (!this.sfzhInpVal || !this.rwmcInpVal) {
        this.$message({
          message: '请填写身份证号和任务名称！',
          type: 'warning'
        })
        return false
      } else if (!reg.test(this.sfzhInpVal)) {
        this.$message({
          message: '请输入正确的身份证号！',
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
        ckkzt: '',
        csrq: '',
        fwqip: '',
        gzbm: this.gzbmInpVal,
        gzdw: this.gzdwInpVal,
        gzgw: this.gzgwInpVal,
        hjdqh: '',
        hjdxz: this.hjdxzInpVal,
        mz: '',
        plzj: '',
        rksj: '',
        rwmc: this.rwmcInpVal,
        rylbbj: '',
        ryph: this.rybhInpVal,
        scType: '02', // 01：安保，02：强戒出所
        scdw: '',
        scdwjgdm: '',
        scjg: '',
        scph: '',
        scrsfzh: '',
        scrxm: '',
        scsj: '',
        sfhcck: '',
        sfzh: this.sfzhInpVal,
        sjhm: this.sjhmInpVal,
        xb: '',
        xm: this.nameInpVal,
        yxx: '',
        zj: '',
        qjcsCsrq: this.queryTime
      }

      let singleReviewList = []
      singleReviewList[0] = await this.$api.bgCheckApi.singleReviewData(params)
      // 翻译审查结论
      await dictTransle(
        'BJSC_SCJG_QJCS',
        this.dictData,
        singleReviewList,
        'scjg',
        'scjgName'
      )

      // 判断是否是通过状态
      if (singleReviewList[0].scjg === '1') {
        this.gridShow = false
        this.reviewPassVisible = true
      } else {
        this.reviewPassVisible = false
        await this.gridApi.setRowData(singleReviewList)
        this.gridApi.sizeColumnsToFit()
        // 让grid列表显示出来
        this.gridShow = true
      }

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
      this.nameInpVal = ''
      this.sfzhInpVal = ''
      this.rwmcInpVal = ''
      this.gzdwInpVal = ''
      this.gzbmInpVal = ''
      this.gzgwInpVal = ''
      this.hjdxzInpVal = ''
      this.sjhmInpVal = ''
      this.rybhInpVal = ''
      this.queryTime = ''
      this.$refs['taskName'].ClearInput()
      // 判断是否点击的重置按钮
      if (event !== undefined) {
        // 隐藏审查通过的提示和下面的grid列表
        this.reviewPassVisible = false
        this.gridShow = false
      }
    },
    /**
     *详情页面跳转
     *
     * @param {*} rowNode
     */
    detailPage (rowNode) {
      let rowDataZj = rowNode.data.zj
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
