import { dictTransle } from '@utils/tools'
export default {
  name: 'StatisticalQueryDetail',
  /**
   *dom加载完成后
   *
   */
  async mounted () {
    // 获取带过来的参数
    let parameter = JSON.parse(sessionStorage.getItem('params'))

    let scjg = parameter.scjg
    let scdwjgdm = parameter.bsdw
    let rwmc = parameter.rwmc
    let tjsjBegin = parameter.tjsjBegin
    let tjsjEnd = parameter.tjsjEnd
    let scType = parameter.scType
    let scph = parameter.scph
    let countQueryDetail = ''
    let list = ''
    let params = {
      scjg: scjg,
      scdwjgdm: scdwjgdm,
      rwmc: rwmc,
      tjsjBegin: tjsjBegin,
      tjsjEnd: tjsjEnd,
      current: this.currentPage, // 页码 默认第一页
      size: this.taskDataSize, // 每页展示数量 默认是10
      scType: scType,
      scph: scph
    }
    //  获取所有列表数据
    // 分为两种 1.统计查询 双击列表数据进来的详情(不带任务名称参数) 2.批量浏览查询 双击列表数据进来的详情页面(会带任务名称)
    if (rwmc) {
      countQueryDetail = await this.$api.bgCheckApi.batchBrowsingQueryDetail(
        params
      )
    } else {
      countQueryDetail = await this.$api.bgCheckApi.countQueryDetail(params)
    }

    this.gridApi = this.gridOptions.api
    this.gridColumnApi = this.gridOptions.columnApi
    // 获取单位字典
    this.dictData = await this.$api.dictApi.getDictData(
      'BJSC_SCJG,BJSC_SCJG_QJCS,DM00011,DE00007'
    )

    this.agLoading = true
    console.log(countQueryDetail)
    // 是否安保
    if (scType === '01') {
      // 翻译安保的审查结论
      list = await dictTransle(
        'BJSC_SCJG',
        this.dictData,
        countQueryDetail.records,
        'scjg',
        'scjgName'
      )
      this.gridOptions.columnDefs[2].hide = false
      this.gridOptions.columnDefs[3].hide = true
    } else {
      // 翻译强戒的审查结论
      list = await dictTransle(
        'BJSC_SCJG_QJCS',
        this.dictData,
        countQueryDetail.records,
        'scjg',
        'scjgName'
      )
      this.gridOptions.columnDefs[2].hide = true
      this.gridOptions.columnDefs[3].hide = false
    }

    this.gridApi.setColumnDefs(this.gridOptions.columnDefs)

    this.gridColumnApi.resetColumnState()
    this.gridApi.setRowData(list)
    this.gridApi.sizeColumnsToFit()
    this.agLoading = false
    // 将总条数赋值给taskDataTotal
    this.taskDataTotal = countQueryDetail.total
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
      gridOptions: {
        context: {
          componentParent: this
        },
        rowData: [],
        // 安保的配置项
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
                return (
                  params.value === '通过' ||
                  params.value === '提前3个月出所' ||
                  params.value === '提前5个月出所' ||
                  params.value === '已出所'
                )
              },
              cellYellowColor: params => {
                return (
                  params.value === '身份存疑' || params.value === '证件有误'
                )
              },
              cellRedColor: params => {
                return params.value === '不予通过'
              }
            }
          },
          { headerName: '情况说明', field: 'rylbbj', width: 250, hide: false },
          {
            headerName: '研判依据',
            field: 'qjcsType',
            width: 250,
            hide: false
          },
          { headerName: '姓名', field: 'xm' },
          {
            headerName: '身份证号',
            field: 'sfzh',
            width: 250,
            cellClass: 'stringType'
          },
          { headerName: '户籍地址', field: 'hjdxz' },
          { headerName: '任务名称', field: 'rwmc' },
          {
            headerName: '操作',
            field: 'cz',
            cellClass: ['oprateCell'],
            cellRendererFramework: Vue.component('DetailButton')
          }
        ],
        defaultColDef: {
          resizable: true
        }
      }
    }
  },
  methods: {
    /**
     *获取要打印的列的方法
     *
     * @param {*} excludeColId /可以传一个逗号分隔的字符串'a,b,c,d'
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
     *导出excel
     *
     */
    async onBtExport () {
      let VueInstance = Vue.extend(Vue.component('ExportExcel'))
      let exportEx = new VueInstance()
      let exportDiv = this.$refs['exportdiv']
      exportEx.$mount(exportDiv)

      let countQueryDetail = ''
      let list = ''

      // 获取参数值
      let parameter = JSON.parse(sessionStorage.getItem('params'))
      let params = {
        current: 1, // 页码 默认第一页
        size: 5000, // 每页展示数量 默认是10
        scjg: parameter.scjg,
        scdwjgdm: parameter.bsdw,
        rwmc: parameter.rwmc,
        tjsjBegin: parameter.tjsjBegin,
        tjsjEnd: parameter.tjsjEnd,
        scType: parameter.scType,
        scph: parameter.scph
      }
      //  获取所有列表数据
      // 分为两种 1.统计查询 双击列表数据进来的详情(不带任务名称参数) 2.批量浏览查询 双击列表数据进来的详情页面(会带任务名称)
      if (parameter.rwmc) {
        countQueryDetail = await this.$api.bgCheckApi.batchBrowsingQueryDetail(
          params
        )
      } else {
        countQueryDetail = await this.$api.bgCheckApi.countQueryDetail(params)
      }

      let ColumnParams
      this.agLoading = true
      this.gridOptions.columnDefs[0].valueGetter = params1 =>
        params1.node.rowIndex + 1
      exportEx.$props.columnDefs = this.gridOptions.columnDefs
      // 是否安保
      if (parameter.scType === '01') {
        // 翻译安保的审查结论
        list = await dictTransle(
          'BJSC_SCJG',
          this.dictData,
          countQueryDetail.records,
          'scjg',
          'scjgName'
        )
        // 排除不需要的列
        ColumnParams = this.getPrintColumns('qjcsType,cz')
      } else {
        // 翻译强戒的审查结论
        list = await dictTransle(
          'BJSC_SCJG_QJCS',
          this.dictData,
          countQueryDetail.records,
          'scjg',
          'scjgName'
        )
        // 排除不需要的列
        ColumnParams = this.getPrintColumns('rylbbj,cz')
      }
      exportEx.$props.rowData = list
      exportEx.exportExcel(ColumnParams)
      this.agLoading = false
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
      // 获取参数值
      let parameter = JSON.parse(sessionStorage.getItem('params'))
      let params = {
        size: this.taskDataSize,
        current: 1,
        scjg: parameter.scjg,
        scdwjgdm: parameter.bsdw,
        rwmc: parameter.rwmc,
        tjsjBegin: parameter.tjsjBegin,
        tjsjEnd: parameter.tjsjEnd,
        scType: parameter.scType,
        scph: parameter.scph
      }
      let countQueryDetail = ''
      let list = ''
      // 分为两种 1.统计查询 双击列表数据进来的详情(不带任务名称参数) 2.批量浏览查询 双击列表数据进来的详情页面(会带任务名称)
      if (parameter.rwmc) {
        countQueryDetail = await this.$api.bgCheckApi.batchBrowsingQueryDetail(
          params
        )
      } else {
        countQueryDetail = await this.$api.bgCheckApi.countQueryDetail(params)
      }

      // 是否安保
      if (parameter.scType === '01') {
        // 翻译审查结论
        list = await dictTransle(
          'BJSC_SCJG',
          this.dictData,
          countQueryDetail.records,
          'scjg',
          'scjgName'
        )
      } else {
        // 翻译审查结论
        list = await dictTransle(
          'BJSC_SCJG_QJCS',
          this.dictData,
          countQueryDetail.records,
          'scjg',
          'scjgName'
        )
      }

      // let countQueryDetail = await this.$api.bgCheckApi.countQueryDetail(params);
      // let list = await dictTransle("BJSC_SCJG", this.dictData, countQueryDetail, "scjg", "scjgName")

      await this.gridApi.setRowData(list)
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
      // 获取参数值
      let parameter = JSON.parse(sessionStorage.getItem('params'))
      let params = {
        size: this.taskDataSize,
        current: val,
        scjg: parameter.scjg,
        scdwjgdm: parameter.bsdw,
        rwmc: parameter.rwmc,
        tjsjBegin: parameter.tjsjBegin,
        tjsjEnd: parameter.tjsjEnd,
        scType: parameter.scType,
        scph: parameter.scph
      }
      let countQueryDetail = ''
      let list = ''
      // 分为两种 1.统计查询 双击列表数据进来的详情(不带任务名称参数) 2.批量浏览查询 双击列表数据进来的详情页面(会带任务名称)
      if (parameter.rwmc) {
        countQueryDetail = await this.$api.bgCheckApi.batchBrowsingQueryDetail(
          params
        )
      } else {
        countQueryDetail = await this.$api.bgCheckApi.countQueryDetail(params)
      }

      // 是否安保
      if (parameter.scType === '01') {
        // 翻译审查结论
        list = await dictTransle(
          'BJSC_SCJG',
          this.dictData,
          countQueryDetail.records,
          'scjg',
          'scjgName'
        )
      } else {
        // 翻译审查结论
        list = await dictTransle(
          'BJSC_SCJG_QJCS',
          this.dictData,
          countQueryDetail.records,
          'scjg',
          'scjgName'
        )
      }

      // let countQueryDetail = await this.$api.bgCheckApi.countQueryDetail(params);
      // let list = await dictTransle("BJSC_SCJG", this.dictData, countQueryDetail, "scjg", "scjgName")

      await this.gridApi.setRowData(list)
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
      // 获取参数值
      let parameter = JSON.parse(sessionStorage.getItem('params'))
      let params = {
        size: this.taskDataSize,
        current: val,
        scjg: parameter.scjg,
        scdwjgdm: parameter.bsdw,
        rwmc: parameter.rwmc,
        tjsjBegin: parameter.tjsjBegin,
        tjsjEnd: parameter.tjsjEnd,
        scType: parameter.scType,
        scph: parameter.scph
      }
      let countQueryDetail = ''
      let list = ''
      // 分为两种 1.统计查询 双击列表数据进来的详情(不带任务名称参数) 2.批量浏览查询 双击列表数据进来的详情页面(会带任务名称)
      if (parameter.rwmc) {
        countQueryDetail = await this.$api.bgCheckApi.batchBrowsingQueryDetail(
          params
        )
      } else {
        countQueryDetail = await this.$api.bgCheckApi.countQueryDetail(params)
      }
      console.log(countQueryDetail)
      // 是否安保
      if (parameter.scType === '01') {
        // 翻译审查结论
        list = await dictTransle(
          'BJSC_SCJG',
          this.dictData,
          countQueryDetail.records,
          'scjg',
          'scjgName'
        )
      } else {
        // 翻译审查结论
        list = await dictTransle(
          'BJSC_SCJG_QJCS',
          this.dictData,
          countQueryDetail.records,
          'scjg',
          'scjgName'
        )
      }

      await this.gridApi.setRowData(list)
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
      // 获取参数值
      let parameter = JSON.parse(sessionStorage.getItem('params'))
      let params = {
        size: this.taskDataSize,
        current: val,
        scjg: parameter.scjg,
        scdwjgdm: parameter.bsdw,
        rwmc: parameter.rwmc,
        tjsjBegin: parameter.tjsjBegin,
        tjsjEnd: parameter.tjsjEnd,
        scType: parameter.scType,
        scph: parameter.scph
      }
      let countQueryDetail = ''
      let list = ''
      // 分为两种 1.统计查询 双击列表数据进来的详情(不带任务名称参数) 2.批量浏览查询 双击列表数据进来的详情页面(会带任务名称)
      if (parameter.rwmc) {
        console.log('有任务名称的')
        countQueryDetail = await this.$api.bgCheckApi.batchBrowsingQueryDetail(
          params
        )
      } else {
        console.log('没有任务名称的')
        countQueryDetail = await this.$api.bgCheckApi.countQueryDetail(params)
      }

      // 是否安保
      if (parameter.scType === '01') {
        // 翻译审查结论
        list = await dictTransle(
          'BJSC_SCJG',
          this.dictData,
          countQueryDetail.records,
          'scjg',
          'scjgName'
        )
      } else {
        // 翻译审查结论
        list = await dictTransle(
          'BJSC_SCJG_QJCS',
          this.dictData,
          countQueryDetail.records,
          'scjg',
          'scjgName'
        )
      }
      // let countQueryDetail = await this.$api.bgCheckApi.countQueryDetail(params);
      // let list = await dictTransle("BJSC_SCJG", this.dictData, countQueryDetail, "scjg", "scjgName")

      await this.gridApi.setRowData(list)
      this.gridApi.sizeColumnsToFit()
      this.agLoading = false
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
     *详情页面跳转
     *
     * @param {*} rowNode
     */
    detailPage (rowNode) {
      let rowDataZj = rowNode.data.zj
      // 跳转新页面
      let routeUrl = this.$router.resolve({
        path: '/review-Detail',
        name: 'ReviewDetail'
        // query: { rowDataZj: rowDataZj }
      })
      // 储存需要使用的参数
      sessionStorage.setItem('rowDataZj', rowDataZj)
      window.open(routeUrl.href, '_blank')
    }
  }
}
