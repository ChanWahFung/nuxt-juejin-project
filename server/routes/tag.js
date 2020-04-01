const Router = require('koa-router')
const router = new Router()
const request = require('../request')
const config = require('../request/config')

router.get('/detail', async(ctx, next) => {
  const options = {
    url: 'https://gold-tag-ms.juejin.im/v1/tag/Vue.js',
    method: "GET",
    headers: {
      'X-Juejin-Src': 'web',
      'X-Juejin-Client': config.deviceId,
      'X-Juejin-Token': config.token,
      'X-Juejin-Uid': config.uid
    }
  };
  ctx.body = await request(options)
})

router.get('/entry', async(ctx, next) => {
  const options = {
    url: 'https://timeline-merger-ms.juejin.im/v1/get_tag_entry',
    method: "GET",
    headers: {
      'X-Juejin-Src': 'web',
      'X-Juejin-Client': config.deviceId,
      'X-Juejin-Token': config.token,
      'X-Juejin-Uid': config.uid
    },
    params: {
      'src': 'web',
      'uid': config.uid,
      'device_id': config.deviceId,
      'token': config.token,
      'tagId': ctx.query.tagId,
      'page': ctx.query.page || 0,
      'pageSize': ctx.query.pageSize || 20,
      'sort': ctx.query.sort || 'rankIndex',
    }
  };
  ctx.body = await request(options)
})

module.exports = router