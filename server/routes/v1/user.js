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
  let { body:res } = await request(options)
  ctx.body = res;
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
  let { body:res } = await request(options)
  ctx.body = res;
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
  let { body:res } = await request(options)
  ctx.body = res;
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
  let { body:res } = await request(options)
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

// 点赞逻辑共用
function like(ctx, method){
  const options = {
    url: 'https://user-like-wrapper-ms.juejin.im/v1/user/like/entry/'+ctx.request.body.entryId,
    method,
    headers: {
      'X-Juejin-Src': 'web',
      'X-Juejin-Client': config.deviceId,
      'X-Juejin-Token': config.token,
      'X-Juejin-Uid': config.uid
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
  let { body:res, statusCode, headers } = await like(ctx, 'PUT')
  ctx.status = statusCode
  ctx.set('Content-Type', headers['content-type'])
  ctx.body = res
})

/**
 * 取消点赞 - 文章
 * @param {string} entryId - 文章objectId
 */
router.delete('/like', validator({
  entryId: { type: 'string', required: true }
}), async (ctx, next) => {
  let { body:res, statusCode, headers } = await like(ctx, 'DELETE')
  ctx.status = statusCode
  ctx.set('Content-Type', headers['content-type'])
  ctx.body = res
})

// 未读消息状态逻辑共有
function userNotificationNum(url){
  const options = {
    url: 'https://ufp-api-ms.juejin.im/v1/'+url,
    method: "GET",
    params: {
      uid: config.uid,
      token: config.token,
      src: 'web'
    }
  };
  return request(options)
}

/**
 * 获取未读消息数量
 */
router.get('/getUserNotificationNum', async (ctx, next)=>{
  let { body:res } = await userNotificationNum('getUserNotificationNum')
  ctx.body = res;
})

/**
 * 设置未读消息数量
 */
router.get('/setUserNotificationNum', async (ctx, next)=>{
  let { body:res } = await userNotificationNum('setUserNotificationNum')
  ctx.body = res;
})


// 关注逻辑共有
function follow(ctx, url){
  const options = {
    url: 'https://follow-api-ms.juejin.im/v1/'+url,
    method: "GET",
    params: {
      follower: ctx.query.follower,
      followee: ctx.query.followee,
      device_id: config.deviceId,
      token: config.token,
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
router.get('/follow', validator({
  follower: { type: 'string', required: true },
  followee: { type: 'string', required: true }
}), async (ctx, next)=>{
  let { body:res } = await follow(ctx, 'follow')
  ctx.body = res;
})

/**
 * 取消关注
 * @param {string} follower - 关注者id
 * @param {string} followee - 被关注者id
 */
router.get('/unfollow', validator({
  follower: { type: 'string', required: true },
  followee: { type: 'string', required: true }
}), async (ctx, next)=>{
  let { body:res } = await follow(ctx, 'unfollow')
  ctx.body = res;
})

module.exports = router