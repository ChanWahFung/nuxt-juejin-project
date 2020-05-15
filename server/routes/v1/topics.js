const Router = require('koa-router')
const router = new Router()
const request = require('../../request')
const validator = require('../../middleware/validator')

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
  const headers = ctx.headers
  const options = {
    url: 'https://short-msg-ms.juejin.im/v1/topicList',
    method: "GET",
    params: {
      src: 'web',
      uid: headers['x-uid'],
      device_id: headers['x-device-id'],
      token: headers['x-token'],
      sortType: ctx.query.sortType || 'hot',
      page: ctx.query.page - 1 || 0,
      pageSize: ctx.query.pageSize || 100
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
  after: { type: 'string' },
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
  const headers = ctx.headers
  const options = {
    url: 'https://short-msg-ms.juejin.im/v1/topicList/followed',
    method: "GET",
    params: {
      src: 'web',
      uid: headers['x-uid'],
      device_id: headers['x-device-id'],
      token: headers['x-token'],
      after: ctx.query.after || 0,
      page: ctx.query.page - 1 || 0,
      pageSize: ctx.query.pageSize || 100
    }
  };
  let { body } = await request(options)
  ctx.body = body
})

/**
 * 话题详情
 * @param {string} topicId - 话题id
 */
router.get('/detail', validator({
  topicId: { type: 'string', required: true }
}), async (ctx, next) => {
  const headers = ctx.headers
  const options = {
    url: 'https://short-msg-ms.juejin.im/v1/topic/'+ctx.query.topicId,
    method: "GET",
    params: {
      src: 'web',
      uid: headers['x-uid'],
      device_id: headers['x-device-id'],
      token: headers['x-token']
    }
  };
  let { body } = await request(options)
  ctx.body = body
})

/**
 * 话题详情-沸点列表
 * @param {string} topicId - 话题id
 * @param {number} page - 页码
 * @param {number} pageSize - 条数
 * @param {string} sortType - 排序（最热、最新）
 */
router.get('/pinList', validator({
  topicId: { type: 'string', required: true },
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
  sortType: {
    type: 'enum',
    enum: ['rank', 'newest']
  }
}), async (ctx, next) => {
  const headers = ctx.headers
  const options = {
    url: 'https://short-msg-ms.juejin.im/v1/pinList/topic',
    method: "GET",
    params: {
      src: 'web',
      uid: headers['x-uid'],
      device_id: headers['x-device-id'],
      token: headers['x-token'],
      topicId: ctx.query.topicId,
      page: ctx.query.page - 1 || 0,
      pageSize: ctx.query.pageSize || 20,
      sortType: ctx.query.sortType || 'rank'
    }
  };
  let { body } = await request(options)
  ctx.body = body
})

/**
 * 话题参与者列表
 * @param {string} topicId - 话题id
 * @param {number} page - 页码
 * @param {number} pageSize - 条数
 */
router.get('/attenders', validator({
  topicId: { type: 'string', required: true },
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
  }
}), async (ctx, next) => {
  const headers = ctx.headers
  const options = {
    url: 'https://short-msg-ms.juejin.im/v1/topic/attenders',
    method: "GET",
    params: {
      src: 'web',
      uid: headers['x-uid'],
      device_id: headers['x-device-id'],
      token: headers['x-token'],
      topicId: ctx.query.topicId,
      page: ctx.query.page - 1 || 0,
      pageSize: ctx.query.pageSize || 20,
    }
  };
  let { body } = await request(options)
  ctx.body = body
})

// 关注话题逻辑共有
function followTopics(ctx){
  const action = ctx.method === 'PUT' ? 'follow' : 'unfollow'
  const idField = ctx.method === 'PUT' ? 'topicIds' : 'topicId'
  const headers = ctx.headers
  const options = {
    url: 'https://short-msg-ms.juejin.im/v1/topic/'+action,
    method: 'POST',
    body: {
      src: 'web',
      uid: headers['x-uid'],
      device_id: headers['x-device-id'],
      token: headers['x-token'],
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
  let { body } = await followTopics(ctx)
  ctx.body = body
})

/**
 * 取消关注话题
 * @param {string} topicId 
 */
router.delete('/follow', validator({
  topicIds: { type: 'string', required: true }
}), async (ctx, next) => {
  let { body } = await followTopics(ctx)
  ctx.body = body
})

module.exports = router