import valRule from '@utils/validate'
export default {
  name: 'UserSetDialog',
  data () {
    return {
      dialogVisible: false,
      title: '新增',
      pk: '',
      userName: '',
      sysAccount: '',
      policeNum: '',
      idNum: '',
      jobLevel: '',
      dept: '',
      userId: '',
      zwjbList: [], // 职位级别数据
      unitData: [], // 单位数据
      roleMaps: [], // 原始全部角色列表
      RolesList: [], // 选择后的角色列表
      inputWidth: '130px',
      selectWidth: '100px',
      selectWidth1: '100px',
      defultShowZw: '',
      defultShowBm: '',
      isAlllegality: false
    }
  },

  async mounted () {
    // 获取职位 级别字典
    this.zwjbList = await this.$api.dictApi.getDictTree('ZWJB')
    this.unitData = await this.$api.dictApi.getDictTree('DWDM')
    // 获取角色列表
    let allUserRoles = await this.$api.bgCheckApi.getCurUserRoles()
    this.roleMaps = allUserRoles.roleMap
  },

  methods: {
    /**
     *翻译职务级别
     *
     * @param {*} zwjbdm
     * @returns
     */
    ZwjbTransle (zwjbdm) {
      if (this.zwjbList.length !== 0) {
        let data = alasql(`select * from ? where id='${zwjbdm}'`, [
          this.zwjbList
        ])
        if (data.length !== 0) {
          return data[0].name
        }
      }
    },
    /**
     *提交前的验证方法
     *
     */
    SubmitVerification () {
      if (!valRule.isChinese(this.userName)) {
        this.$message({
          message: '请填写正确姓名！',
          type: 'warning'
        })
        this.userName = ''
        this.isAlllegality = false
        return false
      }
      if (valRule.isNull(this.sysAccount)) {
        this.$message({
          message: '请填写系统账户！',
          type: 'warning'
        })
        this.isAlllegality = false
        return false
      }
      if (valRule.isNull(this.policeNum)) {
        this.$message({
          message: '请填写警号！',
          type: 'warning'
        })
        this.isAlllegality = false
        return false
      }
      if (!valRule.isIdNum(this.idNum)) {
        this.$message({
          message: '请填写正确的身份证号！',
          type: 'warning'
        })
        this.idNum = ''
        this.isAlllegality = false
        return false
      }
      if (valRule.isNull(this.$refs['zwjbref'].getLableValue())) {
        this.$message({
          message: '请选择职务级别！',
          type: 'warning'
        })
        this.isAlllegality = false
        return false
      }

      if (valRule.isNull(this.$refs['bmref'].getLableValue())) {
        this.$message({
          message: '请选择所属部门！',
          type: 'warning'
        })
        this.isAlllegality = false
        return false
      }
      if (valRule.isNull(this.userId)) {
        this.$message({
          message: '请填写用户id！',
          type: 'warning'
        })
        this.isAlllegality = false
        return false
      }
      this.isAlllegality = true
    },
    async openDialog (node) {
      this.dialogVisible = true
      if (node) {
        this.title = '编辑'
        this.pk = node.data.pk
        this.userName = node.data.xm
        this.sysAccount = node.data.username
        this.policeNum = node.data.jh
        this.idNum = node.data.idno
        this.jobLevel = node.data.zwjb
        this.dept = node.data.jgmc
        this.userId = node.data.yhid
        this.defultShowBm = {
          lable: node.data.jgmc,
          value: node.data.jgdm
        }
        this.defultShowZw = {
          lable: this.ZwjbTransle(node.data.zwjb),
          value: node.data.zwjb
        }

        // 获取当前用户的角色列表
        let roles = await this.$api.bgCheckApi.getCurUserRoles(node.data.pk)
        let role = roles.roleMap
        let attrs = alasql(`select attrs from ?`, [role])
        let checkarr = []
        attrs.forEach(element => {
          let checked = alasql(`select code from ? where checked=true`, [
            element['attrs']
          ])
          checkarr.push(...checked)
        })
        for (let item of checkarr) {
          this.RolesList.push(item.code)
        }
      } else {
        this.title = '新增'
        this.userName = ''
        this.sysAccount = ''
        this.policeNum = ''
        this.idNum = ''
        this.jobLevel = ''
        this.dept = ''
        this.userId = ''
        this.defultShowBm = {
          lable: '',
          value: ''
        }
        this.defultShowZw = {
          lable: '',
          value: ''
        }
        if (this.$refs['zwjbref']) {
          this.$refs['zwjbref'].ClearInput()
        }
        if (this.$refs['bmref']) {
          this.$refs['bmref'].ClearInput()
        }
        this.RolesList = []
      }
    },
    /**
     *提交功能
     *
     */
    async submit () {
      this.SubmitVerification()
      if (!this.isAlllegality) {
        return false
      }
      let roles = []
      for (let item of this.RolesList) {
        let obj = {}
        obj.code = item
        roles.push(obj)
      }
      // 新增 提交
      if (this.title === '新增') {
        let params = {
          account: {
            xm: this.userName,
            username: this.sysAccount,
            jh: this.policeNum,
            idno: this.idNum,
            zwjb: this.$refs['zwjbref'].getLableValue(),
            jgdm: this.$refs['bmref'].getLableValue(),
            jgmc: this.$refs['bmref'].getLableName(),
            yhid: this.userId
          },
          roles: roles
        }
        let resData = await this.$api.bgCheckApi.addUserInfo(params)
        // 关闭弹窗，刷新用户设置主页面
        if (resData.success) {
          this.dialogVisible = false
          this.$emit('refreshAgGrid')
        } else {
          this.$message({
            message: resData.prompMessage,
            type: 'warning'
          })
        }
      } else {
        // 修改提交
        let params = {
          account: {
            pk: this.pk,
            xm: this.userName,
            username: this.sysAccount,
            jh: this.policeNum,
            idno: this.idNum,
            zwjb: this.$refs['zwjbref'].getLableValue(),
            jgdm: this.$refs['bmref'].getLableValue(),
            jgmc: this.$refs['bmref'].getLableName(),
            yhid: this.userId
          },
          roles: roles
        }
        let resData = await this.$api.bgCheckApi.editUserInfo(params)
        if (resData.success) {
          this.dialogVisible = false
          this.$emit('refreshAgGrid')
        } else {
          this.$message({
            message: resData.prompMessage,
            type: 'warning'
          })
        }
      }

      this.isAlllegality = false
    }
  }
}
