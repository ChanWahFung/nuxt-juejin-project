<template>
  <div class="post-item">
    <div class="post-item__user">
      <div class="user__avatar">
        <user-avatar :url="item.user.avatarLarge" :round="true"></user-avatar>
      </div>
      <span>{{ item.user.username }} · {{ item.createdAt | formatTime }}</span>
    </div>
    <div class="post-item__cover" v-if="item.screenshot" :style="{'background-image': `url(${item.screenshot})`}" @click="toDetail(item.originalUrl)"></div>
    <h1 class="post-item__title">
      <span @click="toDetail(item.originalUrl)">{{ item.title }}</span>
    </h1>
    <p class="post-item__content">
      <span @click="toDetail(item.originalUrl)">{{ item.content }}</span>
    </p>
    <div class="post-item__mate">
      <ul class="meta__action">
        <li class="meta-item" :class="{active: item.isCollected}">
          <img v-if="item.isCollected" class="meta-item__icon" src="https://b-gold-cdn.xitu.io/v3/static/img/zan-active.930baa2.svg">
          <img v-else class="meta-item__icon" src="https://b-gold-cdn.xitu.io/v3/static/img/zan.e9d7698.svg">
          {{ item.collectionCount }}
        </li>
        <li class="meta-item">
          <img class="meta-item__icon" src="https://b-gold-cdn.xitu.io/v3/static/img/comment.4d5744f.svg">
          {{ item.commentsCount }}
        </li>
      </ul>
      <div class="read-original" @click="toDetail(item.originalUrl)">阅读原文</div>
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
    }
  },
  methods: {
    toDetail(originalUrl) {
      if (!originalUrl) { 
        return 
      }
      let href = originalUrl.includes('juejin') ? `/detail/${originalUrl.split('/').pop()}` : originalUrl
      window.open(href, '_blank', 'noopener noreferrer')
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

    .meta-item {
      display: flex;
      align-items: center;
      height: 26px;
      padding: 0 10px;
      border: 1px solid #edeeef;

      .meta-item__icon{
        margin-right: 3px;
      }

      &.active{
        color: $success;
      }

      &:last-child {
        border-left: 0;
      }
    }
  }

  .read-original{
    font-size: 12px;
    color: #999;
    cursor: pointer;
  }
}
</style>