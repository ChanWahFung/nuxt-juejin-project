const Router = require('koa-router')
const router = new Router()
const request = require('../request')
const config = require('../request/config')

router.get('/entry', async (ctx, next) => {
  if (ctx.fresh) {
    ctx.status = 304;
  }
  const options = {
    url: 'https://comment-wrapper-ms.juejin.im/v1/comments/entry/'+ctx.query.entryId,
    method: "GET",
    headers: {
      'X-Juejin-Src': 'web',
      'X-Juejin-Client': config.deviceId,
      'X-Juejin-Token': config.token,
      'X-Juejin-Uid': config.uid,
    },
    params: { 
      createdAt: ctx.query.createdAt || '',
      rankType: ctx.query.rankType || 'new',
      pageSize: ctx.query.pageSize || '5',
    }
  };
  ctx.body = await request(options);
})

router.get('/reply', async (ctx, next) => {
  const options = {
    url: 'https://comment-wrapper-ms.juejin.im/v1/comments/entry/'+ctx.query.entryId+'/comment/'+ctx.query.commentId,
    method: "GET",
    headers: {
      'X-Juejin-Src': 'web',
      'X-Juejin-Client': config.deviceId,
      'X-Juejin-Token': config.token,
      'X-Juejin-Uid': config.uid,
    },
    params: { 
      pageNum: ctx.query.pageNum,
      pageSize: ctx.query.pageSize
    }
  };
  ctx.body = await request(options);
})

module.exports = router