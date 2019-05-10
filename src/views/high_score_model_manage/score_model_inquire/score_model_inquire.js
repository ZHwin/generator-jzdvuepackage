export default {
  name: 'ScoreModelInquire',
  data () {
    return {
      idNumber: '',
      name: '',
      // radioColor: 0,
      badgeStyle: 'badgeStyle',
      badgeFont: 'badgeFont',
      displyFlex: 'displyFlex',
      flexColumnBetween: 'flexColumnBetween',
      userdata: [],
      curPage: '', // 当前页码
      pageSize: '', // 每页条数
      totalNum: '', // 总条数
      pages: '' // 总共页数
    }
  },
  async mounted () {
    let pageData = await this.getAllMainListData('1', '10')
    this.userdata = pageData.records
  },
  methods: {
    /**
     *获取高危预警人员列表
     *
     * @param {*} curPage
     * @param {*} pageSize
     * @returns
     */
    async getAllMainListData (curPage, pageSize, ...args) {
      let data = await this.$api.highScoreApi.getHighMainList(
        curPage,
        pageSize,
        args[0],
        args[1],
        args[2]
      )
      this.curPage = data.current
      this.pages = data.pages
      this.pageSize = data.size
      this.totalNum = data.total
      return data
    },

    // levelColor(name) {
    //     let names = {
    //         0: () => {
    //             return ' ';
    //         },
    //         1: () => {
    //             return '红色';
    //         },
    //         2: () => {
    //             return '橙色';
    //         },
    //         3: () => {
    //             return '黄色';
    //         },
    //         4: () => {
    //             return '蓝色';
    //         }

    //     };
    //     if (typeof names[name] !== 'function') {
    //         return false;
    //     }
    //     return names[name]();
    // },

    /**
     * 查询功能
     *
     */
    async search () {
      // let lvelColor = this.levelColor(this.radioColor);
      let pageData = await this.getAllMainListData(
        this.curPage,
        this.pageSize,
        this.idNumber,
        this.name
      )
      this.userdata = pageData.records
      this.$message({
        message: '操作成功!',
        type: 'success'
      })
    },

    async reset () {
      let pageData = await this.getAllMainListData(this.curPage, this.pageSize)
      this.userdata = pageData.records
      this.idNumber = ''
      this.name = ''
    },
    // 主表分页相关操作
    async handleSizeChange (val) {
      let pageData = await this.getAllMainListData(1, val)
      this.userdata = pageData.records
    },
    async handleCurrentChange (val) {
      let pageData = await this.getAllMainListData(val, this.pageSize)
      this.userdata = pageData.records
    },
    async prevClick (val) {
      let pageData = await this.getAllMainListData(val, this.pageSize)
      this.userdata = pageData.records
    },
    async nextClick (val) {
      let pageData = await this.getAllMainListData(val, this.pageSize)
      this.userdata = pageData.records
    },

    /**
     *
     *跳转研判详情页面
     * @param {*} sfzh
     */
    researchJudgment (id) {
      let routeUrl = this.$router.resolve({
        path: '/research-judgment-detail'
      })
      // 储存需要使用的参数
      sessionStorage.setItem('ypId', id)

      window.open(routeUrl.href, '_blank')
    }
  }
}
