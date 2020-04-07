const Router = require('koa-router')
const router = new Router()
const request = require('../request')
const validator = require('../middleware/validator')
const config = require('../request/config')

 /**
 * 搜索
 * @param {string} type - ALL：综合、ARTICLE：文章、TAG：标签、USER：用户
 * @param {string} first - 条数
 * @param {string} after - 下一页的标识
 * @param {string} keyword - 关键词
 * @param {string} period - ALL：全部、D1：一天内、W1：一周内、M3：三个月内
 */
router.get('/entry', validator({
  type: { type: 'enum', required: true, enum: ['ALL', 'ARTICLE', 'TAG', 'USER']},
  first: { 
    type: 'string', 
    required: true,
    validator: (rule, value) => Number(value) > 0,
    message: 'first 需传入正整数'
  },
  after: { type: 'string' },
  keyword: { type: 'string', required: true },
  period: { type: 'enum', required: true, enum: ['ALL', 'D1', 'W1', 'M3'] }
}), async (ctx, next) => {
  if (ctx.$errors) {
    ctx.body = {
      s: 0,
      errors: ctx.$errors
    }
  } else {
    const options = {
      url: 'https://web-api.juejin.im/query',
      method: "POST",
      headers: {
        'X-Agent': 'Juejin/Web',
        'X-Legacy-Device-Id': config.deviceId,
        'X-Legacy-Token': config.token,
        'X-Legacy-Uid': config.uid
      },
      body: { 
        "operationName": "",
        "query": "",
        "variables": {
          type: ctx.query.type || 'ALL',
          query: ctx.query.keyword,
          after: ctx.query.after || '',
          period: ctx.query.period || 'ALL',
          first: ctx.query.first || 20
        },
        "extensions": { "query": { "id": "a53db5867466eddc50d16a38cfeb0890" } } 
      }
    };
    ctx.body = await request(options)
  }
})

module.exports = router