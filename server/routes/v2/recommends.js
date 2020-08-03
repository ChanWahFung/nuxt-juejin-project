const Router = require('koa-router')
const router = new Router()
const request = require('../../request')
const validator = require('../../middleware/validator')
const { toObject } = require('../../../utils')

/**
 * 获取推荐作者
 * @param {number} limit - 条数
 */
router.get('/recommendAuthor', validator({
  limit: { 
    type: 'string', 
    required: true,
    validator: (rule, value) => Number(value) > 0,
    message: 'limit 需传入正整数'
  }
}), async (ctx, next)=>{
  ctx.set('Cache-Control', 'max-age=60')
  const headers = ctx.headers
  const options = {
    url: 'https://web-api.juejin.im/query',
    method: "POST",
    headers: {
      'X-Agent': 'Juejin/Web',
      'X-Legacy-Device-Id': headers['x-device-id'],
      'X-Legacy-Token': headers['x-token'],
      'X-Legacy-Uid': headers['x-uid']
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
  let { body } = await request(options)
  body = toObject(body)
  try {
    ctx.body = {
      s: body.data.recommendationCard.items ? 1 : 0,
      d: body.data.recommendationCard.items
    } 
  } catch (error) {
    ctx,body = {
      s: 0,
      d: [],
      errors: [body]
    }
  }
})

/**
 * 类目列表
 */
router.get('/channel', async (ctx, next) => {
  const headers = ctx.headers
  const options = {
    url: 'https://web-api.juejin.im/query',
    method: "POST",
    headers: {
      'X-Agent': 'Juejin/Web',
      'X-Legacy-Device-Id': headers['x-device-id'],
      'X-Legacy-Token': headers['x-token'],
      'X-Legacy-Uid': headers['x-uid']
    },
    body: {
      operationName: "",
      query: "",
      extensions: {query: {id: "3c8fb555d09613a08d450f3d8bc9616e"}},
    }
  };
  let { body } = await request(options)
  body = toObject(body)
  try {
    ctx.body = {
      s: body.data.channelCard.items ? 1 : 0,
      d: body.data.channelCard.items
    } 
  } catch (error) {
    ctx,body = {
      s: 0,
      d: [],
      errors: [body]
    }
  }
})

/**
 * 作者榜单
 * @param {string} channel - 类目名
 * @param {string} after - 分页标识
 * @param {number} first - 条数
 */
router.get('/authorRank', validator({
  channel: { type: 'string', required: true },
  after: { type: 'string' },
  first: {
    type: 'string', 
    required: true,
    validator: (rule, value) => Number(value) > 0,
    message: 'first 需传入正整数'
  }
}), async (ctx, next) => {
  const headers = ctx.headers
  const options = {
    url: 'https://web-api.juejin.im/query',
    method: "POST",
    headers: {
      'X-Agent': 'Juejin/Web',
      'X-Legacy-Device-Id': headers['x-device-id'],
      'X-Legacy-Token': headers['x-token'],
      'X-Legacy-Uid': headers['x-uid']
    },
    body: {
      operationName: "",
      query: "",
      variables: {
        channel: ctx.query.channel || "recommended",
        after: ctx.query.after || "",
        first: ctx.query.first || 20
      },
      extensions: {query: {id: "3c519062a0c1b986391a3cf6d3c1c0ea"}},
    }
  };
  let { body } = await request(options)
  body = toObject(body)
  try {
    ctx.body = {
      s: body.data.recommendationList.items ? 1 : 0,
      d: body.data.recommendationList.items
    } 
  } catch (error) {
    ctx,body = {
      s: 0,
      d: {},
      errors: [body]
    }
  }
})

/**
 * 推荐小册
 */
router.get('/books', async (ctx, next) => {
  const headers = ctx.headers
  const options = {
    url: 'https://xiaoce-timeline-api-ms.juejin.im/v1/getRecommendBooks',
    method: 'GET',
    params: {
      src: 'web',
      uid: headers['x-uid'],
      client_id: headers['x-device-id'],
      token: headers['x-token'],
      category: '5562b428e4b00c57d9b94b9d'
    }
  }
  let { body } = await request(options)
  ctx.body = body
})

module.exports = router