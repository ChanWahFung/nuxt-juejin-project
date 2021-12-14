const Router = require('koa-router')
const router = new Router()
const request = require('../../request')
const { apiJuejin } = require('../../config/url')
const validator = require('../../middleware/validator')

/**
 * 小册列表
 * @param {string} category_id - 类目id
 * @param {number} limit - 条数
 * @param {string} cursor - 分页条数
 */
router.get('/getBookList', validator({
  category_id: { type: 'string', required: true },
  cursor: { type: 'string' },
  limit: {
    type: 'string', 
    required: true,
    validator: (rule, value) => Number(value) > 0,
    message: 'limit 需传入正整数'
  }
}), async (ctx, next) => {
  const data = ctx.query
  const options = {
    url: `${apiJuejin}booklet_api/v1/booklet/listbycategory`,
    method: 'POST',
    body: {
      category_id: data.category_id,
      cursor: data.cursor || "0",
      limit: Number(data.limit)
    }
  }
  let { body } = await request(options)
  ctx.body = body
})

module.exports = router