<template>
  <div class="container">
    <div class="main">
      <div class="detail">
        <div class="detail-header">
          <div class="detail-userInfo">
            <img class="detail-user-avatar" :src="articInfo.user.avatarLarge" alt="头像">
            <div class="detail-user-name">
              <span style="margin-right: 10px">{{ articInfo.user.username }}</span>
              <level :level="articInfo.user.level"></level>
            </div>
            <div class="detail-user-meta">
              <span class="meta-time">{{ articInfo.create_date }}</span>
              <span>阅读{{ articInfo.viewsCount }}</span>
            </div>
          </div>
          <div class="detail-follow-btn">关注</div>
        </div>
        <div v-if="articInfo.screenshot" class="detail-cover" :style="`background-image: url(${articInfo.screenshot})`"></div>
        <h1 class="detail-title">{{ articInfo.title }}</h1>
        <div class="detail-content" v-html="articDetail.content"></div>
      </div>
      <div class="tags">
        <p class="tags-title">关注下面的标签，发现更多相似文章</p>
        <div v-for="item in articInfo.tags" :key="item.id" class="tag">
          <img class="tag-icon" :src="item.icon" />
          <span class="tag-title">{{ item.title }}</span>
        </div>
      </div>
      <div v-if="authorInfo" class="author-info">
        <img class="author-avatar" :src="authorInfo.avatarLarge" />
        <div class="author-info-main">
          <div>
            <span class="author-name">{{ authorInfo.username }}</span>
            <level :level="authorInfo.level"></level>
            <span>{{ authorInfo.jobTitle }}</span>
            <span v-if="authorInfo.jobTitle && authorInfo.company">@</span>
            <span>{{ authorInfo.company }}</span>
          </div>
          <div>
            <span>发布了 {{ authorInfo.postedPostsCount }} 篇专栏 · </span>
            <span>获取点赞 {{ authorInfo.totalCollectionsCount }} · </span>
            <span>获取阅读 {{ authorInfo.totalViewsCount }}</span>
          </div>
        </div>
      </div>
      <div class="comment-area">
        <p class="comment-area-title">评论</p>
        <comment-item v-for="item in comments" :key="item.id" :data="item"></comment-item>
      </div>
    </div>
  </div>
</template>

<script>
import { formatDate } from '~/assets/utils'
import commentItem from '~/components/business/commentItem.vue'

export default {
  props: {
    id: {
      type: String,
      default: ''
    }
  },
  async asyncData ({ app, params }) {
    const articDetail = await app.$api.getDetail({
      type: 'entryView',
      postId: params.id
    }).then(res => {
      if (res.s === 1) {
        return res.d
      }
      return {}
    })
    const articInfo = await app.$api.getDetail({
      type: 'entry',
      postId: params.id
    }).then(res => {
      if (res.s === 1) {
        return {
          ...res.d,
          create_date: formatDate('Y年M月D', res.d.createdAt)
        }
      }
      return {}
    })
    let authorInfo = null
    if (articInfo.user) {
      authorInfo = await app.$api.getMultiUser({
        ids: articInfo.user.objectId,
        cols: ''
      }).then(res => {
        if (res.s === 1) {
          return res.d[articInfo.user.objectId]
        }
        return null
      })
    }
    return {
      articDetail,
      articInfo,
      authorInfo
    }
  },
  components: {
    'comment-item': commentItem
  },
  data () {
    return {
      articDetail: {},
      articInfo: {},
      authorInfo: null,
      commentCount: 0,
      comments: []
    }
  },
  head () {
    return {
      title: this.articInfo.title,
      meta: [
        { hid: 'description', name: 'description', content: this.articInfo.content }
      ]
    }
  },
  created () {
    this.getCommentList()
  },
  methods: {
    formatDate,
    getCommentList() {
      this.$api.getCommentList({
        entryId: this.articDetail.entryId
      }).then(res => {
        if (res.s === 1) {
          this.commentCount = res.d.count
          this.comments = res.d.comments
        }
      })
    }
  }
}
</script>

