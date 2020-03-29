const Router = require('koa-router')
const router = new Router()
const request = require('../request')
const config = require('../request/config')

function dealArticList(data_){
  let data = {}
  let res = JSON.parse(data_)
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
  }else{
    data = res
  }
  return data
}

router.get('/detail', async (ctx,next)=>{
  const options = {
    url: 'https://post-storage-api-ms.juejin.im/v1/getDetailData',
    method: "GET",
    params: {
      uid: config.uid,
      device_id: config.deviceId,
      token: config.token,
      src: 'web',
      type: ctx.query.type,
      postId: ctx.query.postId
    }
  };
  const data = await request(options);
  ctx.body = data;
})

router.get('/indexList', async (ctx, next) => {
  ctx.set('Cache-Control', 'max-age=60')
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
        "first": ctx.query.first || 20, 
        "after": ctx.query.after || '',
        "order": ctx.query.order || "POPULAR"
      }, 
      "extensions": { "query": { "id": "21207e9ddb1de777adeaca7a2fb38030" } } 
    }
  };
  let data = await request(options)
  ctx.body = dealArticList(data);
})

router.get('/search', async (ctx, next) => {
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
        type: "ALL",
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