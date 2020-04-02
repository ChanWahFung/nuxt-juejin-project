const moment = require('moment');
moment.locale('zh-CN');

export function formatTime (time) {
  const date = new Date(time)
  if (date == 'Invalid Date') {
    return ''
  }
  return moment([date.getFullYear(), date.getMonth(), date.getDate(), date.getHours(), date.getMinutes()]).fromNow()
}

export function formatDate (format, timestamp) {
  if (!timestamp) {
    return ''
  }
  return moment(timestamp).format(format)
}