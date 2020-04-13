const Router = require('koa-router')
const router = new Router()
const request = require('../../request')
const validator = require('../../middleware/validator')
const config = require('../../request/config')

/**
 * 获取详情页信息
 * @param {string} type - entry：用户等信息，entryView：文章信息
 * @param {string} postId - 文章id 
 */
router.get('/detail', validator({
  type: { type: 'enum', enum: ['entry', 'entryView'] },
  postId: { type: 'string', required: true }
}), async (ctx, next)=>{
  const options = {
    url: 'https://post-storage-api-ms.juejin.im/v1/getDetailData',
    method: "GET",
    params: {
      uid: config.uid,
      device_id: config.deviceId,
      token: config.token,
      src: 'web',
      type: ctx.query.type,
      postId: ctx.query.postId
    }
  };
  let { body:res } = await request(options);
  ctx.body = res
})

/**
 * 获取首页列表
 * @param {string} first - 单页数 默认20
 * @param {string} after - 分页标识，加载下一页传入
 * @param {string} order - POPULAR：热门、NEWEST：最新、THREE_DAYS_HOTTEST：3天内热榜、WEEKLY_HOTTEST：7天内热榜、MONTHLY_HOTTEST：30天内热榜、HOTTEST：全部热榜
 */
router.get('/indexList', validator({
  first: { 
    type: 'string', 
    required: true,
    validator: (rule, value) => Number(value) > 0,
    message: 'first 需传入正整数'
  },
  after: { type: 'string' },
  order: {
    type: 'enum',
    required: true,
    enum: ['POPULAR', 'NEWEST', 'THREE_DAYS_HOTTEST', 'WEEKLY_HOTTEST', 'MONTHLY_HOTTEST', 'HOTTEST']
  }
}), async (ctx, next) => {
  ctx.set('Cache-Control', 'max-age=60')
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
      operationName: "", 
      query: "", 
      variables: { 
        first: ctx.query.first, 
        after: ctx.query.after,
        order: ctx.query.order
      }, 
      extensions: { query: { id: "21207e9ddb1de777adeaca7a2fb38030" } } 
    }
  };
  let { body:res } = await request(options)
  try {
    ctx.body = {
      s: res.data.articleFeed.items ? 1 : 0,
      d: res.data.articleFeed.items
    }
  } catch (error) {
    ctx.body = {
      s: 0,
      d: {}
    }
  }
})

/**
 * 获取用户专栏文章
 * @param {string} targetUid - 用户id
 * @param {string} before - 最后一条的createdAt，下一页传入
 * @param {number} limit - 单次条数
 * @param {string} order - rankIndex：热门、createdAt：最新
 */
router.get('/userPost', validator({
  targetUid: { type: 'string', required: true },
  before: { type: 'string' },
  limit: { 
    type: 'string', 
    required: true,
    validator: (rule, value) => Number(value) > 0,
    message: 'limit 需传入正整数'
  },
  order: { type: 'enum', enum: ['rankIndex', 'createdAt'] }
}), async (ctx, next) => {
  const options = {
    url: 'https://timeline-merger-ms.juejin.im/v1/get_entry_by_self',
    method: "GET",
    params: {
      src: "web",
      uid: config.uid,
      device_id: config.deviceId,
      token: config.token,
      targetUid: ctx.query.targetUid,
      type: ctx.query.type || 'post',
      limit: ctx.query.limit || 20,
      before: ctx.query.before,
      order: ctx.query.order || 'createdAt'
    }
  };
  let { body:res } = await request(options)
  ctx.body = {
    s: res.s,
    d: res.d.entrylist
  }
})

/**
 * 获取相关文章
 * @param {number} limit - 条数
 * @param {string} entryId - 文章objectId
 */
router.get('/relatedEntry', validator({
  limit: { 
    type: 'string', 
    required: true,
    validator: (rule, value) => Number(value) > 0,
    message: 'limit 需传入正整数'
  },
  entryId: { type: 'string', reuqired: true }
}), async (ctx, next) => {
  const options = {
    url: 'https://timeline-merger-ms.juejin.im/v1/get_related_entry',
    method: "GET",
    params: { 
      src: "web",
      uid: config.uid,
      device_id: config.deviceId,
      token: config.token,
      limit: ctx.query.limit || 5,
      entryId: ctx.query.entryId
    }
  };
  let { body:res } = await request(options)
  ctx.body = {
    s: res.s,
    d: res.d.entrylist
  }
})

/**
 * 根据标签id获取相关推荐文章
 * @param {string} tagIds - 多个id以|分隔
 * @param {number} before - 最后一条的rankIndex，下一页时传入
 */
router.get('/recommendEntryByTagIds', validator({
  tagIds: { type: 'string', required: true },
  before: { type: 'string' }
}), async (ctx, next) => {
  const options = {
    url: 'https://post-storage-api-ms.juejin.im/v1/getRecommendEntryByTagIds',
    method: "GET",
    params: { 
      src: "web",
      uid: config.uid,
      device_id: config.deviceId,
      token: config.token,
      tagIds: ctx.query.tagIds,
      before: ctx.query.before || ''
    }
  };
  let { body:res } = await request(options)
  ctx.body = {
    s: res.s,
    d: res.d.entrylist
  }
})

function like(ctx, method){
  const options = {
    url: 'https://user-like-wrapper-ms.juejin.im/v1/user/like/entry/'+ctx.request.body.entryId,
    method,
    headers: {
      'X-Juejin-Src': 'web',
      'X-Juejin-Client': config.deviceId,
      'X-Juejin-Token': config.token,
      'X-Juejin-Uid': config.uid
    }
  };
  return request(options)
}

/**
 * 点赞 - 文章
 * @param {string} entryId - 文章objectId
 */
router.put('/like', validator({
  entryId: { type: 'string', required: true }
}), async (ctx, next) => {
  let { body:res, statusCode, headers } = await like(ctx, 'PUT')
  ctx.status = statusCode
  ctx.set('Content-Type', headers['content-type'])
  ctx.body = res
})

/**
 * 取消点赞 - 文章
 * @param {string} entryId - 文章objectId
 */
router.delete('/like', validator({
  entryId: { type: 'string', required: true }
}), async (ctx, next) => {
  let { body:res, statusCode, headers } = await like(ctx, 'DELETE')
  ctx.status = statusCode
  ctx.set('Content-Type', headers['content-type'])
  ctx.body = res
})

module.exports = router