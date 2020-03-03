const Router = require('koa-router')
const router = new Router()

router.get('/', (ctx,next)=>{
  ctx.body = {
    code: 1,
    data: ctx.query
  }
})

module.exports = router