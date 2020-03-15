const Router = require('koa-router')
const router = new Router()
const request = require('../request')
const config = require('../request/config')

router.get('/indexList', async (ctx, next) => {
  const options = {
    url: 'https://web-api.juejin.im/query',
    method: "POST",
    headers: {
      'X-Agent': 'Juejin/Web',
      'X-Legacy-Device-Id': 1583548822391,
      'X-Legacy-Token': config.token,
      'X-Legacy-Uid': config.uid
    },
    body: { 
      "operationName": "", 
      "query": "", 
      "variables": { 
        "first": ctx.query.first || 20, 
        "after": ctx.query.after || '',
        "order": ctx.query.order || "POPULAR"
      }, 
      "extensions": { "query": { "id": "21207e9ddb1de777adeaca7a2fb38030" } } 
    }
  };
  ctx._data = await request(options)
  next()
  ctx.body = ctx._data;
}, async (ctx) => {
  let data = {}
  let res = JSON.parse(ctx._data)
  if(res.data && res.data.articleFeed){
    data.pageInfo = res.data.articleFeed.items.pageInfo
    // 获取文章id
    data.list = res.data.articleFeed.items.edges.map(item=>{
      let artic_id = item.node.originalUrl.split('/').pop()
      return {
        ...item.node,
        artic_id
      }
    })
  }
  ctx._data = data
})

module.exports = router