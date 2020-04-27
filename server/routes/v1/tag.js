const Router = require('koa-router')
const router = new Router()
const request = require('../../request')
const validator = require('../../middleware/validator')
const { toObject } = require('../../../utils')

/**
 * 获取标签详情
 * @param {string} tagName
 */
router.get('/detail', validator({
  tagName: { type: 'string', required: true }
}), async(ctx, next) => {
  const headers = ctx.headers
  const options = {
    url: 'https://gold-tag-ms.juejin.im/v1/tag/'+ctx.query.tagName,
    method: "GET",
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

/**
 * 获取对应标签的文章列表
 * @param {string} tagId - 标签id
 * @param {number} page - 页码
 * @param {number} pageSize - 页数
 * @param {string} sort - rankIndex：热门；createdAt：最新；hotIndex：最热
 */
router.get('/entry', validator({
  tagId: { type: 'string', required: true },
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
  sort: { 
    type: 'enum', 
    required: true,
    enum: ['rankIndex', 'createdAt', 'hotIndex']
  }
}), async(ctx, next) => {
  const headers = ctx.headers
  const options = {
    url: 'https://timeline-merger-ms.juejin.im/v1/get_tag_entry',
    method: "GET",
    headers: {
      'X-Juejin-Src': 'web',
      'X-Juejin-Client': headers['x-device-id'],
      'X-Juejin-Token': headers['x-token'],
      'X-Juejin-Uid': headers['x-uid'],
    },
    params: {
      src: 'web',
      uid: headers['x-uid'],
      device_id: headers['x-device-id'],
      token: headers['x-token'],
      tagId: ctx.query.tagId,
      page: ctx.query.page || 0,
      pageSize: ctx.query.pageSize || 20,
      sort: ctx.query.sort || 'rankIndex',
    }
  };
  let { body } = await request(options)
  body = toObject(body)
  ctx.body = {
    s: body.s,
    d: body.d.entrylist || []
  }
})

/**
 * 获取已关注的标签
 */
router.get('/subscribed', async (ctx, next) => {
  const headers = ctx.headers
  const options = {
    url: 'https://gold-tag-ms.juejin.im/v1/user/5c455fe56fb9a049ef26e4e6/subscribe',
    method: "GET",
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

/**
 * 获取全部标签
 * @param {string} type - 类型： 最新、最热
 * @param {number} page - 页码
 * @param {number} pageSize - 页数
 */
router.get('/all', validator({
  type: { type: 'enum', enum: ['new', 'hot'], required: true },
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
  const { type, page, pageSize } = ctx.query
  const headers = ctx.headers
  const options = {
    url: `https://gold-tag-ms.juejin.im/v1/tags/type/${type}/page/${page}/pageSize/${pageSize}`,
    method: "GET",
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

/**
 * 搜索标签
 * @param {string} type - 类型： 最新、最热
 * @param {string} keyword - 搜索词
 * @param {number} page - 页码
 * @param {number} pageSize - 页数
 */
router.get('/search', validator({
  type: { type: 'enum', enum: ['new', 'hot'], required: true },
  keyword: { type: 'string', required: true },
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
  const { type, keyword, page, pageSize } = ctx.query
  const headers = ctx.headers
  const options = {
    url: `https://gold-tag-ms.juejin.im/v1/tag/type/${type}/search/${encodeURIComponent(keyword)}/page/${page}/pageSize/${pageSize}`,
    method: "GET",
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

// 关注标签逻辑共有
function subscribe(ctx){
  const headers = ctx.headers
  const options = {
    url: 'https://gold-tag-ms.juejin.im/v1/tag/subscribe/'+ctx.request.body.tagId,
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
 * 关注
 * @param {string} tagId - 标签id
 */
router.put('/subscribe', validator({
  tagId: { type: 'string', required: true }
}), async (ctx, next)=>{
  const { body, statusCode, headers } = await subscribe(ctx)
  ctx.status = statusCode
  ctx.set('Content-Type', headers['content-type'])
  ctx.body = body
})

/**
 * 取消关注
 * @param {string} tagId - 标签id
 */
router.delete('/subscribe', validator({
  tagId: { type: 'string', required: true }
}), async (ctx, next)=>{
  const { body, statusCode, headers } = await subscribe(ctx)
  ctx.status = statusCode
  ctx.set('Content-Type', headers['content-type'])
  ctx.body = body
})

module.exports = router