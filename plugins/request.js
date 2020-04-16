export default ({ app: { $axios } }, inject) => {
  inject('request', {
    get (url, params) {
      return $axios({
        method: 'get',
        url,
        params
      }).catch(err => {
        console.error(err)
        return {
          s: 0
        }
      })
    },
    post (url, data) {
      return $axios({
        method: 'post',
        url,
        data,
        headers: {
          'content-type': 'application/json'
        }
      }).catch(err => {
        console.error(err)
        return {
          s: 0
        }
      })
    },
    put (url, data) {
      return $axios({
        method: 'put',
        url,
        data,
        headers: {
          'content-type': 'application/json'
        }
      }).catch(err => {
        console.error(err)
        return {
          s: 0
        }
      })
    },
    delete (url, data) {
      return $axios({
        method: 'delete',
        url,
        data,
        headers: {
          'content-type': 'application/json'
        }
      }).catch(err => {
        console.error(err)
        return {
          s: 0
        }
      })
    },
  })
}