<template>
  <div class="pin-item">
    <div class="item-main">
      <nuxt-link class="user-avatar" :to="'/user/'+item.uid" target="_blank">
        <user-avatar :url="item.user.avatarLarge" :round="true"></user-avatar>
      </nuxt-link>
      <div class="pin-info">
        <div class="user-info">
          <div>
            <nuxt-link class="user-name" :to="'/user/'+item.uid" target="_blank">{{ item.user.username }}</nuxt-link>
            <div class="user-job-title">
              {{ item.user.jobTitle }}
              {{ item.user.jobTitle && item.user.company ? '@' : '' }}
              {{ item.user.company }}
              {{ item.user.jobTitle || item.user.company ? ' · ' : '' }}
              {{ item.createdAt | formatTime }}
            </div>
          </div>
          <follow-btn size="small" :is-follow="item.user.viewerIsFollowing" :followee-id="item.user.id"></follow-btn>
        </div>
        <div class="pin-content">
          {{ item.content }}
        </div>
        <a v-if="item.url" :href="item.url" target="_blank" rel="noopener noreferrer">
          <div v-if="item.url" class="pin-link">
            <div class="link-info">
              <div class="link-title ellipsis">{{ item.urlTitle }}</div>
              <div class="link-domain ellipsis">{{ item.url }}</div>
            </div>
            <div class="link-image" :style="`background-image: url(${item.urlPic})`"></div>
          </div>
        </a>
        <div v-if="item.pictures.length" class="pin-images" :class="{'pin-images--more': item.pictures.length > 1}">
          <div v-for="url in item.pictures" :key="url" class="pin-img" :style="`background-image: url(${url})`">
            <div class="img-holder"></div>
          </div>
        </div>
        <div class="pin-topic" v-if="item.topic">
          <nuxt-link class="topic-title" :to="'/topic/'+item.topic.id" target="_blank">{{ item.topic.title }}</nuxt-link>
        </div>
      </div>
    </div>
    <div class="item-meta">
      <div class="meta-item">点赞</div>
      <div class="meta-item">评论</div>
      <div class="meta-item">分享</div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    item: {
      type: Object,
      defalut: () => ({})
    }
  },
  data() {
    return {
    }
  },
  created() {
  },
  methods: {
  },
}
</script>

<style lang='scss' scoped>
.pin-item{
  border-radius: 2px;
  background: #fff;

  .item-meta{
    display: flex;
    padding: 4px 0;
    border-top: 1px solid #ebebeb;

    .meta-item{
      flex: 1;
      padding: 5px 0;
      text-align: center;
      font-size: 13px;
      color: #8a93a0;

      &:not(:last-child){
        border-right: 1px solid #ebebeb;
      }
    }
  }
}
.item-main{
  position: relative;
  padding: 20px;
  padding-left: 65px;

  .user-avatar{
    position: absolute;
    top: 20px;
    left: 20px;
    width: 45px;
    height: 45px;
  }

  .pin-info{
    margin-left: 15px;
  }

  .user-info{
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 45px;

    .user-name{
      font-size: 15px;
      font-weight: 600;
      color: #2e3135;
    }

    .user-job-title{
      margin-top: 6px;
      font-size: 13px;
      color: #8a9aa9;
    }
  }

  .pin-content{
    margin: 5px 0;
    font-size: 15px;
    line-height: 1.6;
    color: #17181a;
  }

  .pin-link{
    display: flex;
    justify-content: space-between;
    padding: 10px 16px;
    max-width: 100%;
    border: 1px solid #ebebeb;
    border-radius: 4px;

    .link-info{
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      line-height: 1.5;
      overflow: hidden;
    }

    .link-title{
      font-size: 15px;
      font-weight: 500;
      line-height: 1.5;
      color: #000;
    }

    .link-domain{
      font-size: 13px;
      color: #8a93a0;
    }

    .link-image{
      width: 65px;
      height: 65px;
      margin-left: 10px;
      border-radius: 2px;
      background-size: cover;
      background-repeat: no-repeat;
      background-color: #f4f4f4;
    }
  }

  .pin-images{
    display: flex;
    flex-wrap: wrap;

    .pin-img{
      width: 50%;
      margin-top: 3px;
      background-size: cover;
      background-repeat: no-repeat;

      .img-holder{
        padding-top: 100%;
      }
    }
  }

  .pin-images--more .pin-img{
    margin-right: 3px;
    width: calc(25% - 3px);
  }

  .pin-topic{
    margin-top: 8px;

    .topic-title{
      display: inline-block;
      line-height: 22px;
      padding: 0 12px;
      font-size: 13px;
      color: $theme;
      border: 1px solid currentColor;
      border-radius: 14px;
      user-select: none;
    }
  }
}
</style>