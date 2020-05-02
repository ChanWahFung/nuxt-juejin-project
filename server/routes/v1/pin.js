const Router = require('koa-router')
const router = new Router()
const request = require('../../request')
const validator = require('../../middleware/validator')
const { toObject } = require('../../../utils')

/**
 * 沸点（推荐、热门、关注）
 * @param {string} type
 * @param {number} first - 条数
 * @param {string} after - 分页标识
 */
router.get('/list', validator({
  type: { type: 'enum', enum: ['recommended', 'hot', 'following'], required: true },
  first: { 
    type: 'string', 
    required: true,
    validator: (rule, value) => Number(value) > 0,
    message: 'first 需传入正整数'
  },
  after: { type: 'string' }
}), async (ctx, next) => {
  const headers = ctx.headers
  const options = {
    url: 'https://web-api.juejin.im/query',
    method: 'POST',
    headers: {
      'X-Agent': 'Juejin/Web',
      'X-Legacy-Device-Id': headers['x-device-id'],
      'X-Legacy-Token': headers['x-token'],
      'X-Legacy-Uid': headers['x-uid']
    }
  }
  // 不同类型获取不同参数
  const strategyDatas = {
    recommended:  {
      field: 'recommendedActivityFeed',
      body: {
        extensions: {query: {id: "249431a8e4d85e459f6c29eb808e76d0"}},
        operationName: "",
        query: "",
        variables: {
          size: ctx.query.first || 20, 
          after: ctx.query.after || '', 
          afterPosition: ""
        }
      }
    },
    hot: {
      field: 'popularPinList',
      body: {
        extensions: {query: {id: "f0a2fbbc03d4d46266e40762139c414c"}},
        operationName: "",
        query: "",
        variables: {
          after: ctx.query.after || '', 
          first: ctx.query.first || 20
        },
      }
    },
    following: {
      field: 'followingActivityFeed',
      body: {
        extensions: {query: {id: "648c28f5213f7d3601f4d5efa7fa3826"}},
        operationName: "",
        query: "",
        variables: {
          type: "MAIN", 
          after: ctx.query.after || '', 
          first: ctx.query.first || 20,
          since: new Date().toISOString()
        }
      }
    }
  }
  const strategyData = strategyDatas[ctx.query.type]
  // 设置参数
  strategyData && (options.body = strategyData.body)
  let { body } = await request(options)
  body = toObject(body)
  try {
    ctx.body = {
      s: body.data[strategyData.field].items ? 1 : 0,
      d: body.data[strategyData.field].items
    }
  } catch (error) {
    ctx.body = {
      s: 0,
      d: {},
      errors: [body]
    }
  }
})

/**
 * 沸点 - 话题列表
 * @param {string} topicId - 话题id 
 * @param {number} page - 页码
 * @param {number} pageSize - 条数
 */
router.get('/topicList', validator({
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
}), async (ctx, next) => {
  const headers = ctx.headers
  const options = {
    url: 'https://short-msg-ms.juejin.im/v1/pinList/topic',
    method: 'GET',
    params: {
      uid: headers['x-uid'],
      device_id: headers['x-device-id'],
      token: headers['x-token'],
      src: 'web',
      topicId: ctx.query.topicId,
      page: Number(ctx.query.page) + 1,
      pageSize: ctx.query.pageSize,
      sortType: 'rank',
    }
  }
  let { body } = await request(options)
  ctx.body = body
})

/**
 * 推荐沸点
 */
router.get('/hotRecommendList', async (ctx, next) => {
  const headers = ctx.headers
  const options = {
    url: 'https://short-msg-ms.juejin.im/v1/getHotRecommendList',
    method: 'GET',
    params: {
      uid: headers['x-uid'],
      device_id: headers['x-device-id'],
      token: headers['x-token'],
      src: 'web'
    }
  }
  let { body } = await request(options)
  ctx.body = body
})

/**
 * 单条沸点
 * @param {string} pinId
 */
router.get('/byId', validator({
  pinId: { type: 'string', required: true }
}), async (ctx, next) => {
  const headers = ctx.headers
  const options = {
    url: 'https://short-msg-ms.juejin.im/v1/getByID',
    method: 'GET',
    params: {
      uid: headers['x-uid'],
      device_id: headers['x-device-id'],
      token: headers['x-token'],
      src: 'web',
      msgId: ctx.query.pinId,
    }
  }
  let { body } = await request(options)
  ctx.body = body
})

// 点赞共有逻辑
function like(ctx) {
  const headers = ctx.headers
  const action = ctx.method === 'PUT' ? 'like' : 'unlike'
  const options = {
    url: 'https://short-msg-ms.juejin.im/v1/'+action,
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
 * 沸点点赞
 */
router.put('/like', validator({
  pinId: { type: 'string', required: true}
}), async (ctx, next) => {
  let { body } = await like(ctx)
  ctx.body = body
})

/**
 * 沸点取消点赞
 */
router.delete('/like', validator({
  pinId: { type: 'string', required: true}
}), async (ctx, next) => {
  let { body } = await like(ctx)
  ctx.body = body
})


module.exports = router