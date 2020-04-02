<template>
  <div class="container">
    <div class="main">
      <div class="detail">
        <div class="detail__header">
          <div class="detail__userInfo">
            <img class="detail__user__avatar" :src="articInfo.user.avatarLarge" alt="头像">
            <div class="detail__user__name">
              <span style="margin-right: 10px">{{ articInfo.user.username }}</span>
              <level :level="articInfo.user.level"></level>
            </div>
            <div class="detail__user__meta">
              <span class="meta__time">{{ articInfo.create_date }}</span>
              <span>阅读{{ articInfo.viewsCount }}</span>
            </div>
          </div>
          <follow-btn></follow-btn>
        </div>
        <div v-if="articInfo.screenshot" class="detail__cover" :style="`background-image: url(${articInfo.screenshot})`"></div>
        <h1 class="detail__title">{{ articInfo.title }}</h1>
        <div class="detail__content" v-html="articDetail.content"></div>
      </div>
      <div class="tags">
        <p class="tags__title">关注下面的标签，发现更多相似文章</p>
        <div v-for="item in articInfo.tags" :key="item.id" class="tag">
          <img class="tag__icon" :src="item.icon" />
          <span class="tag-title">{{ item.title }}</span>
        </div>
      </div>
      <div v-if="authorInfo" class="author-info">
        <img class="author__avatar" :src="authorInfo.avatarLarge" />
        <div class="author-info__main">
          <div>
            <span class="author__name">{{ authorInfo.username }}</span>
            <level :level="authorInfo.level"></level>
            <span>
              {{ authorInfo.jobTitle }}
              {{ authorInfo.jobTitle && authorInfo.company ? ' @ ' : '' }}
              {{ authorInfo.company }}
            </span>
          </div>
          <div>
            <span>发布了 {{ authorInfo.postedPostsCount }} 篇专栏 · </span>
            <span>获取点赞 {{ authorInfo.totalCollectionsCount }} · </span>
            <span>获取阅读 {{ authorInfo.totalViewsCount }}</span>
          </div>
        </div>
      </div>
      <div class="comment-area">
        <p class="comment-area__title">评论</p>
        <comment-item v-for="item in comments" :key="item.id" :data="item"></comment-item>
      </div>
    </div>
  </div>
</template>

<script>
import { formatDate } from '~/utils'
import commentItem from '~/components/business/commentItem.vue'

export default {
  validate ({ params }) {
    if (params.id) {
      return true
    }
    return false
  },
  async asyncData ({ app, params }) {
    const articDetail = await app.$api.getDetail({
      type: 'entryView',
      postId: params.id
    }).then(res => res.s === 1 ? res.d : {})
    const articInfo = await app.$api.getDetail({
      type: 'entry',
      postId: params.id
    }).then(res => {
      if (res.s === 1) {
        return {
          ...res.d,
          create_date: formatDate('Y年MM月DD日', res.d.createdAt)
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

  .detail__header{
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 30px;
  }

  .detail__cover{
    width: 100%;
    padding-top: 50%;
    background-size: cover;
    background-position: 50%;
    margin-bottom: 30px;
  }

  .detail__title{
    margin-bottom: 50px;
    line-height: 1.6;
    font-size: 30px;
    font-weight: 700;
    color: #000;
  }

  .detail__content{
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

.detail__userInfo{
  display: flex;
  height: 40px;
  flex-direction: column;
  justify-content: space-between;
  position: relative;
  padding-left: 50px;

  .detail__user__avatar{
    position: absolute;
    top: 0;
    left: 0;
    width: 40px;
    height: 40px;
    background: #f4f4f4;
    border-radius: 50%;
  }

  .detail__user__name{
    display: flex;
    align-items: center;
    font-weight: 700;
    color: #333;
  }

  .detail__user__meta{
    letter-spacing: 1px;
    font-size: 14px;
    color: #909090;

    .meta__time{
      margin-right: 10px;
    }
  }
}

.comment-area{
  padding: 20px 0 20px 50px;

  .comment-area__title{
    padding-bottom: 20px;
    color: #777;
    text-align: center;
  }
}

.tags{
  margin-top: 30px;

  .tags__title{
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

    .tag__icon{
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

  .author__avatar{
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

  .author-info__main{
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding: 2px 0;
    color: #999;
    font-size: 14px;
    margin-left: 10px;

    .author__name{
      font-size: 16px;
      font-weight: bold;
      color: #262626;
    }
  }
}
</style>