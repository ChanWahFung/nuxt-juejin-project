function formatNumber (n) {
  n = n.toString()
  return n[1] ? n : '0' + n
}

export function formatTime (time) {
  time = parseInt(time)
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
  const disparity = nowDate.getTime() - time
  // 大于一天
  if (disparity > timeFlag.day) {
    return `${formatNumber(dateObj.month)}月${formatNumber(dateObj.day)}日`
  }
  // 大于6小时 小于一天
  if (disparity > timeFlag.hour * 6 && disparity < timeFlag.day) {
    return `${formatNumber(dateObj.hour)}:${formatNumber(dateObj.min)}`
  }
  // 大于1小时  小于6小时
  if (disparity > timeFlag.hour && disparity < timeFlag.hour * 6) {
    return `${Math.floor((nowDate.getTime() - date.getTime()) / 3600000)}小时前`
  }
  // 1小时内 5分钟以上
  if (disparity > timeFlag.min * 5 && disparity < timeFlag.hour) {
    return `${Math.floor((nowDate.getTime() - date.getTime()) / 60000)}分钟前`
  }
  // 5分钟内
  if (disparity < timeFlag.min * 5) {
    return `刚刚`
  }
}