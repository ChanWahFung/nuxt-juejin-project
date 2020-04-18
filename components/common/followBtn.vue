<template>
  <div class="follow-btn" :class="{'follow-btn--active': isFollow}" @click.stop="toggleFollow">{{ isFollow ? '已关注' : '关注' }}</div>
</template>

<script>
import config from '../../server/request/config'

export default {
  model: {
    prop: 'isFollow',
    event: 'updateIsFollow'
  },
  props: {
    isFollow: {
      type: Boolean,
      default: false
    },
    followeeId: {
      type: String
    }
  },
  methods: {
    async toggleFollow(){
      if (!this.followeeId) {
        return
      }
      let res = await this.$api.follow({
        isFollow: this.isFollow,
        follower: config.uid,
        followee: this.followeeId
      })
      if (res.s === 1) {
        this.$emit('updateIsFollow', !this.isFollow)
      }
    }
  }
}
</script>

<style lang='scss' scoped>
.follow-btn{
  width: 75px;
  height: 32px;
  line-height: 30px;
  font-size: 14px;
  text-align: center;
  color: $success;
  border: 1px solid $success;
  border-radius: 2px;
  cursor: pointer;

  &.follow-btn--active{
    background: $success;
    color: #fff;
  }
}
</style>