const Router = require('koa-router')
const router = new Router()
const request = require('../request')
const config = require('../request/config')

router.get('/multiUser', async (ctx, next)=>{
  const options = {
    url: 'https://lccro-api-ms.juejin.im/v1/get_multi_user',
    method: "GET",
    params: {
      uid: config.uid,
      device_id: config.deviceId,
      token: config.token,
      src: 'web',
      ids: ctx.query.ids,
      cols: ''
    }
  };
  ctx.body = await request(options);
})

router.get('/notification', async (ctx, next)=>{
  const options = {
    url: 'https://ufp-api-ms.juejin.im/v1/getUserNotification',
    method: "GET",
    params: {
      uid: config.uid,
      token: config.token,
      src: 'web',
      before: ctx.query.before || ''
    }
  };
  ctx.body = await request(options);
})

router.get('/isCurrentUserFollowed', async (ctx, next)=>{
  const options = {
    url: 'https://follow-api-ms.juejin.im/v1/isCurrentUserFollowed',
    method: "GET",
    params: {
      currentUid: ctx.query.currentUid,
      targetUids: ctx.query.targetUids,
      src: 'web',
    }
  };
  ctx.body = await request(options);
})

router.get('/recommendCard', async (ctx, next)=>{
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
        limit: ctx.query.limit || 10, 
        excluded: []
      },
      extensions: {query: {id: "b031bf7f8b17b1a173a38807136cc20e"}},
    }
  };
  ctx.body = await request(options);
})

module.exports = router