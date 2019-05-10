export default {
  name: 'UserSettingOperat',
  mouted () {},
  data () {},
  methods: {
    updateUser () {
      this.params.context.componentParent.updateUser(this.params.node)
    },
    /**
     * 删除方法
     *
     */
    delUser () {
      this.params.context.componentParent.delUser(this.params.node)
    },
    /**
     *重置密码
     *
     */
    resetPassword () {
      this.params.context.componentParent.resetPassword(this.params.node)
    }
  }
}
