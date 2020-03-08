const LRU = require('lru-cache')
const cachePage = new LRU({
  max: 100, // 缓存队列长度
  maxAge: 1000 * 60 // 缓存1分钟
})
export default function (req, res, next) {
  const url = req._parsedOriginalUrl
  const pathname = url.pathname
  // 通过路由判断，只有首页才进行缓存
  if (['/'].includes(pathname)) {
    const existsHtml = cachePage.get('homeData')
    if (existsHtml) {
      return res.end(existsHtml.html, 'utf-8')
    } else {
      res.original_end = res.end
      // 重写res.end
      res.end = function (data) {
        if (res.statusCode === 200) {
          // 设置缓存
          cachePage.set('homeData', { html: data })
        }
        // 最终返回结果
        res.original_end(data, 'utf-8')
      }
    }
  }
  next()
}