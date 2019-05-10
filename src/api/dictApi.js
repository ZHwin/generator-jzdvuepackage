import request from '@/utils/request'
export default {
  /**
   *获取字典数据
   *
   * @param {*} dictName  字典名
   * @returns
   */
  getDictData (dictName) {
    let params = { zddm: dictName }
    return request.get('/t-sys-zdnr/getZdnr', params)
  },
  /**
   *获取字典tree
   *
   * @param {*} dictName  字典名
   * @returns
   */
  async getDictTree (dictName) {
    let params = { zddm: dictName }
    let resdata = await request.get('/t-sys-zdnr/getZdTree', params)
    let sortdata = alasql(`select * from ? order by id `, [resdata])
    return sortdata
  }
}
