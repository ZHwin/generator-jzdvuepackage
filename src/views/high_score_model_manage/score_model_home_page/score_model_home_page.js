export default {
  name: 'ScoreModelHomePage',
  /**
   *dom加载完成后
   *
   */
  async mounted () {
    this.AgeChart()
    this.CategoryChart()
    let suspectData = await this.$api.highScoreApi.getHighMainList(1, 10)
    let arry = []
    // 赋值取到的数据条数
    this.listNum = suspectData.records.length
    suspectData.records.forEach(item => {
      let msg = {
        name: item.xm,
        idNum: item.sfzh,
        score: item.scroe,
        level: item.wxjb,
        color: '#' + item.wxjbColor,
        judge: item.qksm
      }
      arry.push(msg)
    })
    // 赋值给xyrData
    this.xyrData = arry
    // 获取高中低圆形的宽度
    this.widthData = this.$refs.totalleft.offsetWidth
  },
  beforeDestroy () {
    if (!this.ageChart) {
      return
    }
    this.ageChart.dispose()
    this.ageChart = null
    if (!this.categoryChart) {
      return
    }
    this.categoryChart.dispose()
    this.categoryChart = null
  },
  /**
   *定义数据
   *
   * @returns
   */
  data () {
    return {
      ageChart: null,
      categoryChart: null,
      widthData: '',
      carouselScrollHeight: '',
      listNum: '',
      limtNumber: '',
      classOption: {
        step: 0.5,
        limitMoveNum: 10,
        openTouch: false
      },
      activities: [
        {
          content: '王大伟和张力在新浪网吧上网',
          timestamp: '2018-04-01 20:46',
          size: 'normal',
          icon: 'el-icons icon-on_internet',
          color: '#52ADF4'
        },
        {
          content: '马飞和李雪飞在如家入住',
          timestamp: '2018-04-03 20:46',
          icon: 'el-icons icon-room',
          color: '#27C151',
          size: 'normal'
        },
        {
          content: '舒洪铭和李明在D1507,去无锡',
          timestamp: '2018-04-05 20:46',
          icon: 'el-icons icon-by_together',
          color: '#F46054',
          size: 'normal'
        }
      ],
      xyrData: [
        // {
        //     name: '王大伟',
        //     idCard: '420000000000000000',
        //     address: '上海市普陀区金沙江路1518弄',
        //     level:'高',
        //     judge:'有吸毒史并有驾驶证',
        //     color:'red'
        // }
      ]
    }
  },
  methods: {
    /**
     *年龄分布的echarts
     *
     */
    AgeChart () {
      this.ageChart = this.$echarts.init(document.getElementById('echarts-age'))
      this.ageChart.setOption({
        tooltip: {
          trigger: 'axis',
          formatter: ' {b} {a}: {c} (起)'
        },
        calculable: true,
        grid: {
          left: '5%',
          right: '5%',
          top: '15%',
          bottom: '5%',
          containLabel: true
        },
        xAxis: [
          {
            type: 'category',
            name: '',
            // show:false,
            data: ['18以下', '18-30', '31-40', '41-50', '50以上'],
            axisLabel: {
              show: true,
              textStyle: {
                color: '#000',
                fontSize: 12
              }
            },
            axisTick: {
              show: false
            },
            axisLine: {
              show: false,
              lineStyle: {
                type: 'solid',
                color: '#202844', // 左边线的颜色
                width: '1' // 坐标线的宽度
              }
            }
          }
        ],
        yAxis: [
          {
            type: 'value',
            name: '',
            axisLabel: {
              formatter: '{value}',
              textStyle: {
                color: '#000'
              }
            },
            splitLine: {
              show: true,
              //  改变轴线颜色
              lineStyle: {
                color: '#A9A9A9'
              }
            },
            axisTick: {
              show: false
            },
            axisLine: {
              show: false,
              lineStyle: {
                type: 'solid',
                color: '#202844', // 左边线的颜色
                width: '1' // 坐标线的宽度
              }
            }
          }
        ],
        series: [
          {
            itemStyle: {
              normal: {
                color: '#53AEF4',
                lineStyle: {
                  // color:'#F78585'
                }
              }
            },
            name: '',
            type: 'bar',
            barWidth: 20,
            stack: 'age',
            data: [22, 118, 115, 110, 18]
          }
        ]
      })
    },
    /**
     *案件类别的echarts
     *
     */
    CategoryChart () {
      this.categoryChart = this.$echarts.init(
        document.getElementById('echarts-category')
      )

      this.categoryChart.setOption({
        title: {
          text: '',
          subtext: '',
          itemGap: 20
        },
        tooltip: {
          trigger: 'item',
          formatter: '{b}: {c} 起 ({d}%)'
        },
        series: [
          {
            name: '',
            type: 'pie',
            radius: ['40%', '60%'],
            center: ['50%', '50%'],
            avoidLabelOverlap: false,
            label: {
              normal: {
                show: true,
                //   formatter: "{b}: {c} 起"
                formatter: '{b}：{c}起 \n\n',
                borderWidth: 20,
                padding: [0, -20],
                textStyle: {
                  fontSize: 12,
                  color: '#000000'
                }
              },

              emphasis: {
                show: true,
                textStyle: {
                  fontSize: '16',
                  fontWeight: 'nomarl'
                }
              }
            },
            labelLine: {
              normal: {
                show: true
              }
            },
            data: [
              { value: 21, name: '抢劫财物' },
              { value: 20, name: '入室盗窃' },
              { value: 20, name: '诈骗' },
              { value: 25, name: '绑架勒索' },
              { value: 31, name: '打架斗殴' }
            ],
            color: ['#F35F53', '#E2DF1E', '#F39454', '#53AEF4', '#2CE357']
          }
        ]
      })
    },
    /**
     *格式化时间
     *
     * @param {*} params
     * @returns
     */
    formatTime (params) {
      if (params.data.szsj) {
        return params.data.szsj.replace(/T/g, ' ')
      }
    },
    /**
     *重置方法
     *
     */
    resetTask (event) {
      // 清空任务名称的值
      this.nameInpVal = ''
      this.sfzhInpVal = ''
      this.rwmcInpVal = ''
      this.gzdwInpVal = ''
      this.gzbmInpVal = ''
      this.gzgwInpVal = ''
      this.hjdxzInpVal = ''
      this.sjhmInpVal = ''
      this.rybhInpVal = ''
      this.qjcsTypeVal = ''
      this.$refs['taskName'].ClearInput()
      // 判断是否点击的重置按钮
      if (event !== undefined) {
        // 隐藏审查通过的提示和下面的grid列表
        this.reviewPassVisible = false
        this.gridShow = false
      }
    },
    /**
     *详情页面跳转
     *
     * @param {*} rowNode
     */
    detailPage (rowNode) {
      let rowDataZj = rowNode.data.zj
      // 跳转新页面
      let routeUrl = this.$router.resolve({
        path: '/review-detail',
        query: { rowDataZj: rowDataZj }
      })
      window.open(routeUrl.href, '_blank')
    }
  }
}
