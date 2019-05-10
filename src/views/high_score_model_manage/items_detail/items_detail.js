import { dictTransle } from '@utils/tools'

export default {
  name: 'ItemsDetail',
  /**
   *dom加载完成后
   *
   */
  async mounted () {
    this.agLoading = true
    // 获取单位tree字典
    this.dictData = await this.$api.dictApi.getDictData('XTXXLX,XXCLZT')
    this.unitData = await this.$api.dictApi.getDictTree('DWDM')

    this.gridApi = this.gridOptions.api
    this.gridColumnApi = this.gridOptions.columnApi

    let params = {
      current: 1, // 页码 默认第一页
      size: 10, // 每页展示数量 默认是10
      xxclzt: this.xxclztVal
    }

    let itemsDetailList = await this.$api.highScoreApi.pendingItems(params)

    // 翻译审查结论
    await dictTransle(
      'XTXXLX',
      this.dictData,
      itemsDetailList.records,
      'xxlx',
      'xxlxName'
    )
    await dictTransle(
      'XXCLZT',
      this.dictData,
      itemsDetailList.records,
      'xxclzt',
      'xxclztName'
    )
    // 如果是未处理状态 则隐藏操作人和操作时间列
    if (this.xxclztVal === '0') {
      this.columnDefs[7].hide = true
      this.columnDefs[8].hide = true
      this.msgColor = 'red'
    } else {
      this.columnDefs[7].hide = false
      this.columnDefs[8].hide = false
      this.msgColor = 'green'
    }

    this.gridApi.setColumnDefs(this.columnDefs)
    this.gridColumnApi.resetColumnState()
    await this.gridApi.setRowData(itemsDetailList.records)
    this.gridApi.sizeColumnsToFit()
    // 将总条数赋值给taskDataTotal
    this.taskDataTotal = itemsDetailList.total
    this.agLoading = false
  },
  /**
   *定义数据
   *
   * @returns
   */
  data () {
    return {
      dictData: '',
      queryTime: '',
      dateModel: [],
      xxbtInpVal: '',
      xxclztVal: '0',
      inputWidth: '80%',
      selectWidth: '220px',
      unitData: '',
      fsdwdmInpVal: '',
      msgColor: 'green',
      btnTxt: '办理',

      gridApi: null,
      agLoading: false,
      exportDivVisble: true,
      szmjInpVal: this.$store.state.userName, // 设置民警
      szmjsfzhInpVal: this.$store.state.idno, // 设置民警身份证号
      szdwInpVal: this.$store.state.jgmc, // 设置单位
      currentPage: 1,
      taskDataTotal: '', // 总条数
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
        // {
        //     headerName: "审查结论", field: "scjgName",
        //     cellClassRules: {
        //         'cellGreenColor': (params) => { return params.value === '通过' },
        //         'cellYellowColor': (params) => { return params.value === '身份存疑' || params.value === '证件有误'},
        //         'cellRedColor': (params) => { return params.value === '不予通过' }
        //     },
        // },
        { headerName: '消息标题', field: 'xxbt', width: 350 },
        {
          headerName: '消息处理状态',
          field: 'xxclztName',
          cellClassRules: {
            cellGreenColor: params => {
              return this.msgColor === 'green'
            },
            cellRedColor: params => {
              return this.msgColor === 'red'
            }
          }
        },
        { headerName: '消息类型', field: 'xxlxName', width: 250 },
        { headerName: '发送人', field: 'fsrxm', cellClass: 'stringType' },
        { headerName: '发送时间', field: 'fssj' },
        { headerName: '发送单位', field: 'fsdwmc' },
        { headerName: '操作人', field: 'czrxm', hide: false },
        { headerName: '操作时间', field: 'czsj', hide: false },
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
    getinputdata (data) {
      console.log(data)

      // data.background = {

      //  backgroundColor: 'yellow',

      //  border: 'none'

      // };
    },
    /**
     *获取要打印的列的方法
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
      if (this.gridPageShow === false) {
        let ColumnParams = this.getPrintColumns('cz')
        this.gridApi.exportDataAsExcel(ColumnParams)
      } else {
        let VueInstance = Vue.extend(Vue.component('ExportExcel'))
        let exportEx = new VueInstance()
        let exportDiv = this.$refs['exportdiv']
        exportEx.$mount(exportDiv)

        let countQueryDetail = ''

        // 获取参数值
        let params = {
          current: 1, // 页码 默认第一页
          size: 5000, // 每页展示数量 默认是10
          scType: '01'
        }
        //  获取所有列表数据
        countQueryDetail = await this.$api.bgCheckApi.singleReviewDefault(
          params
        )

        let ColumnParams
        this.agLoading = true
        this.gridOptions.columnDefs[0].valueGetter = params1 =>
          params1.node.rowIndex + 1
        exportEx.$props.columnDefs = this.gridOptions.columnDefs

        // 翻译审查结论
        await dictTransle(
          'BJSC_SCJG',
          this.dictData,
          countQueryDetail,
          'scjg',
          'scjgName'
        )
        // 排除不需要的列
        ColumnParams = this.getPrintColumns('cz')

        exportEx.$props.rowData = countQueryDetail.records
        exportEx.exportExcel(ColumnParams)
        this.agLoading = false
      }
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
      // 获取发送单位的单位代码
      this.fsdwdmInpVal = this.$refs['scdw'].getLableValue()

      let params = {
        current: 1, // 页码 默认第一页
        size: this.taskDataSize, // 每页展示数量 默认是10
        xxclzt: this.xxclztVal,
        xxbt: this.xxbtInpVal,
        fsdwdm: this.fsdwdmInpVal,
        fssjBegin: this.queryTime[0],
        fssjEnd: this.queryTime[1]
      }

      let itemsDetailList = await this.$api.highScoreApi.pendingItems(params)

      // 翻译审查结论
      await dictTransle(
        'XTXXLX',
        this.dictData,
        itemsDetailList.records,
        'xxlx',
        'xxlxName'
      )
      await dictTransle(
        'XXCLZT',
        this.dictData,
        itemsDetailList.records,
        'xxclzt',
        'xxclztName'
      )

      // 如果是未处理状态 则隐藏操作人和操作时间列
      if (this.xxclztVal === '0') {
        this.columnDefs[7].hide = true
        this.columnDefs[8].hide = true
        this.msgColor = 'red'
      } else {
        this.columnDefs[7].hide = false
        this.columnDefs[8].hide = false
        this.msgColor = 'green'
      }

      this.gridApi.setColumnDefs(this.columnDefs)
      this.gridColumnApi.resetColumnState()

      await this.gridApi.setRowData(itemsDetailList.records)
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
      // 获取发送单位的单位代码
      this.fsdwdmInpVal = this.$refs['scdw'].getLableValue()

      let params = {
        current: val, // 页码 默认第一页
        size: this.taskDataSize, // 每页展示数量 默认是10
        xxclzt: this.xxclztVal,
        xxbt: this.xxbtInpVal,
        fsdwdm: this.fsdwdmInpVal,
        fssjBegin: this.queryTime[0],
        fssjEnd: this.queryTime[1]
      }

      let itemsDetailList = await this.$api.highScoreApi.pendingItems(params)

      // 翻译审查结论
      await dictTransle(
        'XTXXLX',
        this.dictData,
        itemsDetailList.records,
        'xxlx',
        'xxlxName'
      )
      await dictTransle(
        'XXCLZT',
        this.dictData,
        itemsDetailList.records,
        'xxclzt',
        'xxclztName'
      )

      // 如果是未处理状态 则隐藏操作人和操作时间列
      if (this.xxclztVal === '0') {
        this.columnDefs[7].hide = true
        this.columnDefs[8].hide = true
        this.msgColor = 'red'
      } else {
        this.columnDefs[7].hide = false
        this.columnDefs[8].hide = false
        this.msgColor = 'green'
      }

      this.gridApi.setColumnDefs(this.columnDefs)
      this.gridColumnApi.resetColumnState()

      await this.gridApi.setRowData(itemsDetailList.records)
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
      // 获取发送单位的单位代码
      this.fsdwdmInpVal = this.$refs['scdw'].getLableValue()

      let params = {
        current: val, // 页码 默认第一页
        size: this.taskDataSize, // 每页展示数量 默认是10
        xxclzt: this.xxclztVal,
        xxbt: this.xxbtInpVal,
        fsdwdm: this.fsdwdmInpVal,
        fssjBegin: this.queryTime[0],
        fssjEnd: this.queryTime[1]
      }

      let itemsDetailList = await this.$api.highScoreApi.pendingItems(params)

      // 翻译审查结论
      await dictTransle(
        'XTXXLX',
        this.dictData,
        itemsDetailList.records,
        'xxlx',
        'xxlxName'
      )
      await dictTransle(
        'XXCLZT',
        this.dictData,
        itemsDetailList.records,
        'xxclzt',
        'xxclztName'
      )

      // 如果是未处理状态 则隐藏操作人和操作时间列
      if (this.xxclztVal === '0') {
        this.columnDefs[7].hide = true
        this.columnDefs[8].hide = true
        this.msgColor = 'red'
      } else {
        this.columnDefs[7].hide = false
        this.columnDefs[8].hide = false
        this.msgColor = 'green'
      }

      this.gridApi.setColumnDefs(this.columnDefs)
      this.gridColumnApi.resetColumnState()

      await this.gridApi.setRowData(itemsDetailList.records)
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
      // 获取发送单位的单位代码
      this.fsdwdmInpVal = this.$refs['scdw'].getLableValue()

      let params = {
        current: val, // 页码 默认第一页
        size: this.taskDataSize, // 每页展示数量 默认是10
        xxclzt: this.xxclztVal,
        xxbt: this.xxbtInpVal,
        fsdwdm: this.fsdwdmInpVal,
        fssjBegin: this.queryTime[0],
        fssjEnd: this.queryTime[1]
      }

      let itemsDetailList = await this.$api.highScoreApi.pendingItems(params)

      // 翻译审查结论
      await dictTransle(
        'XTXXLX',
        this.dictData,
        itemsDetailList.records,
        'xxlx',
        'xxlxName'
      )
      await dictTransle(
        'XXCLZT',
        this.dictData,
        itemsDetailList.records,
        'xxclzt',
        'xxclztName'
      )

      // 如果是未处理状态 则隐藏操作人和操作时间列
      if (this.xxclztVal === '0') {
        this.columnDefs[7].hide = true
        this.columnDefs[8].hide = true
        this.msgColor = 'red'
      } else {
        this.columnDefs[7].hide = false
        this.columnDefs[8].hide = false
        this.msgColor = 'green'
      }

      this.gridApi.setColumnDefs(this.columnDefs)
      this.gridColumnApi.resetColumnState()

      await this.gridApi.setRowData(itemsDetailList.records)
      this.gridApi.sizeColumnsToFit()
      this.agLoading = false
    },
    /**
     *待办查询
     *
     * @returns
     */
    async submitTask () {
      this.agLoading = true
      // 获取发送单位的单位代码
      this.fsdwdmInpVal = this.$refs['scdw'].getLableValue()
      this.currentPage = 1
      this.taskDataSize = 10

      let params = {
        current: this.currentPage, // 页码 默认第一页
        size: this.taskDataSize, // 每页展示数量 默认是10
        xxclzt: this.xxclztVal,
        xxbt: this.xxbtInpVal,
        fsdwdm: this.fsdwdmInpVal,
        fssjBegin: this.queryTime[0],
        fssjEnd: this.queryTime[1]
      }
      let itemsDetailList = await this.$api.highScoreApi.pendingItems(params)

      // 翻译审查结论
      await dictTransle(
        'XTXXLX',
        this.dictData,
        itemsDetailList.records,
        'xxlx',
        'xxlxName'
      )
      await dictTransle(
        'XXCLZT',
        this.dictData,
        itemsDetailList.records,
        'xxclzt',
        'xxclztName'
      )

      // 如果是未处理状态 则隐藏操作人和操作时间列
      if (this.xxclztVal === '0') {
        this.columnDefs[7].hide = true
        this.columnDefs[8].hide = true
        this.msgColor = 'red'
      } else {
        this.columnDefs[7].hide = false
        this.columnDefs[8].hide = false
        this.msgColor = 'green'
      }

      this.gridApi.setColumnDefs(this.columnDefs)
      this.gridColumnApi.resetColumnState()

      await this.gridApi.setRowData(itemsDetailList.records)
      this.gridApi.sizeColumnsToFit()
      // 将总条数赋值给taskDataTotal
      this.taskDataTotal = itemsDetailList.total
      this.agLoading = false

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
      this.$refs['taskName'].ClearInput()
      // 判断是否点击的重置按钮
      if (event !== undefined) {
        // 隐藏审查通过的提示和下面的grid列表
        this.reviewPassVisible = false
        this.gridShow = false
      }
    },
    /**
     *获取时间选择器里面时间
     *
     * @param {*} e
     */
    getChooseTime (e) {
      this.queryTime = e
    },
    /**
     *办理页面跳转
     *
     * @param {*} rowNode
     */
    detailPage (rowNode) {
      // 判断消息类型 xxlx 如果等于010100、010101、010102、010103,则跳转研判页面
      if (
        rowNode.data.xxlx === '010100' ||
        rowNode.data.xxlx === '010101' ||
        rowNode.data.xxlx === '010102' ||
        rowNode.data.xxlx === '010103'
      ) {
        let rowDataGlid = JSON.parse(rowNode.data.xxurl).glid
        // 跳转新页面
        let routeUrl = this.$router.resolve({
          path: '/research-judgment-detail'
        })
        // 储存需要使用的参数
        sessionStorage.setItem('ypId', rowDataGlid)
        window.open(routeUrl.href, '_blank')
      }
    }
  }
}
