const Router = require('koa-router')
const router = new Router()
const request = require('../../request')
const validator = require('../../middleware/validator')
const config = require('../../request/config')

/**
 * 获取用户信息
 * @param {string} ids - 需要获取的用户id（多个以|分割）
 */
router.get('/multiUser', validator({
  ids: { type: 'string', required: true }
}), async (ctx, next)=>{
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

/**
 * 获取用户消息
 * @param {string} before - 下一页标识 beforeAtString
 */
router.get('/notification', validator({
  before: { type: 'string' }
}), async (ctx, next)=>{
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

/**
 * 检查是否关注用户
 * @param {staring} currentUid
 * @param {string} targetUids
 */
router.get('/isCurrentUserFollowed', validator({
  currentUid: { type: 'string', required: true },
  targetUids: { type: 'string', required: true }
}), async (ctx, next)=>{
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

/**
 * 获取推荐作者
 * @param {number} limit - 条数
 */
router.get('/recommendCard', validator({
  limit: { 
    type: 'string', 
    required: true,
    validator: (rule, value) => Number(value) > 0,
    message: 'limit 需传入正整数'
  }
}), async (ctx, next)=>{
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
  let res = await request(options);
  try {
    ctx.body = {
      s: res.data.recommendationCard.items ? 1 : 0,
      d: res.data.recommendationCard.items
    } 
  } catch (error) {
    ctx,body = {
      s: 0,
      d: []
    }
  }
})

/**
 * 获取未读消息
 */
router.get('/getUserNotificationNum', async (ctx, next)=>{
  const options = {
    url: 'https://ufp-api-ms.juejin.im/v1/getUserNotificationNum',
    method: "GET",
    params: {
      uid: config.uid,
      token: config.token,
      src: 'web'
    }
  };
  ctx.body = await request(options);
})

module.exports = router