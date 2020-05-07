<template>
  <div v-if="type === 'user'" class="follow-btn follow-user-btn" :class="[{'follow-user-btn--active': isFollow}, {'follow-btn--small': size === 'small'}]" @click.stop="follow">{{ isFollow ? '已关注' : '关注' }}</div>
  <div v-else-if="type === 'tag'" class="follow-btn follow-tag-btn" :class="[{'follow-tag-btn--active': isFollow}, {'follow-btn--small': size === 'small'}]" @click.stop="follow">{{ isFollow ? '已关注' : '关注' }}</div>
</template>

<script>
export default {
  props: {
    isFollow: {
      type: Boolean,
      default: false
    },
    type: {
      type: String,
      default: 'user',
      validator(v) {
        return ['user', 'tag'].includes(v)
      }
    },
    followeeId: {
      type: String,
      default: ''
    },
    size: {
      type: String,
      default: '',
      validator(v) {
        return ['', 'small'].includes(v)
      }
    }
  },
  methods: {
    async follow() {
      if (!this.$store.state.auth.token) {
        this.$loginModal(this)
        return
      }
      if (!this.followeeId) {
        return
      }
      let res = {}
      this.type === 'user' && (res = await this.followUser())
      this.type === 'tag' && (res = await this.followTag())
      if (res.s === 1) {
        this.$emit('update:is-follow', !this.isFollow)
      }
    },
    followUser(){
      return this.$api.followUser({
        method: this.isFollow ? 'delete' : 'put',
        follower: this.$store.state.auth.userId,
        followee: this.followeeId
      })
    },
    followTag(){
      return this.$api.followTag({
        method: this.isFollow ? 'delete' : 'put',
        tagId: this.followeeId
      })
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

  &.follow-btn--small{
    width: 55px;
    height: 26px;
    line-height: 26px;
    font-size: 13px;
  }

  &.follow-user-btn{
    color: $success;
    border: 1px solid $success;
  }

  &.follow-tag-btn{
    color: $success-2;
    border: 1px solid $success-2;
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