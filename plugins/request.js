export default ({ app: { $axios } }, inject) => {
  inject('request', {
    get (url, params) {
      return $axios({
        method: 'get',
        url,
        params
      })
    }
  })
}