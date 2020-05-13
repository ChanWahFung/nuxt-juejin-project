const moment = require('moment');
moment.locale('zh-CN');

export default {
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
   * 匹配文本中的url
   * @param {string} str
   * @return {array} 
   */
  matchUrl(str) {
    if (typeof str !== 'string') {
      return []
    }
    return str.match(/(https?|ftp|file):\/\/[-A-Za-z0-9+&@#/%?=~_|!:,.;]+[-A-Za-z0-9+&@#/%=~_|]/g) || []
  },
  /**
   * 处理文本（分割文本和链接）
   * @param {string} str
   * @return {array}
   */
  splitContentToArray(str) {
    if (typeof str !== 'string') {
      return []
    }
    let i = 1
    // 提取链接
    let urls = this.matchUrl(str)
    if (urls.length === 0) {
      return [{ id: i, type: 'text', value: str }]
    } 
    let splitContent = str.split(/(https?|ftp|file):\/\/[-A-Za-z0-9+&@#/%?=~_|!:,.;]+[-A-Za-z0-9+&@#/%=~_|]/)
    // 分隔文本和链接
    splitContent = splitContent.reduce((prev, curr) => {
      if (curr === '') {
        return prev
      }
      if (/^(https?|ftp|file)$/.test(curr)) {
        let url = urls.shift() || ''
        prev = prev.concat({ id: i++, type: 'url', value: url.length > 40 ? url.slice(0, 40) + '...' : url, url })
      } else {
        prev = prev.concat({ id: i++, type: 'text', value: curr })
      }
      return prev
    }, [])
    return splitContent
  },
  /**
   * 设置登录验证信息
   * @param {object} ctx - 服务端传入context 客户端传入this
   * @param {object} res - 登录验证信息
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
      $store = ctx.store
    }
    if ($cookies && $store) {
      const expires = $store.state.auth.cookieMaxExpires
      $cookies.set('userId', res.userId, { expires })
      $cookies.set('clientId', res.clientId, { expires })
      $cookies.set('token', res.token, { expires })
      $cookies.set('userInfo', res.user, { expires })
      $store.commit('auth/UPDATE_USERINFO', res.user)
      $store.commit('auth/UPDATE_CLIENTID', res.clientId)
      $store.commit('auth/UPDATE_TOKEN', res.token)
      $store.commit('auth/UPDATE_USERID', res.userId)
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
      $store = ctx.store
    }
    if ($cookies && $store) {
      $cookies.remove('userInfo')
      $cookies.remove('clientId')
      $cookies.remove('token')
      $cookies.remove('userId')
      $store.commit('auth/UPDATE_USERINFO', null)
      $store.commit('auth/UPDATE_CLIENTID', '')
      $store.commit('auth/UPDATE_TOKEN', '')
      $store.commit('auth/UPDATE_USERID', '')
    }
  }
}