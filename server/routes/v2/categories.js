const Router = require('koa-router')
const router = new Router()
const request = require('../../request')
const { apiJuejin } = require('../../config/url')
const validator = require('../../middleware/validator')

/**
 * 获取类目
 * @param {number} show_type 0：首页 1：作者排行榜 2：小册
 */
router.get('/entry', validator({
  show_type: {
    type: 'enum',
    required: true,
    enum: ['0', '1', '2']
  }
}), async (ctx, next) => {
  let data = ctx.query 
  const options = {
    url: `${apiJuejin}tag_api/v1/query_category_briefs`,
    method: "GET",
    params: {
      show_type: data.show_type
    }
  };
  let { body } = await request(options)
  ctx.body = body
})

/**
 * 获取类目下的标签
 * @param {string} cate_id - 类目id
 */
router.post('/tags', validator({
  cate_id: { type: 'string', required: true },
}), async (ctx, next) => {
  const data = ctx.request.body
  const options = {
    url: `${apiJuejin}recommend_api/v1/tag/recommend_tag_list`,
    method: "POST",
    body: {
      cate_id: data.cate_id
    }
  };
  let { body } = await request(options)
  ctx.body = body
})

module.exports = router