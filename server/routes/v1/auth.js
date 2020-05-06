const Router = require('koa-router')
const router = new Router()
const request = require('../../request')
const validator = require('../../middleware/validator')

/**
 * 登录
 * @param {string} password - 密码
 * @param {string} phoneNumber - 手机号码或邮箱
 */
router.post('/login', validator({
  password: { type: 'string', required: true },
  phoneNumber: { type: 'string', required: true }
}), async (ctx) => {
  const options = {
    url: 'https://juejin.im/auth/type/phoneNumber',
    method: "POST",
    body: {
      password: ctx.request.body.password,
      phoneNumber: ctx.request.body.phoneNumber
    }
  };
  let { body } = await request(options)
  ctx.body = body
})

/**
 * 身份验证（是否过期）
 */
router.get('/authentication', async (ctx) => {
  const headers = ctx.headers
  const options = {
    url: 'https://xiaoce-discount-storage-api-ms.juejin.im/v1/getNewUserDiscountTicketDetail',
    method: "GET",
    params: {
      src: 'web',
      uid: headers['x-uid'],
      client_id: headers['x-device-id'],
      token: headers['x-token'],
    }
  };
  let { body } = await request(options)
  ctx.body = body
})

module.exports = router