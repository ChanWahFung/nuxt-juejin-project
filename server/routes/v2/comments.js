const Router = require('koa-router')
const router = new Router()
const request = require('../../request')
const { apiJuejin } = require('../../config/url')
const validator = require('../../middleware/validator')

/**
 * 评论列表
 * @param {string} cursor - 分页标识
 * @param {number} item_type - 2: 文章 4：沸点
 * @param {string} item_id - 文章id
 * @param {number} limit - 条数
 */
router.get('/entry', validator({
  cursor: {
    type: 'string'
  },
  item_type: { 
    type: 'enum', 
    required: true,
    enum: ['2', '4']
  },
  item_id: { 
    type: 'string', 
    required: true,
  },
  limit: { 
    type: 'string', 
    requried: true,
    validator: (rule, value) => Number(value) > 0,
    message: 'limit 需传入正整数'
  },
}), async (ctx, next) => {
  const data = ctx.query
  const options = {
    url: `${apiJuejin}interact_api/v1/comment/list`,
    method: "POST",
    body: { 
      cursor: data.cursor || "0",
      item_id: data.item_id,
      item_type: Number(data.item_type),
      limit: Number(data.limit),
    }
  };
  let { body } = await request(options)
  ctx.body = body
})

/**
 * 回复列表
 * @param {string} cursor - 分页标识
 * @param {number} item_type - 2: 文章 4：沸点
 * @param {string} item_id - 文章id
 * @param {string} comment_id - 评论id
 * @param {number} limit - 条数
 */
router.get('/reply', validator({
  cursor: {
    type: 'string'
  },
  item_type: { 
    type: 'enum', 
    required: true,
    enum: ['2', '4']
  },
  item_id: { 
    type: 'string', 
    required: true,
  },
  comment_id: {
    type: 'string', 
    required: true,
  },
  limit: { 
    type: 'string', 
    requried: true,
    validator: (rule, value) => Number(value) > 0,
    message: 'limit 需传入正整数'
  },
}), async (ctx, next) => {
  const data = ctx.query
  const options = {
    url: `${apiJuejin}interact_api/v1/reply/list`,
    method: "POST",
    body: { 
      cursor: data.cursor || "0",
      item_id: data.item_id,
      comment_id: data.comment_id,
      item_type: Number(data.item_type),
      limit: Number(data.limit),
    }
  };
  let { body } = await request(options)
  ctx.body = body
})

module.exports = router