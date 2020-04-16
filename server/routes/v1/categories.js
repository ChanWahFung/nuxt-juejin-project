const Router = require('koa-router')
const router = new Router()
const request = require('../../request')
const validator = require('../../middleware/validator')
const config = require('../../request/config')

router.get('/entry', async (ctx, next) => {
  const options = {
    url: 'https://gold-tag-ms.juejin.im/v1/categories',
    method: "GET",
    headers: {
      'X-Juejin-Src': 'web',
      'X-Juejin-Client': config.deviceId,
      'X-Juejin-Token': config.token,
      'X-Juejin-Uid': config.uid,
    }
  };
  let { body } = await request(options)
  ctx.body = body
})

router.get('/subCategories', validator({
  categoryId: { type: 'string', required: true },
  limit: {
    type: 'string', 
    required: true,
    validator: (rule, value) => Number(value) > 0,
    message: 'limit 需传入正整数'
  }
}), async (ctx, next) => {
  const options = {
    url: 'https://web-api.juejin.im/query',
    method: "GET",
    headers: {
      'X-Agent': 'Juejin/Web',
      'X-Legacy-Device-Id': config.deviceId,
      'X-Legacy-Token': config.token,
      'X-Legacy-Uid': config.uid
    },
    params: {
      operationName: "",
      query: "",
      variables: {
        category: ctx.query.catagoryId, 
        limit: ctx.query.limit
      },
      extensions: {query: {id: "801e22bdc908798e1c828ba6b71a9fd9"}},
    }
  };
  let { body } = await request(options)
  ctx.body = body
})

module.exports = router