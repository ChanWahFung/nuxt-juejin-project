<template>
  <div class="pin-item">
    <!-- 关注类型 -->
    <template v-if="action === 'FOLLOW_USER'">
      <div v-if="actors.length" class="follow-block">
        <nuxt-link :to="'/user/'+actors[0].id" class="author-avatar" target="_blank">
          <user-avatar :url="actors[0].avatarLarge" :round="true"></user-avatar>
        </nuxt-link>
        <div class="author-info">
          <div class="author-username ellipsis">
            <nuxt-link :to="'/user/'+actors[0].id" target="_blank">{{ actors[0].username }}</nuxt-link>
            <span class="follow-text">关注了</span>
            <nuxt-link :to="'/user/'+item.id" target="_blank">{{ item.username }}</nuxt-link>
          </div>
          <div class="author-job-title ellipsis">
            {{ actors[0].jobTitle }}
            {{ actors[0].jobTitle && actors[0].company ? '@' : '' }}
            {{ actors[0].company }}
          </div>
        </div>
      </div>
    </template>
    <template v-else>
      <div v-if="action === 'LIKE_ARTICLE' && actors.length" class="item-action">
        {{ $store.state.uid === actors[0].id ? '' : '你关注的' }}
        <nuxt-link :to="'/user/'+actors[0].id" class="actor-username" target="_blank">{{ actors[0].username }}</nuxt-link>
        赞了这篇文章
      </div>
      <div class="item-main">
        <!-- 用户信息区域 -->
        <nuxt-link class="user-avatar" :to="'/user/'+uid" target="_blank">
          <user-avatar :url="item.user.avatarLarge" :round="true"></user-avatar>
        </nuxt-link>
        <div class="pin-info">
          <div class="user-info">
            <div style="width: 70%">
              <nuxt-link class="user-name ellipsis" :to="'/user/'+uid" target="_blank">{{ item.user.username }}</nuxt-link>
              <div class="user-job-title ellipsis">
                {{ item.user.jobTitle }}
                {{ item.user.jobTitle && item.user.company ? '@' : '' }}
                {{ item.user.company }}
                {{ item.user.jobTitle || item.user.company ? ' · ' : '' }}
                {{ item.createdAt | formatTime }}
              </div>
            </div>
            <follow-btn v-if="!item.user.viewerIsFollowing" size="small" :is-follow.sync="item.user.viewerIsFollowing" :followee-id="uid"></follow-btn>
          </div>
          <!-- 文章类型 -->
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
          <!-- 沸点类型 -->
          <div v-else>
            <div class="pin-content">
              <span class="pre" v-for="citem in pinContent" :key="citem.id">
                <template v-if="citem.type === 'text'">{{ citem.value }}</template>
                <a class="url" v-if="citem.type === 'url'" :href="citem.url" target="_blank" rel="noopener noreferrer">
                  <img src="https://b-gold-cdn.xitu.io/v3/static/img/pin-url-link.3f843e8.svg">{{ citem.value }}
                </a>
              </span>
            </div>
            <!-- 网页链接 -->
            <a v-if="item.url" :href="item.url" target="_blank" rel="noopener noreferrer">
              <div v-if="item.url" class="pin-link">
                <div class="link-info">
                  <div class="link-title ellipsis">{{ item.urlTitle }}</div>
                  <div class="link-domain ellipsis">{{ item.url | domainName }}</div>
                </div>
                <div class="link-image" :style="`background-image: url(${item.urlPic})`"></div>
              </div>
            </a>
            <!-- 图片 -->
            <div v-if="item.pictures && item.pictures.length" class="pin-images" :class="{'pin-images--more': item.pictures.length > 1}">
              <div v-for="url in item.pictures" :key="url" class="pin-img" :style="`background-image: url(${url})`" @click="showPicturesModal(url, item.pictures)">
                <div class="img-holder"></div>
              </div>
            </div>
            <!-- 话题 -->
            <div class="pin-topic" v-if="item.topic">
              <nuxt-link class="topic-title" :to="'/topic/'+topicId" target="_blank">{{ item.topic.title }}</nuxt-link>
            </div>
          </div>
        </div>
      </div>
      <!-- 底部栏 -->
      <div class="item-meta">
        <div class="meta-item" @click="pinLike">
          <span class="meta-info" :class="{'meta-info--active': item[isLike]}">
            <img v-if="item[isLike]" src="~/assets/images/pin-like-active.svg">
            <img v-else src="~/assets/images/pin-like.svg">
            &nbsp;{{ item[likeCount] }}
          </span>
        </div>
        <div class="meta-item">
          <nuxt-link v-if="pinId" :to="'/pin/'+pinId" target="_blank">
            <span class="meta-info">
              <img src="~/assets/images/pin-comment.svg">&nbsp;{{ item.commentCount }}
            </span>
          </nuxt-link>
          <template v-else>
            <img src="~/assets/images/pin-comment.svg">&nbsp;{{ item.commentCount }}
          </template>
        </div>
        <div class="meta-item" @click="isSharePanelShow = !isSharePanelShow">
          <span class="meta-info">
            <img src="~/assets/images/pin-share.svg">&nbsp;分享
          </span>
          <div v-show="isSharePanelShow" class="share-panel">
            <div class="share-item" @click.stop="copyLink">
              <img src="~/assets/images/link.svg" alt="">&nbsp;复制链接
            </div>
            <div class="share-item" @click.stop="weiboShare">
              <img src="~/assets/images/weibo.svg" alt="">&nbsp;微博
            </div>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script>
