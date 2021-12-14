const Router = require('koa-router')
const router = new Router()
const request = require('../../request')
const { apiJuejin } = require('../../config/url')
const validator = require('../../middleware/validator')

/**
 * 获取标签详情
 * @param {string} key_word
 */
router.get('/detail', validator({
  key_word: { type: 'string', required: true }
}), async(ctx, next) => {
  const data = ctx.query
  const options = {
    url: `${apiJuejin}tag_api/v1/query_tag_detail`,
    method: "POST",
    body: {
      key_word: data.key_word
    }
  };
  let { body } = await request(options)
  ctx.body = body
})

/**
 * 获取对应标签的文章列表
 * @param {string} cursor - 分页标识
 * @param {number} sort_type - 排序: 0-最热、200-热门，300-最新
 * @param {array} tag_ids - 标签
 */
router.post('/entry', validator({
  cursor: { type: 'string' },
  sort_type: { 
    type: 'enum',
    enum: [0, 200, 300],
    required: true
  },
  tag_ids: { type: 'array', required: true }
}), async(ctx, next) => {
  const data = ctx.request.body
  const options = {
    url: `${apiJuejin}recommend_api/v1/article/recommend_tag_feed`,
    method: "POST",
    body: {
      cursor: data.cursor || "0",
      id_type: 2,
      sort_type: Number(data.sort_type),
      tag_ids: data.tag_ids,
    }
  };
  let { body } = await request(options)
  ctx.body = body
})

/**
 * 获取已关注的标签（弃用）
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
 * 获取全部标签（弃用）
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
 * 搜索标签（弃用）
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

// 关注标签逻辑共有（弃用）
function subscribe(ctx){
  const headers = ctx.headers
  const options = {
    url: 'https://gold-tag-ms.juejin.im/v1/tag/subscribe/' + ctx.request.body.tagId,
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
 * 关注（弃用）
 * @param {string} tagId - 标签id
 */
router.put('/subscribe', validator({
  tagId: { type: 'string', required: true }
}), async (ctx, next) => {
  const { body, statusCode, headers } = await subscribe(ctx)
  ctx.status = statusCode
  ctx.set('Content-Type', headers['content-type'])
  ctx.body = body
})

/**
 * 取消关注（弃用）
 * @param {string} tagId - 标签id
 */
router.delete('/subscribe', validator({
  tagId: { type: 'string', required: true }
}), async (ctx, next) => {
  const { body, statusCode, headers } = await subscribe(ctx)
  ctx.status = statusCode
  ctx.set('Content-Type', headers['content-type'])
  ctx.body = body
})

module.exports = router