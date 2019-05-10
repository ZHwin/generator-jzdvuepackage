import { myLocalStorage } from './myLocalStorage.js'
// localstarge保存的天数
import config from '../config'
const TokenKey = 'Admin-Token'

/**
 *
 *获取token
 * @export
 * @returns
 */
export function getToken () {
  const token = myLocalStorage.getItem(TokenKey)
  if (token) return token
  return false
}
/**
 *设置token
 *
 * @export
 * @param {*} token
 * @returns
 */
export function setToken (token) {
  return myLocalStorage.setItem(TokenKey, token, {
    expires: config.cookieExpires || 1
  })
}

export function removeToken () {
  return myLocalStorage.removeItem(TokenKey)
}
