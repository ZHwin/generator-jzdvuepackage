import UserSetDialog from '@components/user_set_dialog'
import UserSettingOperat from '@components/user_setting_operat'
export default {
  name: 'UserSetting',
  components: {
    UserSetDialog,
    'user-setting-operat': UserSettingOperat
  },
  /**
   *dom加载完成后
   *
   */
  async mounted () {
    // 获取单位字典数据
    this.agLoading = true
    this.unitData = await this.$api.dictApi.getDictTree('DWDM')
    let roles = await this.$api.dictApi.getDictTree('ROLETYPE')
    this.rolesData = roles
    let userList = await this.getAllUserListData(1, 10)
    this.gridOptions.api.setRowData(userList.records)
    this.gridOptions.api.sizeColumnsToFit()
    this.agLoading = false
  },
  /**
   *定义数据
   *
   * @returns
   */
  data () {
    return {
      agLoading: false,
      name: '',
      policeId: '',
      idNumber: '',
      unit: '',
      userRole: '',
      isIncludSubUnit: false,
      unitData: '',
      inputWidth: '80%',
      selectWidth: '240px',
      rolesData: '',
      curPage: '',
      pages: '',
      pageSize: '',
      totalNum: '',
      gridOptions: {
        context: {
          componentParent: this
        },
        rowData: [],
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
            field: 'order',
            width: 100,
            valueGetter: params => params.node.rowIndex + 1
          },
          { headerName: '姓名', field: 'xm' },
          { headerName: '系统账户', field: 'username' },
          { headerName: '身份证号', field: 'idno' },
          { headerName: '单位名称', field: 'jgmc' },
          {
            headerName: '操作',
            cellRendererFramework: 'user-setting-operat',
            width: 270
          }
        ]
      }
    }
  },
  methods: {
    /**
     *获取用户数据
     *
     * @param {*} curPage
     * @param {*} pageSize
     * @returns
     */
    async getAllUserListData (curPage, pageSize, ...args) {
      let data = await this.$api.bgCheckApi.getUserSetList(
        curPage,
        pageSize,
        args[0],
        args[1],
        args[2],
        args[3],
        args[4],
        args[5]
      )
      this.curPage = data.current
      this.pages = data.pages
      this.pageSize = data.size
      this.totalNum = data.total
      return data
    },

    /** *分页操作 start******/

    async handleSizeChange (val) {
      this.agLoading = true
      let userList = await this.getAllUserListData(1, val)
      this.gridOptions.api.setRowData(userList.records)
      this.gridOptions.api.sizeColumnsToFit()
      this.agLoading = false
    },
    async handleCurrentChange (val) {
      this.agLoading = true
      let userList = await this.getAllUserListData(val, this.pageSize)
      this.gridOptions.api.setRowData(userList.records)
      this.gridOptions.api.sizeColumnsToFit()
      this.agLoading = false
    },
    async prevClick (val) {
      this.agLoading = true
      let userList = await this.getAllUserListData(val, this.pageSize)
      this.gridOptions.api.setRowData(userList.records)
      this.gridOptions.api.sizeColumnsToFit()
      this.agLoading = false
    },
    async nextClick (val) {
      this.agLoading = true
      let userList = await this.getAllUserListData(val, this.pageSize)
      this.gridOptions.api.setRowData(userList.records)
      this.gridOptions.api.sizeColumnsToFit()
      this.agLoading = false
    },
    /** *分页操作 end******/
    async search () {
      let jgdm = this.$refs['unitref'].getLableValue()
      let roleType = this.$refs['rolesref'].getLableValue()
      this.agLoading = true
      let userList = await this.getAllUserListData(
        1,
        10,
        this.name,
        this.policeId,
        this.idNumber,
        jgdm,
        this.isIncludSubUnit ? 'jgdm' : '',
        roleType
      )
      this.gridOptions.api.setRowData(userList.records)
      this.gridOptions.api.sizeColumnsToFit()
      this.agLoading = false
      this.$message({
        message: '查询成功',
        type: 'success'
      })
    },

    /**
     *重置
     *
     */
    async reset () {
      this.name = ''
      this.policeId = ''
      this.idNumber = ''
      this.isIncludSubUnit = false
      this.$refs['unitref'].ClearInput()
      this.$refs['rolesref'].ClearInput()
      await this.refreshAgGrid()
    },

    /**
     *
     *刷新aggrid
     */
    async refreshAgGrid () {
      this.agLoading = true
      let userList = await this.getAllUserListData(this.curPage, this.pageSize)
      this.gridOptions.api.setRowData(userList.records)
      this.gridOptions.api.sizeColumnsToFit()
      this.agLoading = false
      this.$message({
        message: '操作成功!',
        type: 'success'
      })
    },
    /**
     *增加用户信息
     *
     */
    add () {
      this.$refs['setdialog'].openDialog()
    },

    /**
     *删除用户信息
     *
     * @param {*} node
     */
    delUser (node) {
      this.$confirm('此操作将删除该行用户数据, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          this.agLoading = true
          await this.$api.bgCheckApi.delUserInfo(node.data.pk)
          let userList = await this.getAllUserListData(
            this.curPage,
            this.pageSize
          )
          this.gridOptions.api.setRowData(userList.records)
          this.gridOptions.api.sizeColumnsToFit()
          this.agLoading = false
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
    /**
     *编辑用户信息
     *
     * @param {*} node
     */
    updateUser (node) {
      this.$refs['setdialog'].openDialog(node)
      console.log(node)
    },
    /**
     *重置密码
     *
     */
    async resetPassword (node) {
      let resdata = await this.$api.bgCheckApi.resetUserPassword(node.data.pk)
      if (resdata.success) {
        this.$message({
          type: 'success',
          message: `用户${node.data.xm}${resdata.prompMessage}`
        })
      } else {
        this.$message({
          type: 'error',
          message: `用户${node.data.xm}${resdata.prompMessage}`
        })
      }
    }
  }
}
