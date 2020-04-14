import config from '../server/request/config'

export default {
  methods: {
    // 获取关注状态
    isCurrentUserFollowed(uid) {
      if (uid) {
        return this.$api.isCurrentUserFollowed({
          currentUid: config.uid,
          targetUids: uid,
        }).then(res => res.s === 1 ? res.d[uid] : false)
      } else {
        return Promise.resolve(false)
      }
    },
  }
}