<style lang='scss' scoped>
.main{
  padding: 0 30px;
  background: #fff;
  box-shadow: 0 0 4px #eee;
}
.detail{
  padding-top: 30px;
  border-radius: 2px;

  .detail-header{
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 30px;

    .detail-follow-btn{
      padding: 5px 12px;
      font-size: 14px;
      color: $success;
      border: 1px solid currentColor;
      border-radius: 2px;
    }
  }

  .detail-cover{
    width: 100%;
    padding-top: 50%;
    background-size: cover;
    background-position: 50%;
    margin-bottom: 30px;
  }

  .detail-title{
    margin-bottom: 50px;
    line-height: 1.6;
    font-size: 30px;
    font-weight: 700;
    color: #000;
  }

  .detail-content{
    line-height: 1.6;
    color: #333;

    /deep/ img{
      width: 100%;
    }

    /deep/ p{
      margin: 22px 0;
    }

    /deep/ h2{
      padding-bottom: 12px;
      font-size: 24px;
      font-weight: 700;
      border-bottom: 1px solid #ececec;
    }

    /deep/ code{
      font-size: 13px;
      line-height: 1.8;
      letter-spacing: .6px;
    }

    /deep/ ol{
      padding-left: 28px;
      list-style: initial;
      list-style-type: decimal;
    }
    
    /deep/ li{
      padding-left: 6px;
      list-style: initial;
      list-style-type: decimal;
    }

    /deep/ blockquote{
      color: #666;
      padding: 1px 23px;
      margin: 22px 0;
      border-left: 4px solid #cbcbcb;
      background-color: #f8f8f8;
    }

    /deep/ a{
      color: #0269c8;
      border-bottom: 1px solid #d1e9ff;

      &:hover{
        color: #007fff;
      }

      &:active{
        color: #275b8c;
      }
    }
  }
}

.detail-userInfo{
  display: flex;
  height: 40px;
  flex-direction: column;
  justify-content: space-between;
  position: relative;
  padding-left: 50px;

  .detail-user-avatar{
    position: absolute;
    top: 0;
    left: 0;
    width: 40px;
    height: 40px;
    background: #f4f4f4;
    border-radius: 50%;
  }

  .detail-user-name{
    display: flex;
    align-items: center;
    font-weight: 700;
    color: #333;
  }

  .detail-user-meta{
    letter-spacing: 1px;
    font-size: 14px;
    color: #909090;

    .meta-time{
      margin-right: 10px;
    }
  }
}

.comment-area{
  padding: 20px 0 20px 50px;

  .comment-area-title{
    padding-bottom: 20px;
    color: #777;
    text-align: center;
  }
}

.tags{
  margin-top: 30px;

  .tags-title{
    padding-left: 20px;
    margin-bottom:20px;
    font-weight: bolder;
    color: #333;
    font-size: 15px;
    border-left: 6px solid #ddd;
  }

  .tag{
    display: inline-flex;
    align-items: center;
    margin: 0 20px 20px 0;
    padding: 2px;
    border: 1px solid #ddd;

    .tag-icon{
      width: 21px;
      height: 21px;
    }

    .tag-title{
      padding: 0 5px;
      font-size: 12px;
      color: #999;
    }
  }
}

.author-info{
  display: flex;
  padding: 15px;
  margin: 30px 0;
  background: #f4f4f4;

  .author-avatar{
    position: relative;
    width: 40px;
    height: 40px;
    border-radius: 50%;

    &::after{
      content: '';
      display: block;
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-image: url(https://b-gold-cdn.xitu.io/v3/static/img/default-avatar.e30559a.svg);
      background-size: 100%;
    }
  }

  .author-info-main{
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding: 2px 0;
    color: #999;
    font-size: 14px;
    margin-left: 10px;

    .author-name{
      font-size: 16px;
      font-weight: bold;
      color: #262626;
    }
  }
}
</style>