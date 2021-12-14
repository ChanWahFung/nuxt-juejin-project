const Router = require('koa-router')
const router = new Router()
const request = require('../../request')
const { apiJuejin } = require('../../config/url')
const validator = require('../../middleware/validator')

/**
 * 获取用户信息
 * @param {string} user_id - 用户id
 * @param {string} not_self
 */
router.get('/multiUser', validator({
  user_id: { type: 'string', required: true },
  not_self: { type: 'enum', required: true, enum: ['0', '1'] }
}), async (ctx, next) => {
  const data = ctx.query
  const options = {
    url: `${apiJuejin}user_api/v1/user/get`,
    method: "GET",
    params: {
      user_id: data.user_id,
      not_self: Number(data.not_self)
    }
  };
  let { body } = await request(options)
  ctx.body = body
})

/**
 * 获取用户消息（弃用）
 * @param {string} before - 下一页标识 beforeAtString
 */
router.get('/notification', validator({
  before: { type: 'string' }
}), async (ctx, next) => {
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
 * @param {string} ids - 用户id
 */
router.get('/isCurrentUserFollowed', validator({
  ids: { type: 'string', required: true }
}), async (ctx, next) => {
  const options = {
    url: `${apiJuejin}user_api/v1/follow/isfollowed?ids=817692379985752&type=1`,
    method: "GET",
    params: {
      ids: data.ids,
      type: 1,
    }
  };
  let { body } = await request(options)
  ctx.body = body
})

// 点赞逻辑共用（弃用）
function like(ctx){
  const headers = ctx.headers
  const options = {
    url: 'https://user-like-wrapper-ms.juejin.im/v1/user/like/entry/' + ctx.request.body.entryId,
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
 * 点赞 - 文章（弃用）
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
 * 取消点赞 - 文章（弃用）
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

// 未读消息状态逻辑共有（弃用）
function userNotificationNum(ctx, url){
  const headers = ctx.headers
  const options = {
    url: 'https://ufp-api-ms.juejin.im/v1/' + url,
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
 * 获取未读消息数量（弃用）
 */
router.get('/userNotificationNum', async (ctx, next) => {
  let { body } = await userNotificationNum(ctx, 'getUserNotificationNum')
  ctx.body = body
})

/**
 * 设置未读消息数量（弃用）
 */
router.put('/userNotificationNum', async (ctx, next) => {
  let { body } = await userNotificationNum(ctx, 'setUserNotificationNum')
  ctx.body = body
})

// 关注用户逻辑共有（弃用）
function follow(ctx, url){
  const headers = ctx.headers
  const options = {
    url: 'https://follow-api-ms.juejin.im/v1/' + url,
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
 * 关注（弃用）
 * @param {string} follower - 关注者id
 * @param {string} followee - 被关注者id
 */
router.put('/follow', validator({
  follower: { type: 'string', required: true },
  followee: { type: 'string', required: true }
}), async (ctx, next) => {
  let { body } = await follow(ctx, 'follow')
  ctx.body = body
})

/**
 * 取消关注（弃用）
 * @param {string} follower - 关注者id
 * @param {string} followee - 被关注者id
 */
router.delete('/follow', validator({
  follower: { type: 'string', required: true },
  followee: { type: 'string', required: true }
}), async (ctx, next) => {
  let { body } = await follow(ctx, 'unfollow')
  ctx.body = body
})

module.exports = router