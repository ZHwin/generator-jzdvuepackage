import request from '@/utils/request'
export default {
  /**
   *获取所有任务管理列表
   *
   * @param {*} size  每页条数
   * @param {*} current 当前页
   * @returns
   */
  getAllTaskList (size, current) {
    let params = {
      size: size,
      current: current
    }
    return request.get('/tb-bjsc-rwmc/all', params)
  },
  /**
   *任务新增
   *
   * @param {*} tbBjscRwmc
   * @returns
   */
  addNewTask (tbBjscRwmc) {
    return request.post('/tb-bjsc-rwmc/insertRwmc', tbBjscRwmc)
  },
  /**
   *
   *任务设置 删除列表中一条数据
   * @param {*} listId 对应列表中数据的ID
   * @returns
   */
  deleteListData (listId) {
    return request.delete('/tb-bjsc-rwmc/deleteRw/' + listId)
  },
  /**
   *单人审查进入页面时默认显示的列表
   *
   * @param {*} params
   * @returns
   */
  singleReviewDefault (params) {
    return request.get('/tb-bjsc-rysc/bjscDrscCx', params)
  },
  /**
   *
   *单人审查中的提交
   * @param {*} scType 安保或者强戒的类型
   * @param {*} tbBjscRysc
   * @returns
   */
  singleReviewData (tbBjscRysc) {
    return request.post('/tb-bjsc-rysc/drscSave', tbBjscRysc)
  },
  /**
   *批量审查提交
   *
   * @param {*} from
   * @returns
   */
  submitBatchCheck (from) {
    return request.uploadFileRequest('/tb-bjsc-ryplsc/savePlsc', from)
  },
  /**
   *
   *批量审查查询
   * @param {*} current
   * @param {*} size
   * @param {*} scType
   */
  searchBatchCheck (current, size, scType, ...args) {
    let params = {
      current: current,
      size: size,
      scType: scType,
      scph: args[0],
      rwmc: args[1]
    }
    return request.get('/tb-bjsc-ryplsc/selectPlscList', params)
  },
  /**
   *全库查询
   *
   * @param {*} params
   */
  libraryQuery (params) {
    return request.post('/tb-bjsc-ryplsc/saveQkcx', params)
  },
  /**
   *安保禁毒单人审查详情页面
   *
   * @param {*} zj 单人审查里面的主键
   * @returns
   */
  reviewDetai (zj) {
    let params = {
      zj: zj
    }
    return request.get('/tb-bjsc-rysc/scjgDetail', params)
  },
  /**
   *常住人口
   *
   * @param {*} idNumber 身份证号
   */
  residentPopulation (idNumber) {
    let params = {
      sfzh: idNumber
    }
    return request.get('/tb-bjsc-rysc/czrk', params)
  },
  /**
   *获取任务名称 不传值则获取所有任务名称
   *
   * @param {*} id id
   * @param {*} rwmc  任务名称
   * @param {*} sfky 是否可用
   * @param {*} szr 设置人
   * @param {*} szrjgdm 设置人机构代码
   * @param {*} szrsfzh 设置人身份证号码
   * @param {*} szsj 设置时间
   * @param {*} xgsj 修改时间
   * @returns
   */
  getAllTaskData (...args) {
    let params = {
      id: args[0],
      rwmc: args[1],
      sfky: args[2],
      szr: args[3],
      szrjgdm: args[4],
      szrsfzh: args[5],
      szsj: args[6],
      xgsj: args[7]
    }
    return request.get('/tb-bjsc-rwmc/allByRwmc', params)
  },
  /** ******************用户设置 api start******************* */
  /**
   * 用户设置管理列表
   *
   * @param {*} current  当前页
   * @param {*} size     每页条数
   * @param {*} args     可选参数
   */
  getUserSetList (current, size, ...args) {
    let params = {
      current: current,
      size: size,
      xm: args[0],
      jh: args[1],
      idno: args[2],
      jgdm: args[3],
      sfbhxjdm: args[4],
      roleType: args[5]
    }
    // name, policeId, idNumber, unit, userRole, isIncludSubUnit
    return request.get('/account/selectAccountList', params)
  },
  /**
   *获取对应用户角色列表
   *
   * @param {*} pk
   */
  getCurUserRoles (...args) {
    let params = {
      pk: args[0]
    }
    return request.get('/account/selectAccountByPk', params)
  },
  /**
   *获取所有角色列表
   *
   */
  getUserRoles () {
    return request.get('/role/list')
  },
  /**
   *删除用户信息
   *
   * @param {*} pk
   * @returns
   */
  delUserInfo (pk) {
    return request.delete(`/account/deleteAccount/${pk}`)
  },

  /** 重置密码
   *
   *
   * @param {*} pk
   * @returns
   */
  resetUserPassword (pk) {
    let params = {
      pk: pk
    }
    return request.put(`/account/resetPassWord`, params)
  },
  /**
   *新增用户信息
   *
   * @param {*} obj
   * @returns
   */
  addUserInfo (obj) {
    return request.post('/account/insertAccount', JSON.stringify(obj))
  },

  /**
   *修改用户信息
   *
   * @param {*} obj
   * @returns
   */
  editUserInfo (obj) {
    return request.put('/account/updateAccount', JSON.stringify(obj))
  },

  /** ******************用户设置 api end******************* */

  /** **************字典管理api start************* */
  /**
   *获取主表所有内容
   *
   * @param {*} current  当前页
   * @param {*} size   每页条数
   * @returns
   */
  getMainDictMangerAll (current, size, ...args) {
    let params = {
      current: current,
      size: size,
      czddm: args[0],
      czdmc: args[1]
    }
    return request.get('/t-sys-zdnr/selectAllZdmc', params)
  },

  /**
   *获取从表详细数据
   *
   * @param {*} current 当前页
   * @param {*} size 每页条数
   * @param {*} unitid 单位代码
   * @returns
   */
  getSubDictMangerDetail (current, size, unitid) {
    let params = {
      current: current,
      size: size,
      czddm: unitid
    }
    return request.get('/t-sys-zdnr/selectAllZdnr', params)
  },

  /**
   *删除主表字典
   *
   * @param {*} dictId 字典代码
   */
  delMainDictRow (dictId) {
    return request.delete(`/t-sys-zdnr/deleteZdmc/${dictId}`)
  },
  /**
   *增加主表数据
   *
   * @param {*} tSysZdmc
   * @returns
   */
  addMainDictRow (tSysZdmc) {
    return request.post('/t-sys-zdnr/insertZdmc', tSysZdmc)
  },

  /**
   *修改主表数据
   *
   * @param {*} tSysZdmc
   * @returns
   */
  editMainDictRow (tSysZdmc) {
    return request.put('/t-sys-zdnr/updateZdmc', tSysZdmc)
  },
  /**
   *增加从表数据
   *
   * @param {*} tSysZdnr
   * @returns
   */
  addDetailDictRow (tSysZdnr) {
    return request.post('/t-sys-zdnr/insertZdnr', tSysZdnr)
  },
  /**
   *修改从表数据
   *
   * @param {*} tSysZdnr
   * @returns
   */
  editDetailDictRow (tSysZdnr) {
    return request.put('/t-sys-zdnr/updateZdnr', tSysZdnr)
  },
  /**
   *删除字典内容
   *
   * @param {*} Id
   * @returns
   */
  delDetailDictRow (Id) {
    return request.delete(`/t-sys-zdnr/deleteZdnr/${Id}`)
  },

  /** **************字典管理api end************* */

  /**
   *统计查询的统计
   *
   * @param {*} parameter
   * @returns
   */
  countQuery (parameter) {
    return request.get('/tb-bjsc-rysc/bjscTjcx', parameter)
  },
  /**
   *统计查询的详情
   *
   * @param {*} parameter
   */
  countQueryDetail (parameter) {
    return request.get('/tb-bjsc-rysc/bjscRycx', parameter)
  },
  /**
   *批量浏览查询
   *
   * @param {*} parameter
   */
  batchBrowsingQuery (parameter) {
    return request.get('/tb-bjsc-ryplsc/plcxTj', parameter)
  },
  /**
   *批量浏览查询双击数据的详情页
   *
   * @param {*} parameter
   */
  batchBrowsingQueryDetail (parameter) {
    return request.get('/tb-bjsc-ryplsc/bjscRycx', parameter)
  }
}