export default {
  props: {
    item: {
      type: Object,
      default: () => ({})
    },
    action: {
      type: String,
      default: ''
    },
    actors: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      isSharePanelShow: false
    }
  },
  computed: {
    // 统一 id值
    pinId() {
      return this.item.id || this.item.objectId
    },
    // 统一 uid值
    uid() {
      return this.item.uid || (this.item.user && this.item.user.id)
    },
    // 统一 topicId值
    topicId() {
      return this.item.topic.id || this.item.topic.objectId
    },
    // 统一 是否点赞字段
    isLike() {
      let fields = ['viewerHasLiked', 'isLiked']
      return fields.filter(key => this.item[key] != undefined)[0]
    },
    // 统一 点赞数字段
    likeCount() {
      let fields = ['likeCount', 'likedCount']
      return fields.filter(key => this.item[key] != undefined)[0]
    },
    // 格式化内容为数组
    pinContent() {
      return this.$utils.splitContentToArray(this.item.content)
    }
  },
  filters: {
    domainName(val) {
      let res = val.match(/^(https?|ftp):\/\/([a-zA-Z0-9.-]+(:[a-zA-Z0-9.&%$-]+)*@)*((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]?)(\.(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])){3}|([a-zA-Z0-9-]+\.)*[a-zA-Z0-9-]+\.(com|edu|gov|int|mil|net|org|biz|arpa|info|name|pro|aero|coop|museum|[a-zA-Z]{2}))(:[0-9]+)*(\/($|[a-zA-Z0-9.,?'\\+&%$#=~_-]+))*$/)
      return res ? res[4] : val
    }
  },
  methods: {
    // 沸点点赞、取消点赞
    async pinLike() {
      if (!this.$store.state.auth.token) {
        this.$loginModal(this)
        return
      }
      let res = await this.$api.likePin({
        method: this.item[this.isLike] ? 'delete' : 'put',
        pinId: this.pinId
      })
      if (res.s === 1) {
        let item = JSON.parse(JSON.stringify(this.item))
        item[this.isLike] = !item[this.isLike]
        item[this.likeCount] = item[this.isLike] ? ++item[this.likeCount] : --item[this.likeCount]
        this.$emit('update:item', item)
      }
    },
    // 分享 - 复制链接
    copyLink() {
      let copyHandle = (content) => {
        let copy = (e) => {
          e.preventDefault()
          e.clipboardData.setData('text/plain', content)
          this.$notify.success('复制成功')
          document.removeEventListener('copy', copy)
        }
        document.addEventListener('copy', copy)
        document.execCommand("Copy");
      }
      let title = `${this.item.content.length > 40 ? this.item.content.slice(0, 40) + '...' : this.item.content}#掘金沸点#`
      let url = `https://juejin.im/pin/${this.pinId}`
      copyHandle(title + '\n' + url)
    },
    // 分享 - 微博
    weiboShare() {
      let title = this.item.content
      let url = `https://juejin.im/pin/${this.pinId}`
      let pic = encodeURIComponent(this.item.pictures[0] || 'https://user-gold-cdn.xitu.io/2019/11/29/16eb707805061e9e?w=1000&h=675&f=jpeg&s=99661')
      window.open(`https://service.weibo.com/share/share.php?title=${title}&url=${url}&pic=${pic}`, '_blank', 'noopener noreferrer')
    },
    // 预览大图
    showPicturesModal(url, urls) {
      this.$picturesModal({
        url,
        urls
      })
    }
  },
}
</script>

<style lang='scss' scoped>
.pin-item{
  border-radius: 2px;
  background: #fff;
}
.follow-block{
  display: flex;
  align-items: center;
  padding: 20px;

  .author-avatar{
    flex: 0 0 45px;
    width: 45px;
    height: 45px;
    margin-right: 15px;
  }

  .author-info{
    flex: 1;
    color: #8a9aa9;
    overflow: hidden;
    
    .author-username{
      font-weight: 600;
      font-size: 15px;
      color: #17181a;
    }

    .follow-text{
      font-weight: 500;
      margin: 0 3px;
      color: #8a9aa9;
    }
  }

  .author-job-title{
    margin-top: 5px;
    font-size: 13px;
  }
}
.item-action{
  padding: 0 20px;
  display: flex;
  height: 43px;
  align-items: center;
  border-bottom: 1px solid #ebebeb;
  font-size: 13px;
  color: #8a9aa9;
  box-sizing: border-box;

  .actor-username{
    color: #333;
    margin: 0 3px;
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
      line-height: 1.3;
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
      background-color: #f4f4f4;
      border-radius: 2px;
    }
  }

  .pin-content{
    margin: 5px 0;

    .pre{
      white-space: pre-wrap;
      word-break: break-word;
      font-size: 15px;
      line-height: 1.6;
      color: #17181a;
    }

    .url{
      color: $theme;

      >img{
        vertical-align: middle;
      }
    }
  }

  .pin-link{
    display: flex;
    justify-content: space-between;
    padding: 10px 16px;
    max-width: 100%;
    border: 1px solid #ebebeb;
    border-radius: 4px;

    &:hover{
      box-shadow: 1px 1px 6px 1px #eee;
    }

    .link-info{
      flex: 1;
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
      flex: 0 0 65px;
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
      background-color: #f4f4f4;
      cursor: zoom-in;

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
.item-meta{
  display: flex;
  padding: 4px 0;
  border-top: 1px solid #ebebeb;

  .meta-item{
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    flex: 1;
    padding: 5px 0;
    font-size: 13px;
    color: #8a93a0;
    cursor: pointer;

    .meta-info{
      display: flex;
      align-items: center;
      justify-content: center;

      &.meta-info--active{
        color: #37c700;
      }
    }

    &:hover .meta-info{
      opacity: .8;
    }

    &:not(:last-child){
      border-right: 1px solid #ebebeb;
    }

    >a{
      display: flex;
      align-items: center;
    }

    .share-panel{
      z-index: 1;
      position: absolute;
      bottom: 112%;
      left: 50%;
      width: 70%;
      background: #fff;
      border-radius: 2px;
      border: 1px solid #eee;
      transform: translateX(-50%);

      .share-item{
        display: flex;
        align-items: center;
        padding: 10px;
        color: #8a93a0;
        font-size: 13px;

        &:not(:last-child){
          border-bottom: 1px solid #eee;
        }
      }
    }
  }
}
</style>