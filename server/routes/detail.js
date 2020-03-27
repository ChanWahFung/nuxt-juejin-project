const Router = require('koa-router')
const router = new Router()
const request = require('../request')
const config = require('../request/config')

router.get('/', async (ctx,next)=>{
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
  const data = await request(options);
  ctx.body = data;
})

module.exports = router