const Router = require('koa-router')
const router = new Router()
const request = require('../request')
const validator = require('../middleware/validator')
const config = require('../request/config')

/**
 * 获取文章评论
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
  if (ctx.$errors) {
    ctx.body = {
      s: 0,
      errors: ctx.$errors
    }
  } else {
    const options = {
      url: 'https://comment-wrapper-ms.juejin.im/v1/comments/entry/'+ctx.query.entryId,
      method: "GET",
      headers: {
        'X-Juejin-Src': 'web',
        'X-Juejin-Client': config.deviceId,
        'X-Juejin-Token': config.token,
        'X-Juejin-Uid': config.uid,
      },
      params: { 
        createdAt: ctx.query.createdAt || '',
        rankType: ctx.query.rankType || 'new',
        pageSize: ctx.query.pageSize || '5',
      }
    };
    ctx.body = await request(options);
  }
})

/**
 * 获取回复列表
 * @param {string} entryId - 在文章详情内获取
 * @param {string} commentId - 评论id
 * @param {number} pageNum - 页码
 * @param {number} pageSize - 页数
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
  const options = {
    url: 'https://comment-wrapper-ms.juejin.im/v1/comments/entry/'+ctx.query.entryId+'/comment/'+ctx.query.commentId,
    method: "GET",
    headers: {
      'X-Juejin-Src': 'web',
      'X-Juejin-Client': config.deviceId,
      'X-Juejin-Token': config.token,
      'X-Juejin-Uid': config.uid,
    },
    params: { 
      pageNum: ctx.query.pageNum,
      pageSize: ctx.query.pageSize
    }
  };
  ctx.body = await request(options);
})

module.exports = router