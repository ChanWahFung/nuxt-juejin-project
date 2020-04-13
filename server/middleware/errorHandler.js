module.exports = function(err, ctx) {
  console.log(err)
  ctx.body = {
    s: 500,
    m: 'server error'
  }
}