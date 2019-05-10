import { dictTransle, iframeDownload } from '@utils/tools'
export default {
  name: 'SecurityBatchReview',

  data () {
    return {
      dictData: '',
      loading: false,
      agLoading: false,
      taskName: '',
      policeName: this.$store.state.userName,
      policeId: this.$store.state.idno,
      policeUnit: this.$store.state.jgmc,
      files: [],
      totalNum: '', // 总条数
      curPage: '', // 当前页码
      pageSize: 10, // 每页条数
      pages: '', // 总共页数
      scph: '',
      // aggrid配置
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
        getMainMenuItems: false,
        columnDefs: [
          {
            headerName: '序号',
            field: 'index',
            width: 100,
            valueGetter: params =>
              (this.curPage - 1) * this.pageSize + params.node.rowIndex + 1
          },
          {
            headerName: '审查结论 ',
            field: 'SCJGName',
            cellClassRules: {
              cellGreenColor: params => {
                return params.value === '通过'
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
          { headerName: '姓名', field: 'XM' },
          { headerName: '身份证号', field: 'SFZH' },
          { headerName: '户籍地址', field: 'HJDXZ' },

          { headerName: '任务名称', field: 'RWMC' },
          { headerName: '情况说明', field: 'RYLBBJ' },
          {
            headerName: '操作',
            field: 'cz',
            cellClass: ['oprateCell'],
            cellRendererFramework: Vue.component('DetailButton')
          }
        ],
        rowData: []
      }
    }
  },
  async mounted () {
    this.dictData = await this.$api.dictApi.getDictData('BJSC_SCJG')
  },
  methods: {
    /**
     *
     *
     */
    downloadTemplate () {
      iframeDownload('/static/template/背审对象数据导入表(安保禁毒).xls')
    },

    /**
     *
     *
     * @param {*} e
     * @returns
     */
    beforeUpload (e) {
      if (!e.name.endsWith('.xlsx') || !e.name.endsWith('.xls')) {
        this.$message({
          message: '请上传excel文件',
          type: 'warning'
        })
        return false
      }
      if (e.size > 20971520) {
        this.$message({
          message: '文件太大!请分开上传！',
          type: 'warning'
        })
        return false
      }
    },
    /**
     *
     *
     * @param {*} file
     */
    fileChange (file) {
      this.files.push(file.raw) // 上传文件变化时将文件对象push进files数组
    },

    /**
     *
     *
     */
    fileRemove () {
      this.files = []
    },

    /**
     *重置功能
     *
     */
    reset () {
      this.$refs['taskName'].ClearInput()
      this.scph = ''
      this.gridOptions.api.setRowData([])
      this.gridOptions.api.sizeColumnsToFit()
    },

    /**
     *
     *
     * @returns
     */
    async submit () {
      this.taskName = this.$refs['taskName'].getLableName()
      if (!this.taskName) {
        this.$message({
          message: '请填写任务名称!',
          type: 'warning'
        })
        return false
      }
      if (this.files.length === 0) {
        this.$message({
          message: '请选择要上传的文件！',
          type: 'warning'
        })
        return false
      }
      let formData = new FormData()
      formData.append('file', this.files[0])
      formData.append('rwmc', this.taskName)
      formData.append('scType', '01')
      this.loading = true
      let resData = await this.$api.bgCheckApi.submitBatchCheck(formData)
      this.loading = false
      this.$message(resData.msg)

      if (resData.scph) {
        this.scph = resData.scph
        let pageData = await this.getCheckedList(1, 10, this.scph)

        let list = await dictTransle(
          'BJSC_SCJG',
          this.dictData,
          pageData.records,
          'SCJG',
          'SCJGName'
        )
        this.gridOptions.api.setRowData(list)
        this.gridOptions.api.sizeColumnsToFit()
      }
    },

    /**
     *
     *
     * @param {*} curPage
     * @param {*} pageSize
     * @returns
     */
    async getCheckedList (curPage, pageSize, scph) {
      let pageData = await this.$api.bgCheckApi.searchBatchCheck(
        curPage,
        pageSize,
        '01',
        scph
      )
      this.curPage = pageData.current
      this.pages = pageData.pages
      this.pageSize = pageData.size
      this.totalNum = pageData.total
      return pageData
    },
    /**
     *
     *
     * @param {*} val
     */
    async handleSizeChange (val) {
      this.agLoading = true
      let pageData = await this.getCheckedList(1, val, this.scph)
      let list = await dictTransle(
        'BJSC_SCJG',
        this.dictData,
        pageData.records,
        'SCJG',
        'SCJGName'
      )

      this.gridOptions.api.setRowData(list)
      this.gridOptions.api.sizeColumnsToFit()

      this.agLoading = false
    },

    /**
     *
     *
     * @param {*} val
     */
    async handleCurrentChange (val) {
      this.agLoading = true
      let pageData = await this.getCheckedList(val, this.pageSize, this.scph)
      let list = await dictTransle(
        'BJSC_SCJG',
        this.dictData,
        pageData.records,
        'SCJG',
        'SCJGName'
      )

      this.gridOptions.api.setRowData(list)
      this.gridOptions.api.sizeColumnsToFit()

      this.agLoading = false
    },

    /**
     *
     *
     * @param {*} val
     */
    async prevClick (val) {
      this.agLoading = true
      let pageData = await this.getCheckedList(val, this.pageSize, this.scph)
      let list = await dictTransle(
        'BJSC_SCJG',
        this.dictData,
        pageData.records,
        'SCJG',
        'SCJGName'
      )

      this.gridOptions.api.setRowData(list)
      this.gridOptions.api.sizeColumnsToFit()

      this.agLoading = false
    },

    /**
     *
     *
     * @param {*} val
     */
    async nextClick (val) {
      this.agLoading = true
      let pageData = await this.getCheckedList(val, this.pageSize, this.scph)
      let list = await dictTransle(
        'BJSC_SCJG',
        this.dictData,
        pageData.records,
        'SCJG',
        'SCJGName'
      )

      this.gridOptions.api.setRowData(list)
      this.gridOptions.api.sizeColumnsToFit()

      this.agLoading = false
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
        path: '/review-Detail'
        // query: { rowDataZj: rowDataZj }
      })
      // 储存需要使用的参数
      sessionStorage.setItem('rowDataZj', rowDataZj)
      window.open(routeUrl.href, '_blank')
    }
  }
}
