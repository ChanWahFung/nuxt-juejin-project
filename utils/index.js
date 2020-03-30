const moment = require('moment');
moment.locale('zh-CN');
function formatNumber (n) {
  n = n.toString()
  return n[1] ? n : '0' + n
}

export function formatTime (time) {
  const date = new Date(time)
  return moment([date.getFullYear(), date.getMonth(), date.getDate(), date.getHours(), date.getMinutes()]).fromNow()
}

export function formatDate (format = 'Y-M-D h:m', timestamp = Date.now()) {
  if (!timestamp){
    return ''
  }
  const date = new Date(timestamp)
  const dateInfo = {
    Y: date.getFullYear(),
    M: date.getMonth() + 1,
    D: date.getDate(),
    h: date.getHours(),
    m: date.getMinutes(),
    s: date.getSeconds()
  }
  let res = format
    .replace('Y', dateInfo.Y)
    .replace('M', dateInfo.M)
    .replace('D', dateInfo.D)
    .replace('h', formatNumber(dateInfo.h))
    .replace('m', formatNumber(dateInfo.m))
    .replace('s', formatNumber(dateInfo.s))
  return res
}