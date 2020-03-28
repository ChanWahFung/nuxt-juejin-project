const Router = require('koa-router')
const router = new Router()
const data = require('../data/label')

router.get('/labelList', (ctx,next)=>{
  ctx.set('Cache-Control', 'max-age=20')
  ctx.body = {
    code: 1,
    data: data.labelList
  }
})

module.exports = router