import { dictTransle } from '@utils/tools'
import { pic } from './pic_base64'
import ResearchJudgmentDialog from '@components/research_judgment_dialog'
import ResearchJudgmentOperat from '@components/research_judgment_operat'
export default {
  name: 'ResearchJudgmentDetail',
  components: {
    ResearchJudgmentDialog,
    'research-judgment-operat': ResearchJudgmentOperat
  },
  filters: {
    bornDateFormat: value => {
      if (!value) return ''
      if (value !== '未知') {
        value = value.toString()
        return `${value.substring(0, 4)}-${value.substring(
          4,
          6
        )}-${value.substring(6, 8)}`
      }
      return value
    }
  },
  async mounted () {
    let ypId = sessionStorage.getItem('ypId')
    if (!ypId) {
      this.$router.push({ name: 'ScoreModelInquire' })
      return false
    }
    // 请求研判得分
    this.detailSorce = await this.$api.highScoreApi.getSorceDetailById(ypId)
    // 性别字典于状态字典
    this.sexAndStatusDict = await this.$api.dictApi.getDictData(
      'DE00007,YPFX_ZT'
    )
    var peopleInfo = null
    if (this.detailSorce.sfzh === '无' || this.detailSorce.sfzh === '') {
      peopleInfo = {
        xm: this.detailSorce.xm,
        xb: '0',
        csrq: '未知',
        zzxz: '未知',
        xp: pic
      }
    } else {
      // 请求对应的人员的详情
      peopleInfo = await this.$api.highScoreApi.basicInformation(
        this.detailSorce.sfzh
      )
    }

    // 请求性别字典
    let detailDataList = await dictTransle(
      'DE00007',
      this.sexAndStatusDict,
      [peopleInfo],
      'xb',
      'sex'
    )
    this.detailData = detailDataList[0]
    // 获取流程详情列表
    await this.refreshLCAglist()
  },
  data () {
    return {
      idNumber: '', // 身份证号
      id: '', // 根据id查得分
      sexAndStatusDict: '',
      detailData: '',
      detailSorce: '',
      level: '高',
      totalCcoreStyle: {
        bgColor: '#D33325',
        diameter: '60px',
        fontColor: '#fff',
        fontWeight: 600,
        fontSize: '16px',
        borderWidth: '2px',
        borderColor: '#E26D63'
      },
      fqArr: '',
      qsArr: '',
      fkArr: '',
      tgArr: '',
      thArr: '',
      scoreStyle: {
        bgColor: '#CE7132',
        diameter: '40px',
        fontColor: '#fff',
        fontWeight: 600,
        fontSize: '16px',
        borderWidth: '2px',
        borderColor: '#E26D63'
      },
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
            valueGetter: params => {
              return params.node.rowIndex + 1
            }
          },
          {
            headerName: '发起人',
            field: 'fqrxm'
          },
          {
            headerName: '发起时间',
            field: 'fqsj'
          },
          {
            headerName: '发起内容',
            field: 'fqnr'
          },
          { headerName: '发起单位', field: 'fqdwmc' },
          { headerName: '状态', field: 'ztName' },
          {
            headerName: '操作',
            width: 160,
            cellRendererFramework: 'research-judgment-operat'
          }
        ],
        rowData: []
      }
    }
  },
  methods: {
    /**
     *刷新aggrid流程列表
     *
     */
    async refreshLCAglist () {
      let list = await this.$api.highScoreApi.getHightSorceListById(
        this.detailSorce.id
      )
      let aglist = await dictTransle(
        'YPFX_ZT',
        this.sexAndStatusDict,
        list,
        'zt',
        'ztName'
      )
      this.gridOptions.api.setRowData(aglist)
      this.gridOptions.api.sizeColumnsToFit()
    },
    /**
     *研判详情流程
     *
     * @param {*} node
     */
    async detail (node) {
      let jlbh = node.data.jlbh
      let data = await this.$api.highScoreApi.getYPDetailProcess(jlbh)
      this.fqArr = alasql(`select * from ? where title='发起'`, [data])
      this.qsArr = alasql(`select * from ? where title='签收'`, [data])
      this.fkArr = alasql(`select * from ? where title='反馈'`, [data])
      this.tgArr = alasql(`select * from ? where title='审批'`, [data])
      this.thArr = alasql(`select * from ? where title='退回'`, [data])
    },
    /**
     *
     *审批
     */
    approval (node) {
      this.$refs['researchDialog'].openDialog('approval', node)
    },
    /**
     *发起
     *
     */
    launch (glid) {
      this.$refs['researchDialog'].openDialog('launch', this.detailSorce)
    },
    /**
     *
     *签收
     */
    async signing (node) {
      let resData = await this.$api.highScoreApi.signHightSorceProcess(
        node.data.jlbh,
        node.data.xxid
      )
      if (resData.success) {
        this.$message({
          message: resData.prompMessage,
          type: 'success'
        })
        await this.refreshLCAglist()
      }
    },
    /**
     *反馈
     *
     */
    feedBack (node) {
      this.$refs['researchDialog'].openDialog('feedBack', node)
    }
  }
}
