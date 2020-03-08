const Router = require('koa-router')
const router = new Router()
const data = require('../data/label')

router.get('/labelList', (ctx,next)=>{
  ctx.body = {
    code: 1,
    data: data.labelList
  }
})

module.exports = router