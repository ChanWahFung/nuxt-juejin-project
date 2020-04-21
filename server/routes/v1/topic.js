const Router = require('koa-router')
const router = new Router()
const request = require('../../request')
const validator = require('../../middleware/validator')
const config = require('../../request/config')

/**
 * 获取话题列表
 * @param {string} sortType - 排序
 * @param {number} page - 页码
 * @param {number} pageSize - 条数
 */
router.get('/list', validator({
  sortType: { type: 'enum', enum: ['hot', 'new'], required: true },
  page: { 
    type: 'string', 
    required: true,
    validator: (rule, value) => Number(value) > 0,
    message: 'page 需传入正整数'
  },
  pageSize: { 
    type: 'string', 
    required: true,
    validator: (rule, value) => Number(value) > 0,
    message: 'pageSize 需传入正整数'
  },
}), async (ctx, next) => {
  const options = {
    url: 'https://short-msg-ms.juejin.im/v1/topicList',
    method: "GET",
    params: {
      device_id: config.deviceId,
      src: 'web',
      token: config.token,
      uid: config.uid,
      sortType: ctx.query.sortType,
      page: ctx.query.page - 1,
      pageSize: ctx.query.pageSize
    }
  };
  let { body } = await request(options)
  ctx.body = body
})

/**
 * 获取已关注话题列表
 * @param {string} after
 * @param {number} page - 页码
 * @param {number} pageSize - 条数
 */
router.get('/followedList', validator({
  after: { type: 'string', required: true },
  page: { 
    type: 'string', 
    required: true,
    validator: (rule, value) => Number(value) > 0,
    message: 'page 需传入正整数'
  },
  pageSize: { 
    type: 'string', 
    required: true,
    validator: (rule, value) => Number(value) > 0,
    message: 'pageSize 需传入正整数'
  },
}), async (ctx, next) => {
  const options = {
    url: 'https://short-msg-ms.juejin.im/v1/topicList/followed',
    method: "GET",
    params: {
      device_id: config.deviceId,
      src: 'web',
      token: config.token,
      uid: config.uid,
      after: ctx.query.after,
      page: ctx.query.page - 1,
      pageSize: ctx.query.pageSize
    }
  };
  let { body } = await request(options)
  ctx.body = body
})

// 关注话题逻辑共有
function followTopics(ctx){
  let action = ctx.method === 'PUT' ? 'follow' : 'unfollow'
  let idField = ctx.method === 'PUT' ? 'topicIds' : 'topicId'
  const options = {
    url: 'https://short-msg-ms.juejin.im/v1/topic/'+action,
    method: 'POST',
    body: {
      uid: config.uid,
      device_id: config.deviceId,
      src: 'web',
      token: config.token,
      [idField]: ctx.request.body.topicIds
    },
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  };
  return request(options)
}

/**
 * 关注话题
 * @param {string} topicId 
 */
router.put('/follow', validator({
  topicIds: { type: 'string', required: true }
}), async (ctx, next) => {
  let { body, res } = await followTopics(ctx)
  console.log(res)
  ctx.body = body
})

/**
 * 取消关注话题
 * @param {string} topicId 
 */
router.delete('/follow', validator({
  topicIds: { type: 'string', required: true }
}), async (ctx, next) => {
  let { body, res } = await followTopics(ctx)
  console.log(res)
  ctx.body = body
})



module.exports = router