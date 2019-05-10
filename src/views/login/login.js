import { mapActions } from 'vuex'
import { getToken } from '@utils/auth'
import { JITGWExtInterface } from './pnxclient'
import axios from 'axios'
import url from '@config/setUrl'
export default {
  name: 'Login',
  data () {
    const validateUsername = (rule, value, callback) => {
      if (!value) {
        callback(new Error('请输入正确的用户名'))
      } else {
        callback()
      }
    }
    const validatePassword = (rule, value, callback) => {
      if (value.length < 2) {
        callback(new Error('密码不能少于6位数'))
      } else {
        callback()
      }
    }
    return {
      loginLoading1: false,
      loginLoading2: false,
      loginTxt: '登陆',
      pkiloginTxt: 'PKI登陆',
      loginForm: {
        username: '024448',
        password: '11'
      },
      loginRules: {
        username: [
          { required: true, trigger: 'blur', validator: validateUsername }
        ],
        password: [
          { required: true, trigger: 'blur', validator: validatePassword }
        ]
      },
      passwordType: 'password',
      initParam:
        '<?xml version="1.0" encoding="utf-8"?><authinfo><liblist><lib type="SKF" version="1.1" dllname="ZXNhZmlucy5kbGw="><algid val="SHA1" sm2_hashalg="SM3" /></lib></liblist></authinfo>',
      QRCodeAuth: '',
      original: '',
      original_data: '',
      signResult: '' // 签名结果
    }
  },
  mounted () {
    $(this.$refs['usernameref'].$el)
      .find('input')[0]
      .addEventListener('keydown', this.passwordFoucs)
    $(this.$refs['passwordref'].$el)
      .find('input')[0]
      .addEventListener('keydown', this.loginFoucs)
  },
  // destroyed() {
  //   $(this.$refs["usernameref"].$el).find("input")[0].removeEventListener("keydown", this.passwordFoucs);
  //   $(this.$refs["passwordref"].$el).find("input")[0].removeEventListener("keydown", this.loginFoucs)
  // },
  methods: {
    ...mapActions(['Login', 'GetUserInfo']),

    /**
     *密码图标
     *
     */
    showPwd () {
      if (this.passwordType === 'password') {
        this.passwordType = ''
      } else {
        this.passwordType = 'password'
      }
    },
    /**
     *密码框 获取焦点
     *
     */
    passwordFoucs (e) {
      if (e.keyCode === 13) {
        $($(this.$refs['passwordref'].$el).find('input')).focus()
      }
    },
    loginFoucs (e) {
      if (e.keyCode === 13) {
        this.handleSubmit()
      }
    },

    /**
     *登陆
     *
     */
    handleSubmit () {
      this.$refs.loginform.validate(async valid => {
        if (valid) {
          this.loginLoading1 = true
          this.loginTxt = '登陆中'
          let username = this.loginForm.username
          let password = this.loginForm.password
          // //登陆成功后获取用户信息
          try {
            await this.Login({ username, password })
            if (this.$store.state.token) {
              this.loginLoading1 = false
              this.loginTxt = '登陆'
              this.$router.push({ name: this.$config.homeName })
            } else {
              this.loginLoading1 = false
              this.loginTxt = '登陆'
              this.$message({
                message: '用户名或密码错误!',
                type: 'error'
              })
            }
          } catch (error) {
            this.loginLoading1 = false
            this.loginTxt = '登陆'
          }
        }
      })
    },
    /**
     *pki登陆
     *
     */
    async pkiSubmit () {
      JITGWExtInterface.Init()
      // pki登陆初始化化控件
      // 请求随机码
      try {
        let kjpass = await axios({
          url: '/pass',
          method: 'get',
          baseURL: url.pkiUrl
        })
        this.QRCodeAuth = kjpass.QRCodeAuth
        this.original = kjpass.original
        this.original_data = kjpass.original_data
        this.doDataProcess(this.initParam)
      } catch (error) {
        this.$message.error(error.message)
      }
    },

    /**
     *根据原文和证书产生认证数据包
     *
     * @param {*} initParam
     * @returns
     */
    async doDataProcess (initParam) {
      // 证书版本者主题
      var signSubject = '' // document.getElementById("rootCADN").value;

      if (this.original === '') {
        alert('认证原文不能为空!')
        return false
      }
      this.signResult = this.detachSignStr(
        initParam,
        this.original,
        signSubject
      )

      if (this.signResult) {
        this.loginLoading2 = true
        this.pkiloginTxt = '登陆中'
        let form = new FormData()
        form.append('authMode', 'cert')
        form.append('original', this.original)
        form.append('signed', this.signResult)
        try {
          let Name = await axios({
            url: '/checkSign',
            method: 'post',
            baseURL: url.pkiUrl,
            headers: {
              'Content-Type': 'multipart/form-data'
            },
            data: form
          })
          let username = Name.username
          let password = 'pki'
          try {
            await this.Login({ username, password })
            if (getToken()) {
              this.loginLoading2 = false
              this.pkiloginTxt = '登陆'
              this.$router.push({ name: this.$config.homeName })
            } else {
              this.loginLoading2 = false
              this.pkiloginTxt = '登陆'
              this.$message({
                message: '用户名或密码错误!',
                type: 'error'
              })
            }
          } catch (error) {
            this.loginLoading2 = false
            this.pkiloginTxt = '登陆'
          }
        } catch (error) {
          this.$message.error(error.message)
        }
      }
    },
    /**
     * 根据原文和证书产生认证数据包

     参数说明：authContent：认证原文
     参数说明：signSubject：证书版发者主题
     *
     * @param {*} initParam
     * @param {*} authContent
     * @param {*} signSubject
     * @returns
     */
    detachSignStr (initParam, authContent, signSubject) {
      // 验证认证原文不能为空
      if (authContent === '') {
        this.$message({
          message: '认证原文不能为空!',
          type: 'warning'
        })
        return false
      }
      try {
        JITGWExtInterface.GetVersion()
      } catch (e) {
        this.$message({
          message: '未安装控件，请进行安装控件!',
          type: 'error'
        })
        return false
      }

      JITGWExtInterface.ClearFilter()

      // 初始化vctk控件
      JITGWExtInterface.Initialize('', initParam)
      // 控制证书为一个时，不弹出证书选择框
      JITGWExtInterface.SetChooseSingleCert(1)
      // 生成签名信息
      let signResult = JITGWExtInterface.P7SignString(authContent, true, true)

      if (JITGWExtInterface.GetLastError() !== 0) {
        if (
          JITGWExtInterface.GetLastError() === 3758096386 ||
          JITGWExtInterface.GetLastError() === 2148532334
        ) {
          this.$message({
            message: '用户取消操作!',
            type: 'warning'
          })
          return false
        } else if (
          JITGWExtInterface.GetLastError() === -536870815 ||
          JITGWExtInterface.GetLastError() === 3758096481
        ) {
          this.$message({
            message: '没有找到有效的证书，如果使用的是KEY，请确认已经插入key!',
            type: 'warning'
          })
          return
        }
      }
      // 返回签名结果
      return signResult
    }
  }
}
