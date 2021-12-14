<template>
  <div class="post-item">
    <div class="post-item__user">
      <div class="user__avatar">
        <user-avatar :url="item.author_user_info.avatar_large" :round="true"></user-avatar>
      </div>
      <span>{{ item.author_user_info.user_name }} · {{ item.article_info.ctime | formatTime }}</span>
    </div>
    <nuxt-link :to="'/detail/'+detailId" class="post-item__cover" v-if="item.author_user_info.cover_image" :style="{'background-image': `url(${item.author_user_info.cover_image})`}" target="_blank"></nuxt-link>
    <h1 class="post-item__title">
      <nuxt-link :to="'/detail/'+detailId" target="_blank">{{ item.article_info.title }}</nuxt-link>
    </h1>
    <p class="post-item__content">
      <nuxt-link :to="'/detail/'+detailId" target="_blank">{{ item.article_info.brief_content }}</nuxt-link>
    </p>
    <div class="post-item__mate">
      <ul class="meta__action">
        <li class="action-item" :class="{active: item.user_interact.is_collect}" @click.stop="articleLike">
          <img v-if="item.user_interact.is_collect" class="action-item__icon" src="https://b-gold-cdn.xitu.io/v3/static/img/zan-active.930baa2.svg">
          <img v-else class="action-item__icon" src="~assets/images/png/like.png">
          {{ item.article_info.digg_count }}
        </li>
        <li class="action-item">
          <img class="action-item__icon" src="~assets/images/png/comment.png">
          {{ item.article_info.comment_count }}
        </li>
      </ul>
      <div class="meta__info">
        <span class="meta__count">阅读 {{ item.article_info.view_count }}</span>
        <nuxt-link class="meta__original" :to="'/detail/'+detailId" target="_blank">阅读原文</nuxt-link>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    item: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      likeLoading: false
    }
  },
  computed: {
    detailId() {
      return this.item.article_id
    }
  },
  methods: {
    async articleLike() {
      if (!this.$store.state.auth.token) {
        this.$loginModal(this)
        return
      }
      if (this.likeLoading) {
        return
      }
      let objectId = this.item.objectId
      if (objectId) {
        this.likeLoading = true
        let res = await this.$api.articleLike({
          entryId: objectId,
          isCollected: !this.item.isCollected
        })
        if (res.s === 1) {
          this.$emit('update:item', {
            ...this.item,
            isCollected: !this.item.isCollected,
            collectionCount: this.item.isCollected ? Number(this.item.collectionCount) - 1 : Number(this.item.collectionCount) + 1
          })
        }
        this.likeLoading = false
      }
    }
  },
}
</script>

<style lang='scss' scoped>
.post-item{
  padding: 30px;
  background: #fff;
  border-top: 1px solid hsla(0,0%,59.2%,.1);

  .post-item__user{
    display: flex;
    align-items: center;
    margin-bottom: 15px;
    font-size: 14px;
    color: #8b8b8b;

    .user__avatar{
      width: 30px;
      height: 30px;
      margin-right: 10px;
      border-radius: 50%;
      object-fit: cover;
    }
  }

  .post-item__cover{
    display: block;
    height: 210px;
    margin-bottom: 20px;
    background-size: cover;
    background: 50%/cover;
    background-color: #f8f9fa;
    cursor: pointer;
    border-radius: 3px;
  }

  .post-item__title{
    font-size: 24px;
    font-weight: bold;
    color: #000;
    line-height: 1.3;
    cursor: pointer;

    &:hover{
      color: $theme;
    }
  }

  .post-item__content{
    margin-top: 10px;
    font-size: 15px;
    color: #8b8b8b;
    letter-spacing: 1px;
    line-height: 1.5;
    cursor: pointer;
  }
}
.post-item__mate{
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 20px;

  .meta__action {
    display: flex;
    align-items: center;
    font-weight: 700;
    font-size: 13px;
    color: #b2bac2;

    .action-item {
      display: flex;
      align-items: center;
      height: 26px;
      padding: 0 10px;
      border: 1px solid #edeeef;
      cursor: pointer;

      .action-item__icon{
        margin-right: 3px;
        display: block;
        width: 16px;
        height: 16px;
      }

      &.active{
        color: $success;
      }

      &:last-child {
        border-left: 0;
      }
    }
  }

  .meta__info{
    font-size: 12px;
    color: rgba(24,37,50,.3);

    >span:hover{
      color: #8b8b8b;
    }

    .meta__count{
      margin-right: 15px;
    }

    .meta__original{
      cursor: pointer;
    }
  }

}
</style>