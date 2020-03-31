<template>
  <div class="user-item">
    <img v-if="item.avatarLarge" class="user-item-avatar" :src="item.avatarLarge" />
    <img v-else class="user-item-avatar" src="https://b-gold-cdn.xitu.io/v3/static/img/default-avatar.e30559a.svg" />
    <div class="user-item-info">
      <p class="user-item-username" v-html="highlight.username || item.username"></p>
      <p>{{ item.postedPostsCount }}专栏 · {{ item.followersCount }}个关注者</p>
    </div>
    <div class="user-item-follow follow-btn">关注</div>
  </div>
</template>

<script>
export default {
  props: {
    item: {
      type: Object,
      default: () => {}
    },
    highlight: {
      type: Object,
      default: () => {}
    }
  }
}
</script>

<style lang='scss' scoped>
.user-item {
  display: flex;
  padding: 20px 25px;
  cursor: pointer;

  &:hover{
    background: rgba(0,0,0,.01);
  }

  .user-item-avatar {
    position: relative;
    width: 42px;
    height: 42px;
    margin-right: 15px;
    border-radius: 50%;
    overflow: hidden;
  }

  .user-item-info{
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding: 2px 0;
    font-size: 13px;
    color: #8a9aa9;

    .user-item-username {
      font-size: 16px;
      font-weight: bold;
      color: #2e3135;

      /deep/ em {
        color: #e8001c;
      }
    }
  }

  .user-item-follow{
    margin-left: auto;
    align-self: center;
  }
}
</style>