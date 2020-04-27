<template>
  <div class="pin-item">
    <div class="item-main">
      <nuxt-link class="user-avatar" :to="'/user/'+(item.uid || item.user.id)" target="_blank">
        <user-avatar :url="item.user.avatarLarge" :round="true"></user-avatar>
      </nuxt-link>
      <div class="pin-info">
        <div class="user-info">
          <div>
            <nuxt-link class="user-name" :to="'/user/'+(item.uid || item.user.id)" target="_blank">{{ item.user.username }}</nuxt-link>
            <div class="user-job-title">
              {{ item.user.jobTitle }}
              {{ item.user.jobTitle && item.user.company ? '@' : '' }}
              {{ item.user.company }}
              {{ item.user.jobTitle || item.user.company ? ' · ' : '' }}
              {{ item.createdAt | formatTime }}
            </div>
          </div>
          <follow-btn v-if="action !== 'PUBLISH_ARTICLE'" size="small" :is-follow="item.user.viewerIsFollowing" :followee-id="item.user.id"></follow-btn>
        </div>
        <div v-if="action === 'PUBLISH_ARTICLE' || action === 'LIKE_ARTICLE'">
          <div class="pin-title">
            <h3>{{ item.title }}</h3>
          </div>
          <div class="pin-post">
            <div class="pin-post-content">
              {{ item.content }}
            </div>
            <div v-if="item.screenshot" class="pin-post-cover" :style="`background-image: url(${item.screenshot})`"></div>
          </div>
        </div>
        <div v-else>
          <div class="pin-content">
            {{ item.content }}
          </div>
          <a v-if="item.url" :href="item.url" target="_blank" rel="noopener noreferrer">
            <div v-if="item.url" class="pin-link">
              <div class="link-info">
                <div class="link-title ellipsis">{{ item.urlTitle }}</div>
                <div class="link-domain ellipsis">{{ item.url | domainName }}</div>
              </div>
              <div class="link-image" :style="`background-image: url(${item.urlPic})`"></div>
            </div>
          </a>
          <div v-if="item.pictures && item.pictures.length" class="pin-images" :class="{'pin-images--more': item.pictures.length > 1}">
            <div v-for="url in item.pictures" :key="url" class="pin-img" :style="`background-image: url(${url})`">
              <div class="img-holder"></div>
            </div>
          </div>
          <div class="pin-topic" v-if="item.topic">
            <nuxt-link class="topic-title" :to="'/topic/'+item.topic.id" target="_blank">{{ item.topic.title }}</nuxt-link>
          </div>
        </div>
      </div>
    </div>
    <div class="item-meta">
      <div class="meta-item"><img src="~/assets/images/pin-like.svg">&nbsp;{{ item.likeCount }}</div>
      <div class="meta-item"><img src="~/assets/images/pin-comment.svg">&nbsp;{{ item.commentCount }}</div>
      <div class="meta-item"><img src="~/assets/images/pin-share.svg">&nbsp;分享</div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    item: {
      type: Object,
      defalut: () => ({})
    },
    action: {
      type: String,
      default: () => ({})
    }
  },
  filters: {
    domainName(val) {
      let res = val.match(/^(https?|ftp):\/\/([a-zA-Z0-9.-]+(:[a-zA-Z0-9.&%$-]+)*@)*((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]?)(\.(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])){3}|([a-zA-Z0-9-]+\.)*[a-zA-Z0-9-]+\.(com|edu|gov|int|mil|net|org|biz|arpa|info|name|pro|aero|coop|museum|[a-zA-Z]{2}))(:[0-9]+)*(\/($|[a-zA-Z0-9.,?'\\+&%$#=~_-]+))*$/)
      return res ? res[4] : val
    }
  }
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
      display: flex;
      align-items: center;
      justify-content: center;
      flex: 1;
      padding: 5px 0;
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

  .pin-title{
    margin: 5px 0;
    font-weight: bold;
    font-size: 17px;
    color: rgb(23, 24, 26);
    line-height: 1.5;
    
    >h3::before{
      content: '专栏';
      margin-right: 10px;
      padding: 3px 6px;
      display: inline-block;
      font-size: 13px;
      font-weight: 500;
      color: $theme;
      background-color: rgb(229, 242, 255);
      border-radius: 2px;
    }
  }

  .pin-post{
    display: flex;

    .pin-post-content{
      margin-right: 16px;
      font-size: 15px;
      color: rgb(92, 96, 102);
      line-height: 1.5;
      flex: 1 1 auto;
    }

    .pin-post-cover{
      flex: 0 0 65px;
      width: 65px;
      height: 65px;
      background-size: cover;
      background-repeat: no-repeat;
      background-position: center;
      border-radius: 2px;
    }
  }

  .pin-content{
    margin: 5px 0;
    font-size: 15px;
    line-height: 1.6;
    color: #17181a;
    word-break: break-word;
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
      background-position: center;
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