export default {
  methods: {
    // 获取关注状态
    isCurrentUserFollowed(uid) {
      if (uid && this.$store.state.auth.userInfo) {
        return this.$api.isCurrentUserFollowed({
          ids: uid,
        }).then(res => res.err_no === 0 ? res.data[uid] : false)
      } else {
        return Promise.resolve(false)
      }
    },
    // 获取点赞状态
    isArticleLike(entryId) {
      if (entryId) {
        return this.$api.isArticleLike({
          entryId
        }).then(res => res.s === 1 ? res.d.like : false)
      } else {
        return Promise.resolve(false)
      }
    }
  }
}