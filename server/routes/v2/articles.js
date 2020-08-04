const Router = require('koa-router')
const router = new Router()
const request = require('../../request')
const validator = require('../../middleware/validator')
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
  const headers = ctx.headers
  const options = {
    url: 'https://post-storage-api-ms.juejin.im/v1/getDetailData',
    method: "GET",
    params: {
      uid: headers['x-uid'],
      device_id: headers['x-device-id'],
      token: headers['x-token'],
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
 * @param {string} cate_id - 分类id
 * @param {string} cursor - 分页标识，加载下一页传入
 * @param {string} limit - 条数
 * @param {string} sort_type - 0：全部、3：三天内、7：7天内、30：30天内、200：热门、300：最新
 * @param {string} feed_type - all：推荐，cate：分类
 */
router.post('/indexList', validator({
  cate_id: { 
    type: 'string'
  },
  cursor: { 
    type: 'string'
  },
  limit: { 
    type: 'string', 
    requried: true,
    validator: (rule, value) => Number(value) > 0,
    message: 'limit 需传入正整数'
  },
  sort_type: {
    type: 'enum',
    requried: true,
    enum: [0, 3, 7, 30, 200, 300]
  },
  feed_type: {
    type: 'enum',
    required: true,
    enum: ['all', 'cate']
  }
}), async (ctx, next) => {
  const data = ctx.request.body
  const apiName = data.feed_type == 'all' ? 'recommend_all_feed' : 'recommend_cate_feed'
  const options = {
    url: 'https://apinew.juejin.im/recommend_api/v1/article/'+apiName,
    method: "POST",
    body: { 
      cate_id: data.cate_id || '',
      limit: data.limit || 20, 
      sort_type: Number(data.sort_type) || 200,
      cursor: data.cursor || '0',
      id_type: 2
    }
  };
  let { body } = await request(options)
  ctx.body = body
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
  const headers = ctx.headers
  const options = {
    url: 'https://timeline-merger-ms.juejin.im/v1/get_entry_by_self',
    method: "GET",
    params: {
      src: "web",
      uid: headers['x-uid'],
      device_id: headers['x-device-id'],
      token: headers['x-token'],
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
    d: body.d.entrylist || []
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
  const headers = ctx.headers
  const options = {
    url: 'https://timeline-merger-ms.juejin.im/v1/get_related_entry',
    method: "GET",
    params: { 
      src: "web",
      uid: headers['x-uid'],
      device_id: headers['x-device-id'],
      token: headers['x-token'],
      limit: ctx.query.limit || 5,
      entryId: ctx.query.entryId
    }
  };
  let { body } = await request(options)
  body = toObject(body)
  ctx.body = {
    s: body.s,
    d: body.d.entrylist || []
  }
})

/**
 * 根据标签id获取相关推荐文章
 * @param {string} tagIds - 多个id以|分隔
 * @param {number} before - 最后一条的rankIndex，下一页时传入
 */
router.get('/recommendEntryByTagIds', validator({
  tagIds: { type: 'string', required: true },
  before: { 
    type: 'string', 
    validator: (rule, value) => Number(value) > 0 || value === '',
    message: 'before 为number类型'
  }
}), async (ctx, next) => {
  const headers = ctx.headers
  const options = {
    url: 'https://post-storage-api-ms.juejin.im/v1/getRecommendEntryByTagIds',
    method: "GET",
    params: { 
      src: "web",
      uid: headers['x-uid'],
      device_id: headers['x-device-id'],
      token: headers['x-token'],
      tagIds: ctx.query.tagIds,
      before: ctx.query.before || ''
    }
  };
  let { body } = await request(options)
  body = toObject(body)
  ctx.body = {
    s: body.s,
    d: body.d.entrylist || []
  }
})

 /**
 * 搜索
 * @param {string} type - ALL：综合、ARTICLE：文章、TAG：标签、USER：用户
 * @param {string} first - 条数
 * @param {string} after - 下一页的标识
 * @param {string} keyword - 关键词
 * @param {string} period - ALL：全部、D1：一天内、W1：一周内、M3：三个月内
 */
router.get('/search', validator({
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
  const headers = ctx.headers
  const options = {
    url: 'https://web-api.juejin.im/query',
    method: "POST",
    headers: {
      'X-Agent': 'Juejin/Web',
      'X-Legacy-Device-Id': headers['x-device-id'],
      'X-Legacy-Token': headers['x-token'],
      'X-Legacy-Uid': headers['x-uid']
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
  let { body } = await request(options)
  body = toObject(body)
  try {
    ctx.body = {
      s: body.data.search ? 1 : 0,
      d: body.data.search
    }
  } catch (error) {
    ctx.body = {
      s: 0,
      d: {},
      errors: [body]
    }
  }
})

module.exports = router