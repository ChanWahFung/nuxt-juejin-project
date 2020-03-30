<template functional>
  <div class="user-item">
    <img v-if="props.item.avatarLarge" class="user-item-avatar" :src="props.item.avatarLarge" />
    <img v-else class="user-item-avatar" src="https://b-gold-cdn.xitu.io/v3/static/img/default-avatar.e30559a.svg" />
    <span class="user-item-username" v-html="props.item.username"></span>
    <div class="user-item-follow">关注</div>
  </div>
</template>

<style lang='scss' scoped>
.user-item {
  display: flex;
  align-items: center;
  padding: 20px 25px;

  .user-item-avatar {
    position: relative;
    width: 42px;
    height: 42px;
    margin-right: 15px;
    border-radius: 50%;
    overflow: hidden;
  }

  .user-item-username {
    font-weight: bold;
    color: #2e3135;

    /deep/ em {
      color: #e8001c;
    }
  }

  .user-item-follow{
    margin-left: auto;
    padding: 6px 20px;
    font-size: 14px;
    color: $success;
    border: 1px solid $success;
    border-radius: 2px;
  }
}
</style>