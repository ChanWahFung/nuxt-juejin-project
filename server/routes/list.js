const Router = require('koa-router')
const router = new Router()
const data = require('../data/list')

router.get('/indexList', (ctx,next)=>{
  ctx.body = {
    code: 1,
    data: data.indexList
  }
})

module.exports = router