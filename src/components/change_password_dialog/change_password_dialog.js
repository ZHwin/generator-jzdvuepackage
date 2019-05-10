export default {
  name: 'ChangePasswordDialog',

  data () {
    let validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'))
      } else if (value !== this.form.password) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    }
    return {
      dialogVisible: false,
      form: {
        password: '',
        password_confirm: '',
        phoneNumber: ''
      },
      formLabelWidth: '100px',
      rules: {
        password_confirm: [{ validator: validatePass, trigger: 'blur' }]
      }
    }
  },
  methods: {
    submit () {
      this.$refs.form.validate(async valid => {
        if (valid) {
          await this.$api.userApi.updatePassword(
            this.$store.state.loginName,
            this.form.password_confirm,
            this.form.phoneNumber
          )
          this.$message({
            message: '密码修改成功！请重新登录',
            type: 'success'
          })
          this.$store.dispatch('LogOut')
          this.$router.push({ path: '/login' })
          // updatePassword
        }
      })
    },
    openDialog () {
      this.dialogVisible = true
    }
  }
}
