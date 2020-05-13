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
    if(options.body){
      options.body = JSON.stringify(options.body)
    }
    if(!options.headers){
      options.headers = {}
    }
    options.headers = {
      'Content-Type': 'application/json',
      ...options.headers
    }
  }
  return requestPromise(options)
    .then(res=> ({
      statusCode: res.statusCode,
      statusMessage: res.statusMessage,
      headers: res.headers,
      body: res.body
    }))
    .catch(err=> {
      console.error(err)
      return {
        statusCode: -1,
        statusMessage: err,
        headers: res.headers,
        body: { s: 0 },
      }
    })
}