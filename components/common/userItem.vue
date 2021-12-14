<template>
  <nuxt-link :to="'/user/'+item.user_id" target="_blank">
    <div class="user-item">
      <div class="user-item__avatar">
        <user-avatar :url="item.avatar_large" :round="true"></user-avatar>
      </div>
      <div class="user-item__info">
        <p class="user-item__userinfo">
          <span class="user-item__username" v-html="highlight.username || item.user_name"></span>
          <span v-if="item.level > 0" style="margin-right: 10px">
            <level :level="item.level"></level>
          </span>
          <span v-if="highlight.job_title" v-html="highlight.job_title"></span>
          <span v-else>
            {{ item.job_title }}
            {{ item.job_title && item.company ? ' @ ' : '' }}
            {{ item.company }}
          </span>
        </p>
        <p>{{ item.post_article_count }}专栏 · {{ item.follower_count }}个关注者</p>
      </div>
      <div class="user-item__btn">
        <follow-btn :is-follow.sync="item.isfollowed" type="user" :followee-id="item.user_id"></follow-btn>
      </div>
    </div>
  </nuxt-link>
</template>

<script>
export default {
  props: {
    item: {
      type: Object,
      default: () => ({})
    },
    highlight: {
      type: Object,
      default: () => ({})
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

  .user-item__avatar {
    position: relative;
    width: 42px;
    height: 42px;
    margin-right: 15px;
    border-radius: 50%;
    overflow: hidden;
    object-fit: contain;
  }

  .user-item__info{
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding: 2px 0;
    font-size: 13px;
    color: #8a9aa9;

    .user-item__userinfo {
      display: flex;
      align-items: center;
      font-size: 14px;
      color: #909090;

      .user-item__username {
        margin-right: 5px;
        font-size: 16px;
        font-weight: bold;
        color: #2e3135;
      }

      ::v-deep  em {
        color: #e8001c;
      }
    }
  }

  .user-item__btn{
    margin-left: auto;
    align-self: center;
  }
}
</style>