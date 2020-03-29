const Router = require('koa-router')
const router = new Router()
const request = require('../request')
const config = require('../request/config')

router.get('/entry', async (ctx, next) => {
  const options = {
    url: 'https://web-api.juejin.im/query',
    method: "POST",
    headers: {
      'X-Agent': 'Juejin/Web',
      'X-Legacy-Device-Id': config.deviceId,
      'X-Legacy-Token': config.token,
      'X-Legacy-Uid': config.uid
    },
    body: { 
      "operationName": "",
      "query": "",
      "variables": {
        type: ctx.query.type || 'ALL',
        query: ctx.query.keyword,
        after: ctx.query.after || '',
        period: ctx.query.period || 'ALL',
        first: ctx.query.first || 20
      },
      "extensions": { "query": { "id": "a53db5867466eddc50d16a38cfeb0890" } } 
    }
  };
  let data = await request(options)
  ctx.body = dealArticList(data);
})

module.exports = router