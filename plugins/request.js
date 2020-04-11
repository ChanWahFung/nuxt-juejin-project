export default ({ app: { $axios } }, inject) => {
  inject('request', {
    get (url, params) {
      return $axios({
        method: 'get',
        url,
        params
      })
    },
    post (url, data) {
      return $axios({
        method: 'post',
        url,
        data
      })
    },
    put (url, data) {
      return $axios({
        method: 'put',
        url,
        data
      })
    },
    delete (url, data) {
      return $axios({
        method: 'delete',
        url,
        data
      })
    },
  })
}