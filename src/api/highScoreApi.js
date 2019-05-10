import request from '@/utils/request'
export default {
  /**
   *通过身份证获取人员基本信息
   *
   * @param {*} idNum 身份证号
   */
  basicInformation (idNum) {
    let params = {
      sfzh: idNum
    }
    return request.get('/tb-gwmx-jg/selectCzrkBySfzh', params)
  },
  /**
   *高危预警结果查询
   *
   * @param {*} current  当前页
   * @param {*} size     每页条数
   * @param {*} args
   * @returns
   */
  getHighMainList (current, size, ...args) {
    let params = {
      current: current,
      size: size,
      sfzh: args[0],
      xm: args[1]
    }
    return request.get('/tb-gwmx-jg/gwmxJgList', params)
  },

  /**
   *
   *通过ID查询高危预警结果
   *
   * @param {*} id
   */
  getSorceDetailById (id) {
    let params = {
      id: id
    }
    return request.get('/tb-gwmx-jg/selectGwmxJgById', params)
  },

  /**
   *通过GLID查询研判流程集合
   *
   * @param {*} id
   */
  getHightSorceListById (id) {
    let params = {
      glid: id
    }
    return request.get('/tb-ypfx-lcxx/selectLcxxByGlid', params)
  },
  /**
   *研判分析--发起
   *
   * @param {*} glid   高危预警结果主键
   * @param {*} qsdw   接收单位
   * @param {*} qsdwmc  接收单位名称
   * @param {*} yqqssj  要求签收时间
   * @param {*} fqnr   发起内容
   * @returns
   */
  launchHightSorceProcess (glid, qsdw, qsdwmc, yqqssj, fqnr) {
    let params = {
      glid: glid,
      qsdw: qsdw,
      qsdwmc: qsdwmc,
      yqqssj: yqqssj,
      fqnr: fqnr,
      zt: 1
    }

    return request.post('/tb-ypfx-lcxx/insertTbYpfxLcxx', params)
  },
  /**
   *反馈
   *
   * @param {*} jlbh
   * @param {*} fknr
   * @returns
   */
  feedBackHightSorceProcess (jlbh, fknr) {
    let params = {
      jlbh: jlbh,
      fknr: fknr
    }
    return request.post('/tb-ypfx-lcxx/tbYpfxLcxxFk', params)
  },
  /**
   *签收
   *
   * @param {*} jlbh
   * @param {*} xxid
   * @returns
   */
  signHightSorceProcess (jlbh, xxid) {
    let params = {
      jlbh: jlbh,
      xxid: xxid
    }
    return request.post('/tb-ypfx-lcxx/tbYpfxLcxxQs', params)
  },

  /**
   *审批
   *
   * @param {*} jlbh
   * @param {*} spyj
   * @param {*} spzt
   * @returns
   */
  approvalHightSorceProcess (jlbh, spyj, spzt) {
    let params = {
      jlbh: jlbh,
      spyj: spyj,
      spzt: spzt
    }
    return request.post('/tb-ypfx-lcxx/tbYpfxLcxxSq', params)
  },

  /**
   *查询当前用户接收消息集合
   *
   * @param {*} params
   * @returns
   */
  pendingItems (params) {
    return request.get('/t-sys-msg/selectMsgList', params)
  },
  /**
   *获取研判详细流程
   *
   * @param {*} jlbh
   */
  getYPDetailProcess (jlbh) {
    let params = {
      jlbh: jlbh
    }
    return request.get('/tb-ypfx-lcxx/selectLcxxByJlbh', params)
  },

  /**
   *查询当前用户未处理的消息数
   *
   */
  getPendingNum () {
    return request.get('/t-sys-msg/selectMsgNum')
  }
}
