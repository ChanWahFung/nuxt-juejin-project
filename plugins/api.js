export default ({ app: { $request } }, inject) => {
  inject('api', {
    getIndexList (params = {}) {
      return $request.get('/list/indexList', params)
    },
    getLabelList (params = {}) {
      return $request.get('/label/labelList', params)
    }
  })
}