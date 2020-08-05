const Router = require('koa-router')
const router = new Router()
const request = require('../../request')
const validator = require('../../middleware/validator')
const { toObject } = require('../../../utils')

/**
 * 获取详情页信息
 * @param {string} article_id - 文章id 
 */
router.get('/detail', validator({
  article_id: { type: 'string', required: true }
}), async (ctx, next)=>{
  const data = ctx.query
  const options = {
    url: 'https://apinew.juejin.im/content_api/v1/article/detail',
    method: "POST",
    body: {
      article_id: data.article_id
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
 * @param {string} item_id - 文章id
 * @param {string} user_id - 用户id
 * @param {array} tag_ids - 标签id
 */
router.post('/relatedEntry', validator({
  item_id: { 
    type: 'string', 
    required: true,
  },
  tag_ids: {
    type: 'array',
    required: true
  },
  user_id: { 
    type: 'string', 
    required: true,
  },
}), async (ctx, next) => {
  const data = ctx.request.body
  const options = {
    url: 'https://apinew.juejin.im/recommend_api/v1/article/recommend_article_detail_feed',
    method: "POST",
    body: { 
      cursor: "0",
      id_type: 2,
      item_id: data.item_id,
      tag_ids: data.tag_ids,
      user_id: data.user_id
    }
  };
  let { body } = await request(options)
  ctx.body = body
})

/**
 * 根据标签id获取相关推荐文章
 * @param {string} item_id - 文章id
 * @param {string} cursor - 分页标识
 * @param {number} sort_type - 排序
 * @param {array} tag_ids - 标签id
 */
router.post('/recommendEntryByTagIds', validator({
  item_id: { 
    type: 'string',
    required: true
  },
  cursor: { 
    type: 'string'
  },
  sort_type: {
    type: 'enum',
    requried: true,
    enum: [0, 3, 7, 30, 200, 300]
  },
  tag_ids: {
    type: 'array',
    required: true
  }
}), async (ctx, next) => {
  const data = ctx.request.body
  const options = {
    url: 'https://apinew.juejin.im/recommend_api/v1/article/recommend_tag_feed',
    method: "POST",
    body: { 
      cursor: data.cursor || '',
      id_type: 2,
      item_id: data.item_id,
      sort_type: data.sort_type,
      tag_ids: data.tag_ids
    }
  };
  let { body } = await request(options)
  ctx.body = body
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