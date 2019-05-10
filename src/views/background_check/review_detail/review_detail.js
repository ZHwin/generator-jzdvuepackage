import { dictTransle } from '@utils/tools'
import Watermark from '@utils/watermark'
export default {
  name: 'ReviewDetail',
  async mounted () {
    // 获取单位字典
    this.dictData = await this.$api.dictApi.getDictData(
      'DM00011,DE00007,BJSC_SCJG,BJSC_SCJG_QJCS'
    )
    // 获取主键
    console.log(sessionStorage.getItem('rowDataZj'))
    // let zj = this.$route.query.rowDataZj
    let zj = sessionStorage.getItem('rowDataZj')
    if (!zj) {
      this.$router.push({ name: 'SecuritySingleReview' })
      return
    }

    // 获取详情页面的数据
    let reviewDetailData = await this.$api.bgCheckApi.reviewDetai(zj)
    console.log(reviewDetailData)
    if (reviewDetailData.scType === '01') {
      // 翻译安保的审查结论
      await dictTransle(
        'BJSC_SCJG',
        this.dictData,
        [reviewDetailData],
        'scjg',
        'scjgName'
      )
    } else {
      // 翻译强戒的审查结论
      await dictTransle(
        'BJSC_SCJG_QJCS',
        this.dictData,
        [reviewDetailData],
        'scjg',
        'scjgName'
      )
    }

    // 身份证号 背景信息  审查结论
    this.detailSfzh = reviewDetailData.scrsfzh
    this.detailRylb = reviewDetailData.rylbbj
    this.detailBjxx = reviewDetailData.bjxx
    // reviewDetailData.scjgName == "通过" ? this.detailScjl == " " : this.detailScjl = reviewDetailData.scjgName;
    this.detailScjl = reviewDetailData.scjgName

    // 根据详情页数据中身份证号获取常住人口信息
    let populationData = await this.$api.bgCheckApi.residentPopulation(
      this.detailSfzh
    )
    // 翻译字典(民族、性别、审查结果)
    await dictTransle(
      'DM00011',
      this.dictData,
      [populationData],
      'mz',
      'nation'
    )
    await dictTransle('DE00007', this.dictData, [populationData], 'xb', 'sex')

    this.detailPhoto = populationData.xp
    this.detailName = populationData.xm
    this.detailSex = populationData.sex
    this.detailCsrq = populationData.csrq
    this.detailCsrq =
      populationData.csrq.substring(0, 4) +
      '-' +
      populationData.csrq.substring(4, 6) +
      '-' +
      populationData.csrq.substring(6, 8)
    this.detailMz = populationData.nation
    this.detailDz = populationData.zzxz
    Watermark.set(this.detailSfzh)
  },
  data () {
    return {
      detailPhoto: '',
      detailName: '',
      detailSfzh: '',
      detailSex: '',
      detailCsrq: '',
      detailMz: '',
      detailDz: '',
      detailRylb: '',
      detailBjxx: '',
      detailScjl: ''
    }
  },
  methods: {
    // 打印本页
    printPage () {
      window.print()
    }
  }
}
