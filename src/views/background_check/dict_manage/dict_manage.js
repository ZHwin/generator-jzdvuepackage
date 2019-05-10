import DictMainOperat from '@components/dict_main_operat'
import DictSubOperat from '@components/dict_sub_operat'
import DictAddDialog from '@components/dict_add_dialog'
export default {
  name: 'DictManage',
  components: {
    'dict-main-operat': DictMainOperat,
    'dict-sub-operat': DictSubOperat,
    DictAddDialog
  },
  /**
   *dom加载完成后
   *
   */
  async mounted () {
    // 获取单位字典数据
    this.agtopLoading = true
    let pageData = await this.getAllMainDictData('1', '10')
    this.gridOptionsTop.api.setRowData(pageData.records)
    this.gridOptionsTop.api.sizeColumnsToFit()
    this.agtopLoading = false
  },

  /**
   *定义数据
   *
   * @returns
   */
  data () {
    return {
      agtopLoading: false,
      agbottomLoading: false,
      dictId: '',
      dictName: '',
      valid: 1,
      curUnitID: '',
      mainCurPage: '', // 主表当前页码
      mainPageSize: '', // 主表每页条数
      mainTotalNum: '', // 主表总条数
      mainPages: '', // 主表总共页数
      subCurPage: '', // 从表当前页码
      subPageSize: '', // 从表每页条数
      subTotalNum: '', // 从表总条数
      subPages: '', // 从表总共页数
      gridOptionsTop: {
        context: {
          componentParent: this
        },
        rowData: [],
        defaultColDef: {
          resizable: true
        },
        rowSelection: 'single',
        columnDefs: [
          {
            headerName: '序号',
            field: 'order',
            width: 100,
            valueGetter: params =>
              (this.mainCurPage - 1) * this.mainPageSize +
              params.node.rowIndex +
              1
          },
          { headerName: '字典代码', field: 'czddm' },
          { headerName: '字典名称', field: 'czdmc' },
          { headerName: '备注', field: 'cbz' },
          {
            headerName: '有效性',
            field: 'yxx',
            valueGetter: params => {
              if (params.data.yxx === '1') {
                return '有效'
              }
              return '无效'
            },
            cellClassRules: {
              cellGreenColor: params => {
                return params.value === '有效'
              },
              cellRedColor: params => {
                return params.value === '无效'
              }
            }
          },
          { headerName: '子级个数', field: 'zdnrCount' },
          {
            headerName: '操作',
            cellRendererFramework: 'dict-main-operat',
            width: 230
          }
        ]
      },

      gridOptionsBootom: {
        context: {
          componentParent: this
        },
        rowData: [],
        defaultColDef: {
          resizable: true
        },
        suppressCellSelection: true,
        columnDefs: [
          {
            headerName: '序号',
            field: 'order',
            width: 100,
            valueGetter: params =>
              (this.subCurPage - 1) * this.subPageSize +
              params.node.rowIndex +
              1
          },
          { headerName: '字典代码', field: 'czddm' },
          { headerName: '代码', field: 'cdm' },
          { headerName: '代码名称', field: 'cmc' },
          { headerName: '备注', field: 'cbz' },
          { headerName: '上级代码', field: 'csjdm' },
          {
            headerName: '操作',
            cellRendererFramework: 'dict-sub-operat',
            width: 230
          }
        ]
      }
    }
  },
  methods: {
    /**
     * 查询
     *
     */
    async search () {
      this.agtopLoading = true
      let pageData = await this.getAllMainDictData(
        this.mainCurPage,
        this.mainPageSize,
        this.dictId,
        this.dictName
      )
      this.gridOptionsTop.api.setRowData(pageData.records)
      this.gridOptionsTop.api.sizeColumnsToFit()
      this.agtopLoading = false
      this.$message({
        message: '操作成功!',
        type: 'success'
      })
      this.gridOptionsBootom.api.setRowData([])
      this.gridOptionsBootom.api.sizeColumnsToFit()
    },
    async reset () {
      this.agtopLoading = true
      let pageData = await this.getAllMainDictData(
        this.mainCurPage,
        this.mainPageSize
      )
      this.gridOptionsTop.api.setRowData(pageData.records)
      this.gridOptionsTop.api.sizeColumnsToFit()
      this.agtopLoading = false
      this.$message({
        message: '操作成功!',
        type: 'success'
      })
      this.gridOptionsBootom.api.setRowData([])
      this.gridOptionsBootom.api.sizeColumnsToFit()
    },
    /**
     *刷新主表字典数据
     *
     */
    async RefreshMainDict () {
      this.agtopLoading = true
      let pageData = await this.getAllMainDictData(
        this.mainCurPage,
        this.mainPageSize
      )
      this.gridOptionsTop.api.setRowData(pageData.records)
      this.gridOptionsTop.api.sizeColumnsToFit()
      this.agtopLoading = false
      this.$message({
        message: '操作成功!',
        type: 'success'
      })
    },
    /**
     *
     *刷新从表数据
     *
     */
    async RefreshDetailDict () {
      this.agbottomLoading = true
      let detailData = await this.getAllDetailDictData(
        this.subCurPage,
        this.subPageSize,
        this.curUnitID
      )
      this.gridOptionsBootom.api.setRowData(detailData.records)
      this.gridOptionsBootom.api.sizeColumnsToFit()
      this.agbottomLoading = false
      this.$message({
        message: '操作成功!',
        type: 'success'
      })
    },
    /**
     *获取主表数据
     *
     * @param {*} curPage
     * @param {*} pageSize
     * @returns
     */
    async getAllMainDictData (curPage, pageSize, ...args) {
      let data = await this.$api.bgCheckApi.getMainDictMangerAll(
        curPage,
        pageSize,
        args[0],
        args[1]
      )
      this.mainCurPage = data.current
      this.mainPages = data.pages
      this.mainPageSize = data.size
      this.mainTotalNum = data.total
      return data
    },

    /**
     *获取从表数据
     *
     * @param {*} curPage
     * @param {*} pageSize
     * @param {*} unitID
     *  @param {*} mainDictId
     * @returns
     */
    async getAllDetailDictData (curPage, pageSize, unitID) {
      let data = await this.$api.bgCheckApi.getSubDictMangerDetail(
        curPage,
        pageSize,
        unitID
      )
      this.subCurPage = data.current
      this.subPages = data.pages
      this.subPageSize = data.size
      this.subTotalNum = data.total
      return data
    },

    addMain () {
      this.$refs['adddialog'].openDialog('addMain')
    },
    async showSub (node) {
      this.curUnitID = node.data.czddm
      let detailData = await this.getAllDetailDictData(1, 10, this.curUnitID)
      this.gridOptionsBootom.api.setRowData(detailData.records)
      this.gridOptionsBootom.api.sizeColumnsToFit()
    },
    editMain (node) {
      this.$refs['adddialog'].openDialog('editMain', node)
    },
    /**
     *删除主表数据
     *
     * @param {*} node
     */
    delMainRow (node) {
      this.$confirm('此操作将删除该行数据, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          this.agtopLoading = true
          await this.$api.bgCheckApi.delMainDictRow(node.data.czddm)

          // 重新请求主表数据
          let pageData = await this.getAllMainDictData(
            this.mainCurPage,
            this.mainPageSize
          )
          this.gridOptionsTop.api.setRowData(pageData.records)
          this.gridOptionsTop.api.sizeColumnsToFit()
          this.agtopLoading = false
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },
    addSub () {
      // 获取上方选中行
      let selectMainRow = this.gridOptionsTop.api.getSelectedRows()
      if (selectMainRow.length === 0) {
        this.$message({
          message: '请选择主表数据',
          type: 'warning'
        })
      } else {
        this.$refs['adddialog'].openDialog('addSub', selectMainRow)
      }
    },
    editSub (node) {
      this.$refs['adddialog'].openDialog('editSub', node)
    },
    addSubSub (node) {
      this.$refs['adddialog'].openDialog('addSubSub', node)
    },
    delSub (node) {
      this.$confirm('此操作将删除该行数据, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          this.agbottomLoading = true
          await this.$api.bgCheckApi.delDetailDictRow(node.data.id)
          // 重新请求从表数据
          let detailData = await this.getAllDetailDictData(
            this.subCurPage,
            this.subPageSize,
            this.curUnitID
          )
          this.gridOptionsBootom.api.setRowData(detailData.records)
          this.gridOptionsBootom.api.sizeColumnsToFit()
          this.agbottomLoading = false
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },
    async cellClicked (node) {
      if (node.value) {
        this.curUnitID = node.data.czddm
        this.agbottomLoading = true
        let detailData = await this.getAllDetailDictData(1, 10, this.curUnitID)
        this.gridOptionsBootom.api.setRowData(detailData.records)
        this.gridOptionsBootom.api.sizeColumnsToFit()
        this.agbottomLoading = false
      }
    },

    // 主表分页相关操作
    async mainHandleSizeChange (val) {
      let pageData = await this.getAllMainDictData(1, val)
      this.gridOptionsTop.api.setRowData(pageData.records)
      this.gridOptionsTop.api.sizeColumnsToFit()
    },
    async mainHandleCurrentChange (val) {
      let pageData = await this.getAllMainDictData(val, this.mainPageSize)
      this.gridOptionsTop.api.setRowData(pageData.records)
      this.gridOptionsTop.api.sizeColumnsToFit()
    },
    async mainPrevClick (val) {
      let pageData = await this.getAllMainDictData(val, this.mainPageSize)
      this.gridOptionsTop.api.setRowData(pageData.records)
      this.gridOptionsTop.api.sizeColumnsToFit()
    },
    async mainNextClick (val) {
      let pageData = await this.getAllMainDictData(val, this.mainPageSize)
      this.gridOptionsTop.api.setRowData(pageData.records)
      this.gridOptionsTop.api.sizeColumnsToFit()
    },
    // 从表分页相关操作
    async subHandleSizeChange (val) {
      let detailData = await this.getAllDetailDictData(1, val, this.curUnitID)
      this.gridOptionsBootom.api.setRowData(detailData.records)
      this.gridOptionsBootom.api.sizeColumnsToFit()
    },
    async subHandleCurrentChange (val) {
      let detailData = await this.getAllDetailDictData(
        val,
        this.subPageSize,
        this.curUnitID
      )
      this.gridOptionsBootom.api.setRowData(detailData.records)
      this.gridOptionsBootom.api.sizeColumnsToFit()
    },
    async subPrevClick (val) {
      let detailData = await this.getAllDetailDictData(
        val,
        this.subPageSize,
        this.curUnitID
      )
      this.gridOptionsBootom.api.setRowData(detailData.records)
      this.gridOptionsBootom.api.sizeColumnsToFit()
    },
    async subNextClick (val) {
      let detailData = await this.getAllDetailDictData(
        val,
        this.subPageSize,
        this.curUnitID
      )
      this.gridOptionsBootom.api.setRowData(detailData.records)
      this.gridOptionsBootom.api.sizeColumnsToFit()
    }
  }
}
