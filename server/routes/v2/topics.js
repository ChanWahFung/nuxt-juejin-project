const Router = require('koa-router')
const router = new Router()
const request = require('../../request')
const { apiJuejin } = require('../../config/url')
const validator = require('../../middleware/validator')

/**
 * 获取话题列表
 * @param {string} cursor - 分页标识
 * @param {number} limit - 条数
 * @param {string} sort_type - 排序
 */
router.get('/list', validator({
  cursor: { type: 'string' },
  limit: { 
    type: 'string', 
    required: true,
    validator: (rule, value) => Number(value) > 0,
    message: 'limit 需传入正整数'
  },
  sort_type: { type: 'string', },
}), async (ctx, next) => {
  const data = ctx.query
  const options = {
    url: `${apiJuejin}tag_api/v1/query_topic_list`,
    method: "POST",
    body: {
      cursor: data.cursor || '0',
      limit: Number(data.limit),
      sort_type: Number(data.sort_type) || 7,
    }
  };
  let { body } = await request(options)
  ctx.body = body
})

/**
 * 获取推荐话题列表
 * @param {string} cursor - 分页标识
 * @param {number} limit - 条数
 * @param {string} sort_type - 排序
 */
router.get('/recommendList', validator({
  cursor: { type: 'string' },
  limit: { 
    type: 'string', 
    required: true,
    validator: (rule, value) => Number(value) > 0,
    message: 'limit 需传入正整数'
  },
  sort_type: { type: 'string', },
}), async (ctx, next) => {
  const data = ctx.query
  const options = {
    url: `${apiJuejin}recommend_api/v1/tag/recommend_topic_list`,
    method: "POST",
    body: {
      cursor: data.cursor || '0',
      id_type: 11,
      limit: Number(data.limit),
      sort_type: Number(data.sort_type) || 0,
    }
  };
  let { body } = await request(options)
  ctx.body = body
})

/**
 * 获取已关注话题列表
 * @param {string} cursor - 分页标识
 * @param {number} limit - 条数
 * @param {string} sort_type - 排序
 */
router.get('/followedList', validator({
  cursor: { type: 'string' },
  limit: { 
    type: 'string', 
    required: true,
    validator: (rule, value) => Number(value) > 0,
    message: 'limit 需传入正整数'
  },
  sort_type: { type: 'string', },
}), async (ctx, next) => {
  const data = ctx.query
  const options = {
    url: `${apiJuejin}interact_api/v1/follow/topic_list`,
    method: "POST",
    body: {
      cursor: data.cursor || '0',
      limit: Number(data.limit),
      sort_type: Number(data.sort_type) || 4,
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
  topic_id: { type: 'string', required: true }
}), async (ctx, next) => {
  const data = ctx.query
  const options = {
    url: `${apiJuejin}tag_api/v1/query_topic_detail`,
    method: "POST",
    body: {
      topic_id: data.topic_id
    }
  };
  let { body } = await request(options)
  ctx.body = body
})

/**
 * 沸点列表（根据话题获取）
 * @param {string} topic_id - 话题id
 * @param {number} limit - 条数
 * @param {string} cursor - 分页标识
 * @param {number} sort_type - 排序（200: 热门、500: 最新）
 */
router.get('/pinList', validator({
  topic_id: { type: 'string', required: true },
  limit: {
    type: 'string', 
    required: true,
    validator: (rule, value) => Number(value) > 0,
    message: 'limit 需传入正整数'
  },
  cursor: { 
    type: 'string', 
  },
  sort_type: {
    type: 'enum',
    required: true,
    enum: ['200', '500']
  }
}), async (ctx, next) => {
  const data = ctx.query
  const options = {
    url: `${apiJuejin}recommend_api/v1/short_msg/topic`,
    method: "POST",
    body: {
      cursor: data.cursor || "0",
      id_type: 4,
      limit: Number(data.limit),
      sort_type: Number(data.sort_type),
      topic_id: data.topic_id
    }
  };
  let { body } = await request(options)
  ctx.body = body
})

/**
 * 话题参与者列表
 * @param {string} item_id - 话题id
 * @param {number} limit - 条数
 * @param {string} cursor - 分页标识
 */
router.get('/attenders', validator({
  item_id: { type: 'string', required: true },
  limit: {
    type: 'string', 
    required: true,
    validator: (rule, value) => Number(value) > 0,
    message: 'limit 需传入正整数'
  },
  cursor: { 
    type: 'string', 
  },
}), async (ctx, next) => {
  const data = ctx.query
  const options = {
    url: `${apiJuejin}interact_api/v1/follow/follower_list`,
    method: "POST",
    body: {
      cursor: data.cursor || "0",
      id_type: 11,
      item_id: data.item_id,
      limit: Number(data.limit)
    }
  };
  let { body } = await request(options)
  ctx.body = body
})

// 关注话题逻辑共有（弃用）
function followTopics(ctx){
  const action = ctx.method === 'PUT' ? 'follow' : 'unfollow'
  const idField = ctx.method === 'PUT' ? 'topicIds' : 'topicId'
  const headers = ctx.headers
  const options = {
    url: 'https://short-msg-ms.juejin.im/v1/topic/' + action,
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
 * 关注话题（弃用）
 * @param {string} topicId 
 */
router.put('/follow', validator({
  topicIds: { type: 'string', required: true }
}), async (ctx, next) => {
  let { body } = await followTopics(ctx)
  ctx.body = body
})

/**
 * 取消关注话题（弃用）
 * @param {string} topicId 
 */
router.delete('/follow', validator({
  topicIds: { type: 'string', required: true }
}), async (ctx, next) => {
  let { body } = await followTopics(ctx)
  ctx.body = body
})

module.exports = router