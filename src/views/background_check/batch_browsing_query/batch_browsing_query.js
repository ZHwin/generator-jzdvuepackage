import { dictTransle } from '@utils/tools'
import ExcelButton from '@components/excel_button'
// 引入验证规则
import valRule from '@utils/validate'

export default {
  name: 'StrongSingleReview',
  components: {
    'excel-button': ExcelButton
  },
  /**
   *dom加载完成后
   *
   */
  async mounted () {
    // 获取字典
    this.unitData = await this.$api.dictApi.getDictTree('DWDM')

    this.gridApi = this.gridOptions.api
    this.gridColumnApi = this.gridOptions.columnApi
    // this.gridApi.sizeColumnsToFit();
  },
  /**
   *定义数据
   *
   * @returns
   */
  data () {
    return {
      queryTime: '',
      dateModel: [],
      scmjVal: '',
      unitData: '',
      scpcInpVal: '',
      rwmcInpValId: '',
      rwmcInpVal: '',
      scdwInpValId: '',
      scmjInpVal: this.$store.state.userName, // 审查民警
      inputWidth: '80%',
      selectWidth: '220px',
      scType: '01',
      currentPage: 1,
      taskDataTotal: '', // 总条数
      taskDataSize: 10, // grid列表每页展示数量 默认是10
      gridApi: null,
      gridShow: false,
      agLoading: false,
      exportDivVisble: true,
      columnDefs: [
        {
          headerName: '序号',
          field: 'order',
          width: 100,
          headerClass: ['text-auto'],
          valueGetter: params =>
            (this.currentPage - 1) * this.taskDataSize +
            params.node.rowIndex +
            1
        },
        {
          headerName: '任务名称',
          field: 'RWMC',
          headerClass: ['text-auto'],
          cellClass: 'stringType'
        },
        {
          headerName: '审查类别名称',
          field: 'SCTYPENAME',
          headerClass: ['text-auto']
        },
        { headerName: '审查时间', field: 'SCSJ', headerClass: ['text-auto'] },
        {
          headerName: '安保禁毒',
          field: 'security',
          children: [
            {
              headerName: '通过数',
              field: 'AB_TG',
              headerClass: ['border-top']
            },
            {
              headerName: '证件有误',
              field: 'AB_ZJYW',
              headerClass: ['border-top']
            },
            {
              headerName: '身份存疑',
              field: 'AB_SFCY',
              headerClass: ['border-top']
            },
            {
              headerName: '不予通过',
              field: 'AB_BYTG',
              headerClass: ['border-top']
            }
          ]
        },
        {
          headerName: '操作',
          field: 'cz',
          cellClass: ['oprateCell'],
          cellRendererFramework: 'excel-button'
        }
      ],
      columnDefsTwoQj: [
        {
          headerName: '序号',
          field: 'order',
          width: 100,
          headerClass: ['text-auto'],
          valueGetter: params =>
            (this.currentPage - 1) * this.taskDataSize +
            params.node.rowIndex +
            1
        },
        {
          headerName: '任务名称',
          field: 'RWMC',
          headerClass: ['text-auto'],
          cellClass: 'stringType'
        },
        {
          headerName: '审查类别名称',
          field: 'SCTYPENAME',
          headerClass: ['text-auto']
        },
        { headerName: '审查时间', field: 'SCSJ', headerClass: ['text-auto'] },
        {
          headerName: '强戒出所',
          field: 'strong',
          hide: true,
          children: [
            {
              headerName: '提前五个月出所',
              field: 'QJCS_TQCSFIVE',
              headerClass: ['border-top']
            },
            {
              headerName: '提前三个月出所',
              field: 'QJCS_TQCSTHREE',
              headerClass: ['border-top']
            },
            {
              headerName: '证件有误',
              field: 'QJCS_ZJYW',
              headerClass: ['border-top']
            },
            {
              headerName: '不予通过',
              field: 'QJCS_BYTG',
              headerClass: ['border-top']
            },
            {
              headerName: '已出所',
              field: 'QJCS_YCS',
              headerClass: ['border-top']
            }
          ]
        },
        {
          headerName: '操作',
          field: 'cz',
          cellClass: ['oprateCell'],
          cellRendererFramework: 'excel-button'
        }
      ],
      // 查询结果列表导出EXCEL用的两个columnDefs
      columnDefsOne: [
        {
          headerName: '序号',
          field: 'order',
          width: 100,
          headerClass: ['text-auto'],
          valueGetter: params =>
            (this.currentPage - 1) * this.taskDataSize +
            params.node.rowIndex +
            1
        },
        {
          headerName: '任务名称',
          field: 'RWMC',
          headerClass: ['text-auto'],
          cellClass: 'stringType'
        },
        {
          headerName: '审查类别名称',
          field: 'SCTYPENAME',
          headerClass: ['text-auto']
        },
        { headerName: '审查时间', field: 'SCSJ', headerClass: ['text-auto'] },
        {
          headerName: '安保禁毒',
          field: 'security',
          children: [
            {
              headerName: '通过数',
              field: 'AB_TG',
              headerClass: ['border-top']
            },
            {
              headerName: '证件有误',
              field: 'AB_ZJYW',
              headerClass: ['border-top']
            },
            {
              headerName: '身份存疑',
              field: 'AB_SFCY',
              headerClass: ['border-top']
            },
            {
              headerName: '不予通过',
              field: 'AB_BYTG',
              headerClass: ['border-top']
            }
          ]
        }
      ],
      columnDefsTwo: [
        {
          headerName: '序号',
          field: 'order',
          width: 100,
          headerClass: ['text-auto'],
          valueGetter: params =>
            (this.currentPage - 1) * this.taskDataSize +
            params.node.rowIndex +
            1
        },
        {
          headerName: '任务名称',
          field: 'RWMC',
          headerClass: ['text-auto'],
          cellClass: 'stringType'
        },
        {
          headerName: '审查类别名称',
          field: 'SCTYPENAME',
          headerClass: ['text-auto']
        },
        { headerName: '审查时间', field: 'SCSJ', headerClass: ['text-auto'] },
        {
          headerName: '强戒出所',
          field: 'strong',
          hide: true,
          children: [
            {
              headerName: '提前五个月出所',
              field: 'QJCS_TQCSFIVE',
              headerClass: ['border-top']
            },
            {
              headerName: '提前三个月出所',
              field: 'QJCS_TQCSTHREE',
              headerClass: ['border-top']
            },
            {
              headerName: '证件有误',
              field: 'QJCS_ZJYW',
              headerClass: ['border-top']
            },
            {
              headerName: '不予通过',
              field: 'QJCS_BYTG',
              headerClass: ['border-top']
            },
            {
              headerName: '已出所',
              field: 'QJCS_YCS',
              headerClass: ['border-top']
            }
          ]
        }
      ],
      // 列表中的导出Excel用的columnDefs
      columnDefsRow: [
        {
          headerName: '序号',
          field: 'order',
          width: 100,
          valueGetter: params =>
            (this.currentPage - 1) * this.taskDataSize +
            params.node.rowIndex +
            1
        },
        { headerName: '姓名', field: 'xm' },
        { headerName: '身份证号', field: 'sfzh', cellClass: 'stringType' },
        { headerName: '户籍地址', field: 'hjdxz' },
        { headerName: '审查结论', field: 'scjgName' },
        { headerName: '任务名称', field: 'rwmc', cellClass: 'stringType' },
        { headerName: '情况说明', field: 'rylbbj' }
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
      let VueInstance = Vue.extend(Vue.component('ExportExcel'))
      let exportEx = new VueInstance()
      let exportDiv = this.$refs['exportdiv']
      exportEx.$mount(exportDiv)
      // 请求全部数据
      // 获取选中的id
      this.rwmcInpValId = this.$refs['taskName'].getLableValue()
      // 获取选中的name
      this.rwmcInpVal = this.$refs['taskName'].getLableName()

      this.scdwInpValid = this.$refs['scdw'].getLableValue()

      let params = {
        scph: this.scpcInpVal,
        tjsjBegin: this.queryTime[0],
        tjsjEnd: this.queryTime[1],
        rwmc: this.rwmcInpVal,
        scrxm: this.scmjInpVal,
        scdwjgdm: this.scdwInpValid,
        scType: this.scType,
        current: 1, // 默认第一页
        size: 5000 // 打印时候最多打印5000条
      }
      // 让序号从1开始计算
      this.columnDefsOne[0].valueGetter = params1 => params1.node.rowIndex + 1
      this.columnDefsTwo[0].valueGetter = params2 => params2.node.rowIndex + 1
      // 判断是安保还是禁毒 设置对应的columnDefs
      if (params.scType === '01') {
        exportEx.$props.columnDefs = this.columnDefsOne
      } else {
        exportEx.$props.columnDefs = this.columnDefsTwo
      }

      let batchBroQueryList = await this.$api.bgCheckApi.batchBrowsingQuery(
        params
      )
      exportEx.$props.rowData = batchBroQueryList.records
      // let ColumnParams = this.getPrintColumns('cz');
      exportEx.exportExcel()
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
      // 获取选中的id
      this.rwmcInpValId = this.$refs['taskName'].getLableValue()
      // 获取选中的name
      this.rwmcInpVal = this.$refs['taskName'].getLableName()
      this.scdwInpValid = this.$refs['scdw'].getLableValue()
      let params = {
        scph: this.scpcInpVal,
        tjsjBegin: this.queryTime[0],
        tjsjEnd: this.queryTime[1],
        rwmc: this.rwmcInpVal,
        scrxm: this.scmjInpVal,
        scdwjgdm: this.scdwInpValid,
        scType: this.scType,
        current: this.currentPage, // 默认第一页
        size: this.taskDataSize // 默认一页展示十个
      }

      // 判断是安保还是禁毒 设置对应的columnDefs
      if (params.scType === '01') {
        this.gridApi.setColumnDefs(this.columnDefs)
      } else {
        this.gridApi.setColumnDefs(this.columnDefsTwoQj)
      }
      this.agLoading = true
      let batchBroQueryList = await this.$api.bgCheckApi.batchBrowsingQuery(
        params
      )
      await this.gridApi.setRowData(batchBroQueryList.records)
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

      // this.agLoading = true;
      // let taskbgCheckApi = await this.$api.bgCheckApi.getAllTaskList(this.taskDataSize, val);
      // console.log(taskbgCheckApi.records)
      // await this.gridApi.setRowData(taskbgCheckApi.records)
      // this.agLoading = false;

      // 获取选中的id
      this.rwmcInpValId = this.$refs['taskName'].getLableValue()
      // 获取选中的name
      this.rwmcInpVal = this.$refs['taskName'].getLableName()
      this.scdwInpValid = this.$refs['scdw'].getLableValue()
      let params = {
        scph: this.scpcInpVal,
        tjsjBegin: this.queryTime[0],
        tjsjEnd: this.queryTime[1],
        rwmc: this.rwmcInpVal,
        scrxm: this.scmjInpVal,
        scdwjgdm: this.scdwInpValid,
        scType: this.scType,
        current: this.currentPage, // 默认第一页
        size: this.taskDataSize // 默认一页展示十个
      }

      // 判断是安保还是禁毒 设置对应的columnDefs
      if (params.scType === '01') {
        this.gridApi.setColumnDefs(this.columnDefs)
      } else {
        this.gridApi.setColumnDefs(this.columnDefsTwoQj)
      }
      this.agLoading = true
      let batchBroQueryList = await this.$api.bgCheckApi.batchBrowsingQuery(
        params
      )
      await this.gridApi.setRowData(batchBroQueryList.records)
      this.gridApi.sizeColumnsToFit()
      this.agLoading = false
    },
    /**
     *上一页
     *
     * @param {*} val
     */
    async prevClick (val) {
      // this.agLoading = true;
      // let taskbgCheckApi = await this.$api.bgCheckApi.getAllTaskList(this.taskDataSize, val);
      // await this.gridApi.setRowData(taskbgCheckApi.records)
      // this.agLoading = false;

      // 将页数赋值给currentPage
      this.currentPage = val
      // 获取选中的id
      this.rwmcInpValId = this.$refs['taskName'].getLableValue()
      // 获取选中的name
      this.rwmcInpVal = this.$refs['taskName'].getLableName()
      this.scdwInpValid = this.$refs['scdw'].getLableValue()
      let params = {
        scph: this.scpcInpVal,
        tjsjBegin: this.queryTime[0],
        tjsjEnd: this.queryTime[1],
        rwmc: this.rwmcInpVal,
        scrxm: this.scmjInpVal,
        scdwjgdm: this.scdwInpValid,
        scType: this.scType,
        current: this.currentPage, // 默认第一页
        size: this.taskDataSize // 默认一页展示十个
      }

      // 判断是安保还是禁毒 设置对应的columnDefs
      if (params.scType === '01') {
        this.gridApi.setColumnDefs(this.columnDefs)
      } else {
        this.gridApi.setColumnDefs(this.columnDefsTwoQj)
      }
      this.agLoading = true
      let batchBroQueryList = await this.$api.bgCheckApi.batchBrowsingQuery(
        params
      )
      await this.gridApi.setRowData(batchBroQueryList.records)
      this.gridApi.sizeColumnsToFit()
      this.agLoading = false
    },

    /**
     *下一页
     *
     * @param {*} val
     */
    async nextClick (val) {
      // this.agLoading = true;
      // let taskbgCheckApi = await this.$api.bgCheckApi.getAllTaskList(this.taskDataSize, val);
      // await this.gridApi.setRowData(taskbgCheckApi.records)
      // this.agLoading = false;

      // 将页数赋值给currentPage
      this.currentPage = val
      // 获取选中的id
      this.rwmcInpValId = this.$refs['taskName'].getLableValue()
      // 获取选中的name
      this.rwmcInpVal = this.$refs['taskName'].getLableName()
      this.scdwInpValid = this.$refs['scdw'].getLableValue()
      let params = {
        scph: this.scpcInpVal,
        tjsjBegin: this.queryTime[0],
        tjsjEnd: this.queryTime[1],
        rwmc: this.rwmcInpVal,
        scrxm: this.scmjInpVal,
        scdwjgdm: this.scdwInpValid,
        scType: this.scType,
        current: this.currentPage, // 默认第一页
        size: this.taskDataSize // 默认一页展示十个
      }

      // 判断是安保还是禁毒 设置对应的columnDefs
      if (params.scType === '01') {
        this.gridApi.setColumnDefs(this.columnDefs)
      } else {
        this.gridApi.setColumnDefs(this.columnDefsTwoQj)
      }
      this.agLoading = true
      let batchBroQueryList = await this.$api.bgCheckApi.batchBrowsingQuery(
        params
      )
      await this.gridApi.setRowData(batchBroQueryList.records)
      this.gridApi.sizeColumnsToFit()
      this.agLoading = false
    },
    /**
     *批量浏览查询的提交
     *
     * @returns
     */
    async submitSearch () {
      this.agLoading = true
      // 获取选中的id
      this.rwmcInpValId = this.$refs['taskName'].getLableValue()
      // 获取选中的name
      this.rwmcInpVal = this.$refs['taskName'].getLableName()
      this.scdwInpValid = this.$refs['scdw'].getLableValue()
      // 页码恢复成第一页
      this.currentPage = 1

      let params = {
        scph: this.scpcInpVal,
        tjsjBegin: this.queryTime[0],
        tjsjEnd: this.queryTime[1],
        rwmc: this.rwmcInpVal,
        scrxm: this.scmjInpVal,
        scdwjgdm: this.scdwInpValid,
        scType: this.scType,
        current: 1, // 默认第一页
        size: 10 // 默认一页展示十个
      }
      // 判断是安保还是禁毒 设置对应的columnDefs
      if (params.scType === '01') {
        this.gridApi.setColumnDefs(this.columnDefs)
      } else {
        this.gridApi.setColumnDefs(this.columnDefsTwoQj)
      }

      let batchBroQueryList = await this.$api.bgCheckApi.batchBrowsingQuery(
        params
      )

      // 将总条数赋值给taskDataTotal
      this.taskDataTotal = batchBroQueryList.total

      await this.gridApi.setRowData(batchBroQueryList.records)
      this.gridApi.sizeColumnsToFit()

      this.agLoading = false
      // 让grid列表显示出来
      this.gridShow = true

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
      this.scpcInpVal = ''
      this.rwmcInpVal = ''
      this.scmjInpVal = ''
      this.scdwInpValid = ''
      this.$refs['taskName'].ClearInput()
      this.$refs['scdw'].ClearInput()
      this.dateModel = ''
      this.queryTime = ''
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
     *验证输入是否中文
     *
     * @param {*} val
     */
    chineseCheck (val) {
      if (val) {
        if (!valRule.isChinese(val)) {
          this.$message({
            message: '请填写正确姓名！',
            type: 'warning'
          })
          this.scmjInpVal = ''
          return false
        }
      }
    },
    /**
     *列表中每一行的导出Excel
     *
     * @param {*} currentNode
     */
    async exportCurrentExcel (currentNode) {
      let VueInstance = Vue.extend(Vue.component('ExportExcel'))
      let exportEx = new VueInstance()
      let exportDiv = this.$refs['exportdiv']
      exportEx.$mount(exportDiv)

      let params = {
        scph: currentNode.data.SCPH,
        // scsj: currentNode.data.SCSJ,
        rwmc: currentNode.data.RWMC,
        // scrxm: currentNode.data.SCRXM,
        // scdwjgdm: currentNode.data.SCDWJGDM,
        scType: currentNode.data.SCTYPE,
        current: 1, // 默认第一页
        size: 5000 // 打印时候最多打印5000条
      }

      let batchBroQueryList = await this.$api.bgCheckApi.countQueryDetail(
        params
      )

      if (currentNode.data.SCTYPE === '01') {
        // 获取字典
        this.dictData = await this.$api.dictApi.getDictData('BJSC_SCJG')
        // 翻译审查结论

        batchBroQueryList = await dictTransle(
          'BJSC_SCJG',
          this.dictData,
          batchBroQueryList.records,
          'scjg',
          'scjgName'
        )
      } else {
        // 获取字典
        this.dictData = await this.$api.dictApi.getDictData('BJSC_SCJG_QJCS')
        // 翻译审查结论
        batchBroQueryList = await dictTransle(
          'BJSC_SCJG_QJCS',
          this.dictData,
          batchBroQueryList.records,
          'scjg',
          'scjgName'
        )
      }
      this.columnDefsRow[0].valueGetter = params1 => params1.node.rowIndex + 1
      // 设置对应的columnDefs
      exportEx.$props.columnDefs = this.columnDefsRow
      exportEx.$props.rowData = batchBroQueryList
      exportEx.exportExcel()
    },
    /**
     *单元格里面的点击事件
     *
     * @param {*} cell
     */
    onCellClicked (cell) {
      // 获取选中单元格对应列名的字段
      // console.log(cell.colDef.field)
      // 获取选中的单元格所在行的所有数据
      // console.log(cell.data);
      // 审查结果和背审单位
      let scjg = ''
      // 判断点击的是否安保
      if (cell.data.SCTYPE === '01') {
        if (cell.colDef.field === 'AB_TG') {
          scjg = '1'
        } else if (cell.colDef.field === 'AB_ZJYW') {
          scjg = '2'
        } else if (cell.colDef.field === 'AB_SFCY') {
          scjg = '3'
        } else if (cell.colDef.field === 'AB_BYTG') {
          scjg = '4'
        } else {
          this.$message({
            message: '请双击选择通过数、证件有误、身份存疑、不予通过的数据',
            type: 'error'
          })
          return
        }
      } else if (cell.colDef.field === 'QJCS_TQCSFIVE') {
        scjg = '1'
      } else if (cell.colDef.field === 'QJCS_TQCSTHREE') {
        scjg = '2'
      } else if (cell.colDef.field === 'QJCS_ZJYW') {
        scjg = '3'
      } else if (cell.colDef.field === 'QJCS_BYTG') {
        scjg = '4'
      } else if (cell.colDef.field === 'QJCS_YCS') {
        scjg = '5'
      } else {
        this.$message({
          message:
            '请双击选择提前五个月出所、提前三个月出所、证件有误、不予通过、已出所的数据',
          type: 'error'
        })
        return
      }
      let rwmc = cell.data.RWMC
      let scType = cell.data.SCTYPE
      let scph = cell.data.SCPH

      this.detailPage(scjg, rwmc, scType, scph)
    },
    /**
     *详情页面跳转
     *
     * @param {*} rowNode
     */
    detailPage (scjg, rwmc, scType, scph) {
      // 跳转新页面
      let routeUrl = this.$router.resolve({
        path: '/statistical-query-detail'
        // query: {
        //     scjg: scjg,
        //     rwmc: rwmc,
        //     scType:scType,
        //     scph:scph
        // }
      })
      let params = {
        scjg: scjg,
        rwmc: rwmc,
        scType: scType,
        scph: scph
      }
      // 储存需要使用的参数
      sessionStorage.setItem('params', JSON.stringify(params))
      window.open(routeUrl.href, '_blank')
    }
  }
}
