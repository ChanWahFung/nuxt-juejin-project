const Router = require('koa-router')
const router = new Router()
const request = require('../../request')
const validator = require('../../middleware/validator')

/**
 * 文章评论
 * @param {string} entryId - 在文章详情内获取
 * @param {string} createdAt - 最后一条的createdAt，下一页时传入
 * @param {string} rankType - new
 * @param {number} pageSize - 条数
 */
router.get('/entry', validator({
  entryId: { type: 'string', required: true },
  createdAt: { type: 'string' },
  rankType: { type: 'enum', required: true, enum: ['new'] },
  pageSize: { 
    type: 'string', 
    required: true,
    validator: (rule, value) => Number(value) > 0,
    message: 'pageSize 需传入正整数'
  }
}), async (ctx, next) => {
  const headers = ctx.headers
  const options = {
    url: 'https://comment-wrapper-ms.juejin.im/v1/comments/entry/'+ctx.query.entryId,
    method: "GET",
    headers: {
      'X-Juejin-Src': 'web',
      'X-Juejin-Client': headers['x-device-id'],
      'X-Juejin-Token': headers['x-token'],
      'X-Juejin-Uid': headers['x-uid'],
    },
    params: { 
      createdAt: ctx.query.createdAt || '',
      rankType: ctx.query.rankType || 'new',
      pageSize: ctx.query.pageSize || '5',
    }
  };
  let { body } = await request(options)
  ctx.body = body
})

/**
 * 文章回复列表
 * @param {string} entryId - 在文章详情内获取
 * @param {string} commentId - 评论id
 * @param {number} pageNum - 页码
 * @param {number} pageSize - 条数
 */
router.get('/reply', validator({
  entryId: { type: 'string', required: true },
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
    url: 'https://comment-wrapper-ms.juejin.im/v1/comments/entry/'+ctx.query.entryId+'/comment/'+ctx.query.commentId,
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