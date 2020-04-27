export default ({ app: { $axios } }, inject) => {
  let requestList = {}
  let methods = ['get', 'post', 'put', 'delete']
  methods.forEach(method => {
    let dataKey = method === 'get' ? 'params' : 'data'
    requestList[method] = function(url, data) {
      return $axios({
        method,
        url,
        [dataKey]: data
      }).catch(err => {
        console.error(err)
        return {
          s: 0,
          d: {},
          errors: [err]
        }
      })
    }
  })
  inject('request', requestList)
}