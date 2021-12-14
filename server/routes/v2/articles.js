const Router = require('koa-router')
const router = new Router()
const request = require('../../request')
const { apiJuejin } = require('../../config/url')
const validator = require('../../middleware/validator')

/**
 * 获取详情页信息
 * @param {string} article_id - 文章id 
 */
router.get('/detail', validator({
  article_id: { type: 'string', required: true }
}), async (ctx, next) => {
  const data = ctx.query
  const options = {
    url: `${apiJuejin}content_api/v1/article/detail`,
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
  const apiName = data.cate_id ? 'recommend_cate_feed' : 'recommend_all_feed'
  const options = {
    url: `${apiJuejin}recommend_api/v1/article/${apiName}`,
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
 * @param {string} user_id - 用户id
 * @param {string} cursor - 分页
 * @param {number} sort_type - 1：热门、2：最新
 */
router.get('/userPost', validator({
  user_id: { type: 'string', required: true },
  cursor: { type: 'string' },
  sort_type: { type: 'enum', required: true, enum: ['1', '2'] }
}), async (ctx, next) => {
  const data = ctx.query
  const options = {
    url: `${apiJuejin}content_api/v1/article/query_list`,
    method: "POST",
    body: {
      user_id: data.user_id,
      cursor: data.cursor || '0',
      sort_type: Number(data.sort_type)
    }
  };
  let res = await request(options)
  ctx.body = res.body
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
    url: `${apiJuejin}recommend_api/v1/article/recommend_article_detail_feed`,
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
    url: `${apiJuejin}recommend_api/v1/article/recommend_tag_feed`,
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
 * @param {number} id_type - 0：综合、2：文章、9：标签、1：用户
 * @param {number} limit - 条数
 * @param {string} cursor - 分页标识
 * @param {string} key_word - 关键词
 * @param {number} search_type - 0：全部、1：一天内、2：一周内、3：三个月内
 */
router.get('/search', validator({
  id_type: { type: 'enum', required: true, enum: ['0', '2', '9', '1'] },
  limit: { 
    type: 'string', 
    required: true,
    validator: (rule, value) => Number(value) > 0,
    message: 'first 需传入正整数'
  },
  cursor: { type: 'string' },
  key_word: { type: 'string', required: true },
  search_type: { type: 'enum', required: true, enum: ['0', '1', '2', '3'] }
}), async (ctx, next) => {
  const data = ctx.query
  const options = {
    url: `${apiJuejin}search_api/v1/search`,
    method: "POST",
    body: { 
      cursor: data.cursor || "0",
      id_type: Number(data.id_type),
      key_word: data.key_word,
      limit: Number(data.limit),
      search_type: Number(data.search_type),
    }
  };
  let { body } = await request(options)
  ctx.body = body
})

module.exports = router