const Router = require('koa-router')
const router = new Router()
const request = require('../../request')
const validator = require('../../middleware/validator')
const config = require('../../request/config')

/**
 * 获取标签详情
 * @param {string} tagName
 */
router.get('/detail', validator({
  tagName: { type: 'string', required: true }
}), async(ctx, next) => {
  const options = {
    url: 'https://gold-tag-ms.juejin.im/v1/tag/'+ctx.query.tagName,
    method: "GET",
    headers: {
      'X-Juejin-Src': 'web',
      'X-Juejin-Client': config.deviceId,
      'X-Juejin-Token': config.token,
      'X-Juejin-Uid': config.uid
    }
  };
  let { body:res } = await request(options)
  ctx.body = res
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
  const options = {
    url: 'https://timeline-merger-ms.juejin.im/v1/get_tag_entry',
    method: "GET",
    headers: {
      'X-Juejin-Src': 'web',
      'X-Juejin-Client': config.deviceId,
      'X-Juejin-Token': config.token,
      'X-Juejin-Uid': config.uid
    },
    params: {
      'src': 'web',
      'uid': config.uid,
      'device_id': config.deviceId,
      'token': config.token,
      'tagId': ctx.query.tagId,
      'page': ctx.query.page || 0,
      'pageSize': ctx.query.pageSize || 20,
      'sort': ctx.query.sort || 'rankIndex',
    }
  };
  let { body:res } = await request(options)
  ctx.body = {
    s: res.s,
    d: res.d.entrylist
  }
})

/**
 * 获取已关注的标签
 */
router.get('/subscribed', async (ctx, next) => {
  const options = {
    url: 'https://gold-tag-ms.juejin.im/v1/user/5c455fe56fb9a049ef26e4e6/subscribe',
    method: "GET",
    headers: {
      'X-Juejin-Client': config.deviceId,
      'X-Juejin-Src': 'web',
      'X-Juejin-Token': config.token,
      'X-Juejin-Uid': config.uid
    }
  };
  let { body } = await request(options)
  ctx.body = body
})

/**
 * 获取全部标签
 * @param {number} page - 页码
 * @param {number} pageSize - 页数
 */
router.get('/all', validator({
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
  const options = {
    url: `https://gold-tag-ms.juejin.im/v1/tags/type/hot/page/${ctx.query.page}/pageSize/${ctx.query.pageSize}`,
    method: "GET",
    headers: {
      'X-Juejin-Client': config.deviceId,
      'X-Juejin-Src': 'web',
      'X-Juejin-Token': config.token,
      'X-Juejin-Uid': config.uid
    }
  };
  let { body } = await request(options)
  ctx.body = body
})

// 关注标签逻辑共有
function subscribe(ctx){
  const options = {
    url: 'https://gold-tag-ms.juejin.im/v1/tag/subscribe/'+ctx.request.body.id,
    method: ctx.method,
    headers: {
      'X-Juejin-Client': config.deviceId,
      'X-Juejin-Src': 'web',
      'X-Juejin-Token': config.token,
      'X-Juejin-Uid': config.uid
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
  let { body:res, statusCode, headers } = await subscribe(ctx)
  ctx.status = statusCode
  ctx.set('Content-Type', headers['content-type'])
  ctx.body = res
})

/**
 * 取消关注
 * @param {string} tagId - 标签id
 */
router.delete('/subscribe', validator({
  tagId: { type: 'string', required: true }
}), async (ctx, next)=>{
  let { body:res, statusCode, headers } = await subscribe(ctx)
  ctx.status = statusCode
  ctx.set('Content-Type', headers['content-type'])
  ctx.body = res
})

module.exports = router