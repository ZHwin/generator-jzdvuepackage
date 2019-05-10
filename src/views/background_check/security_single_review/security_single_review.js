import { dictTransle } from '@utils/tools'

export default {
  name: 'SecuritySingleReview',
  /**
   *dom加载完成后
   *
   */
  async mounted () {
    // 获取字典
    this.dictData = await this.$api.dictApi.getDictData('BJSC_SCJG')

    this.gridApi = this.gridOptions.api
    this.gridColumnApi = this.gridOptions.columnApi

    let params = {
      current: 1, // 页码 默认第一页
      size: 10, // 每页展示数量 默认是10
      scType: '01'
    }

    let singleReviewDefaultList = await this.$api.bgCheckApi.singleReviewDefault(
      params
    )

    // 翻译审查结论
    await dictTransle(
      'BJSC_SCJG',
      this.dictData,
      singleReviewDefaultList.records,
      'scjg',
      'scjgName'
    )
    // console.log(singleReviewDefaultList)

    this.reviewPassVisible = false
    await this.gridApi.setRowData(singleReviewDefaultList.records)
    this.gridApi.sizeColumnsToFit()
    // 将总条数赋值给taskDataTotal
    this.taskDataTotal = singleReviewDefaultList.total
    this.gridPageShow = true
    // 让grid列表显示出来
    this.gridShow = true
  },
  /**
   *定义数据
   *
   * @returns
   */
  data () {
    return {
      gridApi: null,
      gridShow: true,
      gridPageShow: true,
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
        {
          headerName: '审查结论',
          field: 'scjgName',
          cellClassRules: {
            cellGreenColor: params => {
              return params.value === '通过'
            },
            cellYellowColor: params => {
              return params.value === '身份存疑' || params.value === '证件有误'
            },
            cellRedColor: params => {
              return params.value === '不予通过'
            }
          }
        },
        { headerName: '姓名', field: 'xm' },
        { headerName: '身份证号', field: 'sfzh', cellClass: 'stringType' },
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
          countQueryDetail.records,
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
      let params = {
        current: 1, // 页码 默认第一页
        size: this.taskDataSize, // 每页展示数量 默认是10
        scType: '01'
      }
      this.agLoading = true
      let singleReviewDefaultList = await this.$api.bgCheckApi.singleReviewDefault(
        params
      )
      // 翻译审查结论
      await dictTransle(
        'BJSC_SCJG',
        this.dictData,
        singleReviewDefaultList.records,
        'scjg',
        'scjgName'
      )
      this.reviewPassVisible = false
      await this.gridApi.setRowData(singleReviewDefaultList.records)
      this.gridApi.sizeColumnsToFit()
      // 将总条数赋值给taskDataTotal
      this.taskDataTotal = singleReviewDefaultList.total
      this.gridPageShow = true
      // 让grid列表显示出来
      this.gridShow = true
      this.agLoading = false
    },
    /**
     *
     *
     * @param {*} val
     */
    async handleCurrentChange (val) {
      this.gridOptions.api.paginationGoToPage(val - 1)

      let params = {
        current: val, // 页码 默认第一页
        size: this.taskDataSize, // 每页展示数量 默认是10
        scType: '01'
      }
      this.agLoading = true
      let singleReviewDefaultList = await this.$api.bgCheckApi.singleReviewDefault(
        params
      )
      // 翻译审查结论
      await dictTransle(
        'BJSC_SCJG',
        this.dictData,
        singleReviewDefaultList.records,
        'scjg',
        'scjgName'
      )
      this.reviewPassVisible = false
      await this.gridApi.setRowData(singleReviewDefaultList.records)
      this.gridApi.sizeColumnsToFit()
      // 将总条数赋值给taskDataTotal
      this.taskDataTotal = singleReviewDefaultList.total
      this.gridPageShow = true
      // 让grid列表显示出来
      this.gridShow = true
      this.agLoading = false
    },
    /**
     *上一页
     *
     * @param {*} val
     */
    async prevClick (val) {
      let params = {
        current: val, // 页码 默认第一页
        size: this.taskDataSize, // 每页展示数量 默认是10
        scType: '01'
      }
      this.agLoading = true
      let singleReviewDefaultList = await this.$api.bgCheckApi.singleReviewDefault(
        params
      )
      // 翻译审查结论
      await dictTransle(
        'BJSC_SCJG',
        this.dictData,
        singleReviewDefaultList.records,
        'scjg',
        'scjgName'
      )
      this.reviewPassVisible = false
      await this.gridApi.setRowData(singleReviewDefaultList.records)
      this.gridApi.sizeColumnsToFit()
      // 将总条数赋值给taskDataTotal
      this.taskDataTotal = singleReviewDefaultList.total
      this.gridPageShow = true
      // 让grid列表显示出来
      this.gridShow = true
      this.agLoading = false
    },

    /**
     *下一页
     *
     * @param {*} val
     */
    async nextClick (val) {
      let params = {
        current: val, // 页码 默认第一页
        size: this.taskDataSize, // 每页展示数量 默认是10
        scType: '01'
      }
      this.agLoading = true
      let singleReviewDefaultList = await this.$api.bgCheckApi.singleReviewDefault(
        params
      )
      // 翻译审查结论
      await dictTransle(
        'BJSC_SCJG',
        this.dictData,
        singleReviewDefaultList.records,
        'scjg',
        'scjgName'
      )
      this.reviewPassVisible = false
      await this.gridApi.setRowData(singleReviewDefaultList.records)
      this.gridApi.sizeColumnsToFit()
      // 将总条数赋值给taskDataTotal
      this.taskDataTotal = singleReviewDefaultList.total
      this.gridPageShow = true
      // 让grid列表显示出来
      this.gridShow = true
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
        qjcsType: '',
        rksj: '',
        rwmc: this.rwmcInpVal,
        rylbbj: '',
        ryph: this.rybhInpVal,
        scType: '01',
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
        zj: ''
      }

      // 隐藏翻页
      this.gridPageShow = false

      let singleReviewList = []
      this.$loading.show()
      singleReviewList[0] = await this.$api.bgCheckApi.singleReviewData(params)
      // 翻译审查结论
      await dictTransle(
        'BJSC_SCJG',
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
      this.$loading.hide()
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
     *详情页面跳转
     *
     * @param {*} rowNode
     */
    detailPage (rowNode) {
      let rowDataZj = rowNode.data.zj
      // 跳转新页面
      let routeUrl = this.$router.resolve({
        path: '/review-Detail'
        // query: { rowDataZj: rowDataZj }
      })
      // 储存需要使用的参数
      sessionStorage.setItem('rowDataZj', rowDataZj)
      window.open(routeUrl.href, '_blank')
    }
  }
}
