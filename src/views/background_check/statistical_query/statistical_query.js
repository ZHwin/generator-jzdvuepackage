/* eslint-disable standard/computed-property-even-spacing */
export default {
  name: 'StatisticalQuery',
  /**
   *dom加载完成后
   *
   */
  async mounted () {
    this.gridApi = this.gridOptions.api
    this.gridColumnApi = this.gridOptions.columnApi
    // 获取统计单位字典tree
    this.queryUnit = await this.$api.dictApi.getDictTree('DWDM')
  },
  /**
   *定义数据
   *
   * @returns
   */
  data () {
    return {
      queryUnit: '',
      queryTime: '',
      taskName: '',
      imageUrl: '',
      inputWidth: '80%',
      selectWidth: '220px',
      dateModel: [],
      gridApi: null,
      agLoading: false,
      gridShow: false,
      currentPage: 1,
      rwmcInpVal: '', // 任务名称
      rwmcInpValid: '',
      szmjInpVal: this.$store.state.userName, // 设置民警
      szmjsfzhInpVal: this.$store.state.idno, // 设置民警身份证号
      szdwInpVal: this.$store.state.jgmc, // 设置单位
      taskDataTotal: '', // 任务总条数
      taskDataSize: 10, // grid列表每页展示数量 默认是10
      columnDefs: [
        { headerName: '背审单位', field: 'DWMC', headerClass: ['text-auto'] },
        {
          headerName: '背审总数',
          field: 'BSZS',
          tooltipField: 'xsxq',
          headerClass: ['text-auto']
        },
        { headerName: '通过数', field: 'TGS', headerClass: ['text-auto'] },
        {
          headerName: '不通过',
          field: 'NOPASS',
          children: [
            {
              headerName: '证件有误',
              field: 'ZJYW',
              headerClass: ['border-top']
            },
            {
              headerName: '不予通过',
              field: 'BYTG',
              headerClass: ['border-top']
            },
            {
              headerName: '身份存疑',
              field: 'SFCY',
              headerClass: ['border-top']
            },
            { headerName: '小计', field: 'BTGS', headerClass: ['border-top'] }
          ]
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
    handleAvatarSuccess (res, file) {
      this.imageUrl = URL.createObjectURL(file.raw)
    },
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
    onBtExport () {
      let ColumnParams = this.getPrintColumns('')
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
     *统计查询的统计
     *
     * @returns
     */
    async submitstatistical () {
      this.gridShow = true
      // 获取选中的id
      this.rwmcInpValid = this.$refs['taskName'].getLableValue()
      // 获取选中的name
      this.rwmcInpVal = this.$refs['taskName'].getLableName()
      // 获取统计单位的值
      // this.queryUnit = this.$refs["queryUnit"].getLableValue();

      let params = {
        tjsjBegin: this.queryTime[0],
        tjsjEnd: this.queryTime[1],
        rwmc: this.rwmcInpVal
        // scdwjgdm: this.queryUnit,
      }

      let statiQueryList = await this.$api.bgCheckApi.countQuery(params)
      console.log(statiQueryList)

      //  获取背审 、通过数等的总数
      let bszsSum = alasql(`select sum(BSZS) from ?`, [statiQueryList])[0][
        'SUM(BSZS)'
      ]
      let tgsSum = alasql(`select sum(TGS) from ?`, [statiQueryList])[0][
        'SUM(TGS)'
      ]
      let zjywSum = alasql(`select sum(ZJYW) from ?`, [statiQueryList])[0][
        'SUM(ZJYW)'
      ]
      let bytgSum = alasql(`select sum(BYTG) from ?`, [statiQueryList])[0][
        'SUM(BYTG)'
      ]
      let sfcySum = alasql(`select sum(SFCY) from ?`, [statiQueryList])[0][
        'SUM(SFCY)'
      ]
      let btgsSum = alasql(`select sum(BTGS) from ?`, [statiQueryList])[0][
        'SUM(BTGS)'
      ]

      // 新加的总计这一行
      let statiQueryTotal = {
        DWMC: '总计',
        BSZS: bszsSum,
        TGS: tgsSum,
        ZJYW: zjywSum,
        BYTG: bytgSum,
        SFCY: sfcySum,
        BTGS: btgsSum
      }
      statiQueryList.push(statiQueryTotal)

      //  获取所有任务列表数据
      this.agLoading = true
      await this.gridApi.setRowData(statiQueryList)
      this.gridApi.sizeColumnsToFit()
      this.agLoading = false

      this.$message({
        message: '统计成功',
        type: 'success'
      })
    },
    /**
     *重置方法
     *
     */
    resetTask (event) {
      // 清空任务名称的值
      this.queryTime = ''
      this.taskName = ''
      this.$refs['taskName'].ClearInput()
      this.dateModel = ''
      // this.queryUnit = ''
      // 判断是否点击的重置按钮
      // this.$refs["queryUnit"].ClearInput()

      if (event !== undefined) {
        // 隐藏审查通过的提示和下面的grid列表
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
      let scdwjgdm = ''
      if (cell.colDef.field === 'BSZS') {
        scjg = ''
      } else if (cell.colDef.field === 'TGS') {
        scjg = '1'
      } else if (cell.colDef.field === 'ZJYW') {
        scjg = '2'
      } else if (cell.colDef.field === 'SFCY') {
        scjg = '3'
      } else if (cell.colDef.field === 'BYTG') {
        scjg = '4'
      } else {
        this.$message({
          message:
            '请双击选择背审总数、通过数、证件有误、不予通过、身份存疑的数据',
          type: 'error'
        })
        return
      }

      if (!cell.data.DWDM) {
        scdwjgdm = ''
      } else {
        scdwjgdm = cell.data.DWDM
      }
      console.log(scjg)
      this.detailPage(scjg, scdwjgdm)
    },
    /**
     *详情页面跳转
     *
     * @param {*} rowNode
     */
    detailPage (scjg, scdwjgdm) {
      // 跳转新页面
      let routeUrl = this.$router.resolve({
        path: '/statistical-query-detail'
        // query: {
        //   scjg: scjg,
        //   bsdw: scdwjgdm,
        //   tjsjBegin: this.queryTime[0],
        //   tjsjEnd: this.queryTime[1],
        //   rwmc: this.rwmcInpVal,
        //   scType:'01'
        // }
      })
      let params = {
        scjg: scjg,
        bsdw: scdwjgdm,
        tjsjBegin: this.queryTime[0],
        tjsjEnd: this.queryTime[1],
        rwmc: this.rwmcInpVal,
        scType: '01'
      }
      // 储存需要使用的参数
      sessionStorage.setItem('params', JSON.stringify(params))
      window.open(routeUrl.href, '_blank')
    }
  }
}
