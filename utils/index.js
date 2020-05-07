const moment = require('moment');
moment.locale('zh-CN');

module.exports = {
  /**
   * 格式化时间
   * @param {number} timestamp - 13位时间戳
   */
  formatTime(timestamp) {
    const date = new Date(timestamp)
    if (date == 'Invalid Date') {
      return ''
    }
    return moment([date.getFullYear(), date.getMonth(), date.getDate(), date.getHours(), date.getMinutes()]).fromNow()
  },
  /**
   * 格式化日期
   * @param {string} format - 格式
   * @param {number} timestamp - 13位时间戳
   */
  formatDate(format, timestamp) {
    if (!timestamp) {
      return ''
    }
    return moment(timestamp).format(format)
  },
  /**
   * json 转 object
   * @param {json} json 
   */
  toObject(json) {
    let res = {}
    try {
      res = JSON.parse(json)
    } catch (error) {
      console.error(error)
    }
    return res
  },
  /**
   * 设置登录验证信息
   * @param {object} ctx - 服务端传入context 客户端传入this
   * @param {object} res 
   */
  setAuthInfo(ctx, res) {
    let $cookies, $store
    // 客户端
    if (process.client) {
      $cookies = ctx.$cookies
      $store = ctx.$store
    }
    // 服务端
    if (process.server) {
      $cookies = ctx.app.$cookies
      $store = ctx.$store
    }
    if ($cookies && $store) {
      const expires = $store.state.auth.cookieMaxExpires
      $cookies.set('userId', res.userId, { expires })
      $cookies.set('clientId', res.clientId, { expires })
      $cookies.set('token', res.token, { expires })
      $cookies.set('userInfo', res.user, { expires })
      $store.commit('auth/updateUserInfo', res.user)
      $store.commit('auth/updateClientId', res.clientId)
      $store.commit('auth/updateToken', res.token)
      $store.commit('auth/updateUserid', res.userId)
    }
  },
  /**
   * 移除登录验证信息
   * @param {object} ctx - 服务端传入context 客户端传入this
   */
  removeAuthInfo(ctx) {
    let $cookies, $store
    // 客户端
    if (process.client) {
      $cookies = ctx.$cookies
      $store = ctx.$store
    }
    // 服务端
    if (process.server) {
      $cookies = ctx.app.$cookies
      $store = ctx.$store
    }
    if ($cookies && $store) {
      $cookies.remove('userInfo')
      $cookies.remove('clientId')
      $cookies.remove('token')
      $cookies.remove('userId')
      $store.commit('auth/updateUserInfo', null)
      $store.commit('auth/updateClientId', '')
      $store.commit('auth/updateToken', '')
      $store.commit('auth/updateUserid', '')
    }
  }
}