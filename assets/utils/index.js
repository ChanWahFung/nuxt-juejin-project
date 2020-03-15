function formatNumber (n) {
  n = n.toString()
  return n[1] ? n : '0' + n
}

export function formatTime (time) {
  const nowDate = new Date()
  const date = new Date(time)
  // 文章发布时间对象
  const dateObj = {
    year: date.getFullYear(),
    month: date.getMonth() + 1,
    day: date.getDate(),
    hour: date.getHours(),
    min: date.getMinutes(),
    sec: date.getSeconds()
  }
  // 该对象用于标记
  const timeFlag = {
    day: 1000 * 60 * 60 * 24, // 1天
    hour: 1000 * 60 * 60, // 1小时
    min: 1000 * 60 // 1分钟
  }
  // 当前时间减去发布时间的差值
  const disparity = nowDate.getTime() - date.getTime()
  // 大于30天
  if (disparity >= timeFlag.day * 30) {
    return `${formatNumber(dateObj.month)}月${formatNumber(dateObj.day)}日`
  }
  // 大于一天 小于30天
  if (disparity >= timeFlag.day && disparity < timeFlag.day * 30) {
    return `${Math.floor(disparity / 8.64e7)}天前`
  }
  // 大于1小时  小于一天
  if (disparity >= timeFlag.hour && disparity < timeFlag.day) {
    return `${Math.floor(disparity / 3.6e6)}小时前`
  }
  // 5分钟以上   1小时内
  if (disparity >= timeFlag.min * 5 && disparity < timeFlag.hour) {
    return `${Math.floor(disparity / 6e4)}分钟前`
  }
  // 5分钟内
  if (disparity < timeFlag.min * 5) {
    return `刚刚`
  }
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
  let formatNumber = (n) => n > 10 ? n : '0' + n
  let res = format
    .replace('Y', dateInfo.Y)
    .replace('M', dateInfo.M)
    .replace('D', dateInfo.D)
    .replace('h', formatNumber(dateInfo.h))
    .replace('m', formatNumber(dateInfo.m))
    .replace('s', formatNumber(dateInfo.s))
  return res
}