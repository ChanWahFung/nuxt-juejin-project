<template>
  <div v-if="type === 'user'" class="follow-btn follow-user-btn" :class="{'follow-user-btn--active': isFollow}" @click.stop="toggleFollow">{{ isFollow ? '已关注' : '关注' }}</div>
  <div v-else-if="type === 'tag'" class="follow-btn follow-tag-btn" :class="{'follow-tag-btn--active': isFollow}" @click.stop="toggleFollow">{{ isFollow ? '已关注' : '关注' }}</div>
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
    type: {
      type: String,
      default: 'user'
    },
    followeeId: {
      type: String,
      default: ''
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
  border-radius: 2px;
  cursor: pointer;

  &.follow-user-btn{
    color: $success;
    border: 1px solid currentColor;
  }

  &.follow-tag-btn{
    color: $success-2;
    border: 1px solid currentColor;
  }

  &.follow-user-btn--active{
    background: $success;
    color: #fff;
  }

  &.follow-tag-btn--active{
    background: $success-2;
    color: #fff;
  }
}
</style>