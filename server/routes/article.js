const Router = require('koa-router')
const router = new Router()
const request = require('../request')
const config = require('../request/config')

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
  ctx.body = await request(options);
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
      operationName: "", 
      query: "", 
      variables: { 
        first: ctx.query.first || 20, 
        after: ctx.query.after || '',
        order: ctx.query.order || "POPULAR"
      }, 
      extensions: { query: { id: "21207e9ddb1de777adeaca7a2fb38030" } } 
    }
  };
  ctx.body = await request(options)
})

router.get('/userPost', async (ctx, next) => {
  const options = {
    url: 'https://timeline-merger-ms.juejin.im/v1/get_entry_by_self',
    method: "GET",
    params: { 
      src: "web",
      uid: config.uid,
      device_id: config.deviceId,
      token: config.token,
      targetUid: ctx.query.targetUid,
      type: ctx.query.type || 'post',
      limit: ctx.query.limit || 20,
      before: ctx.query.before,
      order: ctx.query.order || 'createdAt'
    }
  };
  ctx.body = await request(options)
})

router.get('/relatedEntry', async (ctx, next) => {
  const options = {
    url: 'https://timeline-merger-ms.juejin.im/v1/get_related_entry',
    method: "GET",
    params: { 
      src: "web",
      uid: config.uid,
      device_id: config.deviceId,
      token: config.token,
      limit: ctx.query.limit || 5,
      entryId: ctx.query.entryId
    }
  };
  ctx.body = await request(options)
})

router.get('/recommendEntryByTagIds', async (ctx, next) => {
  const options = {
    url: 'ttps://post-storage-api-ms.juejin.im/v1/getRecommendEntryByTagIds',
    method: "GET",
    params: { 
      src: "web",
      uid: config.uid,
      device_id: config.deviceId,
      token: config.token,
      tagIds: ctx.query.tagIds
    }
  };
  ctx.body = await request(options)
})

module.exports = router