const moment = require('moment');
moment.locale('zh-CN');

module.exports = {
  formatTime(time) {
    const date = new Date(time)
    if (date == 'Invalid Date') {
      return ''
    }
    return moment([date.getFullYear(), date.getMonth(), date.getDate(), date.getHours(), date.getMinutes()]).fromNow()
  },
  formatDate(format, timestamp) {
    if (!timestamp) {
      return ''
    }
    return moment(timestamp).format(format)
  },
  toObject(json) {
    let res = {}
    try {
      res = JSON.parse(json)
    } catch (error) {
      console.error(error)
    }
    return res
  }
}