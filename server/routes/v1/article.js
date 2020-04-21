const Router = require('koa-router')
const router = new Router()
const request = require('../../request')
const validator = require('../../middleware/validator')
const config = require('../../request/config')
const { toObject } = require('../../../utils')

/**
 * 获取详情页信息
 * @param {string} type - entry：用户等信息，entryView：文章信息
 * @param {string} postId - 文章id 
 */
router.get('/detail', validator({
  type: { type: 'enum', enum: ['entry', 'entryView'], required: true },
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
      type: ctx.query.type || 'entryView',
      postId: ctx.query.postId
    }
  };
  let { body } = await request(options);
  ctx.body = body
})

/**
 * 获取首页列表
 * @param {string} first - 条数
 * @param {string} after - 分页标识，加载下一页传入
 * @param {string} order - POPULAR：热门、NEWEST：最新、THREE_DAYS_HOTTEST：3天内热榜、WEEKLY_HOTTEST：7天内热榜、MONTHLY_HOTTEST：30天内热榜、HOTTEST：全部热榜
 * @param {string} category - 类目id
 * @param {array} tags - 标签id
 */
router.post('/indexList', validator({
  first: { 
    type: 'string', 
    required: true,
    validator: (rule, value) => Number(value) > 0,
    message: 'first 需传入正整数'
  },
  after: { type: 'string' },
  category: { type: 'string' },
  order: {
    type: 'enum',
    required: true,
    enum: ['POPULAR', 'NEWEST', 'THREE_DAYS_HOTTEST', 'WEEKLY_HOTTEST', 'MONTHLY_HOTTEST', 'HOTTEST']
  },
  tags: { type: 'array' }
}), async (ctx, next) => {
  ctx.set('Cache-Control', 'max-age=60')
  const data = ctx.request.body
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
        first: data.first || 20, 
        after: data.after || '',
        order: data.order || 'POPULAR',
        category: data.category || '',
        tags: data.tags || []
      }, 
      extensions: { query: { id: "653b587c5c7c8a00ddf67fc66f989d42" } } 
    }
  };
  let { body } = await request(options)
  body = toObject(body)
  try {
    ctx.body = {
      s: body.data.articleFeed.items ? 1 : 0,
      d: body.data.articleFeed.items
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
 * @param {number} limit - 条数
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
  let { body } = await request(options)
  body = toObject(body)
  ctx.body = {
    s: body.s,
    d: body.d.entrylist
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
  let { body } = await request(options)
  body = toObject(body)
  ctx.body = {
    s: body.s,
    d: body.d.entrylist
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
  let { body } = await request(options)
  body = toObject(body)
  ctx.body = {
    s: body.s,
    d: body.d.entrylist
  }
})

module.exports = router