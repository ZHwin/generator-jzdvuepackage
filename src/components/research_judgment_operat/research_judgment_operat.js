export default {
  name: 'ResearchJudgmentOperat',
  data () {
    return {
      isQsOrFkUserRole: false, // 是否是签收或者反馈的角色
      isSpUserRole: false, // 是否是审批的角色
      sPVisble: false, // 审批是否可见
      qSVisble: false, // 签收是否可见
      fKVisble: false // 反馈是否可见
    }
  },
  mounted () {
    this.isQsOrFkUserRole = JSON.parse(
      sessionStorage.getItem('loginUserRoles')
    ).includes('ROLE_GWYJ_QS')
    this.isSpUserRole = JSON.parse(
      sessionStorage.getItem('loginUserRoles')
    ).includes('ROLE_GWYJ_SP')
    let nodeData = this.params.node.data
    this.sPVisble = this.isSpUserRole && nodeData.zt === '3'
    this.qSVisble = this.isQsOrFkUserRole && nodeData.zt === '1'
    this.fKVisble =
      this.isQsOrFkUserRole && (nodeData.zt === '2' || nodeData.zt === '4')
  },
  methods: {
    detail () {
      this.params.context.componentParent.detail(this.params.node)
    },
    approval () {
      this.params.context.componentParent.approval(this.params.node)
    },
    signing () {
      this.params.context.componentParent.signing(this.params.node)
    },
    feedBack () {
      this.params.context.componentParent.feedBack(this.params.node)
    }
  }
}
