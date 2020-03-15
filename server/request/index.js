const request = require('request')
const util = require('util')
const qs = require('querystring')
const requestPromise = util.promisify(request)

module.exports = function (options){
  if(options.method === 'GET'){
    let params = qs.stringify(options.params)
    options.url = `${options.url}?${params}`
  }
  if(options.method === 'POST'){
    options.headers = {
      'content-type': 'application/json',
      ...options.headers,
    }
    options.body = JSON.stringify(options.body)
  }
  return requestPromise(options)
    .then(res=> res.body)
    .catch(err=> err)
}