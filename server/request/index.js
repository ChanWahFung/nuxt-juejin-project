const request = require('request')
const util = require('util')
const qs = require('querystring')
const requestPromise = util.promisify(request)

module.exports = function (options){
  options.method = options.method.toUpperCase()
  if(options.method === 'GET'){
    if(options.params){
      let params = qs.stringify(options.params)
      options.url = `${options.url}?${params}`
    }
  }
  if(
    options.method === 'POST' ||
    options.method === 'PUT' ||
    options.method === 'DELETE'
  ){
    options.headers['Content-Type'] = 'application/json'
    if(options.body){
      options.body = JSON.stringify(options.body)
    }
  }
  return requestPromise(options)
    .then(res=> ({
      statusCode: res.statusCode,
      statusMessage: res.statusMessage,
      headers: res.headers,
      body: res.body
    }))
    .catch(err=> err)
}