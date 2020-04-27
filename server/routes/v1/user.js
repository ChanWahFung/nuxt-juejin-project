const Router = require('koa-router')
const router = new Router()
const request = require('../../request')
const validator = require('../../middleware/validator')

/**
 * 获取用户信息
 * @param {string} ids - 需要获取的用户id（多个以|分割）
 */
router.get('/multiUser', validator({
  ids: { type: 'string', required: true }
}), async (ctx, next)=>{
  const headers = ctx.headers
  const options = {
    url: 'https://lccro-api-ms.juejin.im/v1/get_multi_user',
    method: "GET",
    params: {
      uid: headers['x-uid'],
      device_id: headers['x-device-id'],
      token: headers['x-token'],
      src: 'web',
      ids: ctx.query.ids,
      cols: ''
    }
  };
  let { body } = await request(options)
  ctx.body = body
})

/**
 * 获取用户消息
 * @param {string} before - 下一页标识 beforeAtString
 */
router.get('/notification', validator({
  before: { type: 'string' }
}), async (ctx, next)=>{
  const headers = ctx.headers
  const options = {
    url: 'https://ufp-api-ms.juejin.im/v1/getUserNotification',
    method: "GET",
    params: {
      src: 'web',
      uid: headers['x-uid'],
      token: headers['x-token'],
      before: ctx.query.before || ''
    }
  };
  let { body } = await request(options)
  ctx.body = body
})

/**
 * 是否关注用户
 * @param {string} currentUid
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
  let { body } = await request(options)
  ctx.body = body
})

/**
 * 是否点赞文章
 * @param {string} entryId - 文章entryId
 */
router.get('/isArticleLike', validator({
  entryId: { type: 'string', required: true }
}), async (ctx, next) => {
  const headers = ctx.headers
  const options = {
    url: 'https://user-like-wrapper-ms.juejin.im/v1/user/like/entry/'+ctx.query.entryId,
    method: 'GET',
    headers: {
      'X-Juejin-Src': 'web',
      'X-Juejin-Client': headers['x-device-id'],
      'X-Juejin-Token': headers['x-token'],
      'X-Juejin-Uid': headers['x-uid'],
    }
  };
  let { body } = await request(options)
  ctx.body = body
})

// 点赞逻辑共用
function like(ctx){
  const headers = ctx.headers
  const options = {
    url: 'https://user-like-wrapper-ms.juejin.im/v1/user/like/entry/'+ctx.request.body.entryId,
    method: ctx.method,
    headers: {
      'X-Juejin-Src': 'web',
      'X-Juejin-Client': headers['x-device-id'],
      'X-Juejin-Token': headers['x-token'],
      'X-Juejin-Uid': headers['x-uid'],
    }
  };
  return request(options)
}

/**
 * 点赞 - 文章
 * @param {string} entryId - 文章objectId
 */
router.put('/like', validator({
  entryId: { type: 'string', required: true }
}), async (ctx, next) => {
  const { body, statusCode, headers } = await like(ctx)
  ctx.status = statusCode
  ctx.set('Content-Type', headers['content-type'])
  ctx.body = body
})

/**
 * 取消点赞 - 文章
 * @param {string} entryId - 文章objectId
 */
router.delete('/like', validator({
  entryId: { type: 'string', required: true }
}), async (ctx, next) => {
  const { body, statusCode, headers } = await like(ctx)
  ctx.status = statusCode
  ctx.set('Content-Type', headers['content-type'])
  ctx.body = body
})

// 未读消息状态逻辑共有
function userNotificationNum(ctx, url){
  const headers = ctx.headers
  const options = {
    url: 'https://ufp-api-ms.juejin.im/v1/'+url,
    method: "GET",
    params: {
      uid: headers['x-uid'],
      token: headers['x-token'],
      src: 'web'
    }
  };
  return request(options)
}

/**
 * 获取未读消息数量
 */
router.get('/userNotificationNum', async (ctx, next)=>{
  let { body } = await userNotificationNum(ctx, 'getUserNotificationNum')
  ctx.body = body
})

/**
 * 设置未读消息数量
 */
router.put('/userNotificationNum', async (ctx, next)=>{
  let { body } = await userNotificationNum(ctx, 'setUserNotificationNum')
  ctx.body = body
})

// 关注用户逻辑共有
function follow(ctx, url){
  const headers = ctx.headers
  const options = {
    url: 'https://follow-api-ms.juejin.im/v1/'+url,
    method: "GET",
    params: {
      follower: ctx.request.body.follower,
      followee: ctx.request.body.followee,
      device_id: headers['x-device-id'],
      token: headers['x-token'],
      src: 'web'
    }
  };
  return request(options)
}

/**
 * 关注
 * @param {string} follower - 关注者id
 * @param {string} followee - 被关注者id
 */
router.put('/follow', validator({
  follower: { type: 'string', required: true },
  followee: { type: 'string', required: true }
}), async (ctx, next)=>{
  let { body } = await follow(ctx, 'follow')
  ctx.body = body
})

/**
 * 取消关注
 * @param {string} follower - 关注者id
 * @param {string} followee - 被关注者id
 */
router.delete('/follow', validator({
  follower: { type: 'string', required: true },
  followee: { type: 'string', required: true }
}), async (ctx, next)=>{
  let { body } = await follow(ctx, 'unfollow')
  ctx.body = body
})

module.exports = router