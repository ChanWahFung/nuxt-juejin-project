const Router = require('koa-router')
const router = new Router()
const request = require('../../request')
const { apiJuejin } = require('../../config/url')
const validator = require('../../middleware/validator')

/**
 * 获取推荐作者
 * @param {number} limit - 条数
 * @param {number} cursor - 分页标识
 * @param {string} category_id - 类目
 */
router.get('/recommendAuthor', validator({
  limit: { 
    type: 'string', 
    required: true,
    validator: (rule, value) => Number(value) > 0,
    message: 'limit 需传入正整数'
  },
  cursor: { type: 'string' },
  category_id: { type: 'string' }
}), async (ctx, next) => {
  ctx.set('Cache-Control', 'max-age=60')
  const data = ctx.query
  const options = {
    url: `${apiJuejin}user_api/v1/author/recommend`,
    method: "GET",
    params: {
      category_id: data.category_id || '',
      cursor: data.cursor || 0,
      limit: data.limit || 20,
    }
  };
  let { body } = await request(options)
  ctx.body = body
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