import { mapActions } from 'vuex'
import ChangePasswordDialog from '@components/change_password_dialog'
import screenfull from 'screenfull'
export default {
  name: 'MainHeader',
  data () {
    return {
      isFullscreen: false
    }
  },
  components: {
    ChangePasswordDialog

  },
  mounted () {
    this.fullInit()
  },
  methods: {
    ...mapActions(['LogOut']),
    fullTogle () {
      if (!screenfull.enabled) {
        this.$message({
          message: '你的电脑不支持全屏！',
          type: 'warning'
        })
        return false
      }
      screenfull.toggle()
    },
    fullChange () {
      this.isFullscreen = screenfull.isFullscreen
    },
    fullInit () {
      if (screenfull.enabled) {
        screenfull.on('change', this.fullChange)
      }
    },
    destroy () {
      if (screenfull.enabled) {
        screenfull.off('change', this.fullChange)
      }
    },
    async logout () {
      await this.LogOut()
      this.$router.push({ name: 'Login' })
    },
    backHome () {
      this.$router.push({ path: '/' })
    },
    changePassword () {
      this.$refs['dialogref'].openDialog()
    },

    dictManage () {
      let routeUrl = this.$router.resolve({
        name: 'DictManage'
      })
      window.open(routeUrl.href, '_blank')
    },

    userSetting () {
      let routeUrl = this.$router.resolve({
        path: '/user-setting'
      })
      window.open(routeUrl.href, '_blank')
    }
  }
}
