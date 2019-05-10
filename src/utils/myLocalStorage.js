export var myLocalStorage = {
  setItem: function (key, value, exp) {
    var obj = {}
    var expires = exp.expires || null
    obj.value = value
    obj.time = new Date().getTime()

    // expires 类型
    if (expires === null) {
      delete obj.expires
    } else if (typeof expires === 'object') {
      obj.expires = expires.getTime() - obj.time
    } else if (typeof expires === 'number') {
      if ((expires | 0) !== expires) {
        throw new Error('expires must be integer number!')
      }

      // expires 小于 365、366 则，按天算。否则按时间戳算
      if (expires <= getYearDays() && expires > 0) {
        obj.expires = expires * 1000 * 60 * 60 * 24
      } else if (expires > getYearDays()) {
        obj.expires = expires
      } else if (expires <= 0) {
        this.removeItem(key)
      }
    }
    localStorage.setItem(key, JSON.stringify(obj))
  },
  getItem: function (key) {
    var obj = JSON.parse(localStorage.getItem(key))
    if (obj === 'null' || obj === null) return null
    var expires = obj.expires
    var now = new Date().getTime()
    var time = obj.time

    if (now - time >= expires || now < time) {
      localStorage.removeItem(key)
      return null
    }
    return obj.value
  },

  // 删除成功返回 true， 否则返回 false
  removeItem: function (key) {
    if (this.getItem(key) !== null) {
      localStorage.removeItem(key)

      return this.getItem(key) === null
    }
    return true
  },
  keys: function (key) {}
}
function getYearDays () {
  return new Date().getFullYear() % 4 === 0 ? 366 : 365
}
