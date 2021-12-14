const Router = require('koa-router')
const router = new Router()
const request = require('../../request')
const { apiJuejin } = require('../../config/url')
const validator = require('../../middleware/validator')

/**
 * 沸点（推荐、热门、关注）
 * @param {string} type
 * @param {number} limit - 条数
 * @param {string} sort_type - 排序
 * @param {string} cursor - 分页标识
 */
router.get('/list', validator({
  type: { type: 'enum', enum: ['recommend', 'hot', 'follow'], required: true },
  limit: { 
    type: 'string', 
    required: true,
    validator: (rule, value) => Number(value) > 0,
    message: 'limit 需传入正整数'
  },
  sort_type: { type: 'string' },
  cursor: { type: 'string' }
}), async (ctx, next) => {
  const data = ctx.query
  const options = {
    url: `${apiJuejin}recommend_api/v1/short_msg/${data.type}`,
    method: 'POST'
  }
  // 不同类型获取不同参数
  const strategyDatas = {
    recommend: {
      cursor: data.cursor || "0",
      id_type: 4,
      limit: Number(data.limit),
      sort_type: Number(data.sort_type) || 300,
    },
    hot: {
      cursor: data.cursor || "0",
      id_type: 4,
      limit: Number(data.limit),
      sort_type: Number(data.sort_type) || 200,
    },
    follow: {
      cursor: data.cursor || "0",
      id_type: 4,
      limit: Number(data.limit)
    }
  }
  const strategyData = strategyDatas[data.type]
  // 设置参数
  strategyData && (options.body = strategyData)
  let { body } = await request(options)
  ctx.body = body
})

/**
 * 单条沸点
 * @param {string} msg_id
 */
router.get('/pinDetail', validator({
  msg_id: { type: 'string', required: true }
}), async (ctx, next) => {
  const data = ctx.query
  const options = {
    url: `${apiJuejin}content_api/v1/short_msg/detail`,
    method: 'POST',
    body: {
      msg_id: data.msg_id
    }
  }
  let { body } = await request(options)
  ctx.body = body
})

// 点赞共有逻辑（弃用）
function like(ctx) {
  const headers = ctx.headers
  const action = ctx.method === 'PUT' ? 'like' : 'unlike'
  const options = {
    url: 'https://short-msg-ms.juejin.im/v1/' + action,
    method: 'GET',
    params: {
      uid: headers['x-uid'],
      device_id: headers['x-device-id'],
      token: headers['x-token'],
      src: 'web',
      msgId: ctx.request.body.pinId
    }
  }
  return request(options)
}

/**
 * 沸点点赞（弃用）
 */
router.put('/like', validator({
  pinId: { type: 'string', required: true }
}), async (ctx, next) => {
  let { body } = await like(ctx)
  ctx.body = body
})

/**
 * 沸点取消点赞（弃用）
 */
router.delete('/like', validator({
  pinId: { type: 'string', required: true }
}), async (ctx, next) => {
  let { body } = await like(ctx)
  ctx.body = body
})

module.exports = router