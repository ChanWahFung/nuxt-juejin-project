export default {
  action: {
    getDetail ({ app, params }) {
      return app.$api.getDetail({
        type: 'entryView',
        postId: params.id
      }).then(res => {
        if (res.s === 1) {
          return res.d
        }
        return {}
      })
    }
  }
}