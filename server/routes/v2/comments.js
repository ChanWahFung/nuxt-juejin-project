const Router = require('koa-router')
const router = new Router()
const request = require('../../request')
const validator = require('../../middleware/validator')

/**
 * 文章评论
 * @param {string} cursor - 分页标识
 * @param {string} item_id - 文章id
 * @param {number} limit - 条数
 */
router.get('/entry', validator({
  cursor: {
    type: 'string'
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
    url: 'https://apinew.juejin.im/interact_api/v1/comment/list',
    method: "POST",
    body: { 
      cursor: data.cursor || "0",
      item_id: data.item_id,
      item_type: 2,
      limit: Number(data.limit),
    }
  };
  let { body } = await request(options)
  ctx.body = body
})

/**
 * 文章回复列表
 * @param {string} cursor - 分页标识
 * @param {string} item_id - 文章id
 * @param {number} limit - 条数
 */
router.get('/reply', validator({
  cursor: {
    type: 'string'
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
    url: 'https://apinew.juejin.im/interact_api/v1/reply/list',
    method: "POST",
    body: { 
      cursor: data.cursor || "0",
      item_id: data.item_id,
      comment_id: data.comment_id,
      item_type: 2,
      limit: Number(data.limit),
    }
  };
  let { body } = await request(options)
  ctx.body = body
})

/**
 * 沸点评论列表
 * @param {string} pinId 沸点id
 * @param {number} pageNum - 页码
 * @param {number} pageSize - 条数
 */
router.get('/pinComment', validator({
  pinId: { type: 'string', required: true },
  pageNum: { 
    type: 'string', 
    required: true,
    validator: (rule, value) => Number(value) > 0,
    message: 'pageNum 需传入正整数'
  },
  pageSize: { 
    type: 'string', 
    required: true,
    validator: (rule, value) => Number(value) > 0,
    message: 'pageSize 需传入正整数'
  }
}), async (ctx, next) => {
  const headers = ctx.headers
  const options = {
    url: 'https://hot-topic-comment-wrapper-ms.juejin.im/v1/comments/'+ctx.query.pinId,
    method: "GET",
    headers: {
      'X-Juejin-Src': 'web',
      'X-Juejin-Client': headers['x-device-id'],
      'X-Juejin-Token': headers['x-token'],
      'X-Juejin-Uid': headers['x-uid'],
    },
    params: { 
      pageNum: ctx.query.pageNum || 1,
      pageSize: ctx.query.pageSize || 10
    }
  };
  let { body } = await request(options)
  ctx.body = body
})

/**
 * 沸点回复列表
 * @param {string} commentId
 * @param {number} pageNum - 页码
 * @param {number} pageSize - 条数
 */
router.get('/pinReply', validator({
  commentId: { type: 'string', required: true },
  pageNum: { 
    type: 'string', 
    required: true,
    validator: (rule, value) => Number(value) > 0,
    message: 'pageNum 需传入正整数'
  },
  pageSize: { 
    type: 'string', 
    required: true,
    validator: (rule, value) => Number(value) > 0,
    message: 'pageSize 需传入正整数'
  }
}), async (ctx, next) => {
  const headers = ctx.headers
  const options = {
    url: 'https://hot-topic-comment-wrapper-ms.juejin.im/v1/reply/'+ctx.query.commentId,
    method: "GET",
    headers: {
      'X-Juejin-Src': 'web',
      'X-Juejin-Client': headers['x-device-id'],
      'X-Juejin-Token': headers['x-token'],
      'X-Juejin-Uid': headers['x-uid'],
    },
    params: { 
      pageNum: ctx.query.pageNum || 1,
      pageSize: ctx.query.pageSize || 10
    }
  };
  let { body } = await request(options)
  ctx.body = body
})

module.exports = router