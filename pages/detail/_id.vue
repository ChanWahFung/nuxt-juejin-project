<template>
  <div class="detail-container">
    <div class="detail-main">
      <div class="detail-block shadow">
        <div class="detail">
          <div class="detail__header">
            <div class="detail__userInfo">
              <div class="detail__user__avatar" @click="toUser">
                <user-avatar :url="articInfo.user.avatarLarge" :round="true"></user-avatar>
              </div>
              <div class="detail__user__name" @click="toUser">
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
          <nuxt-link :to="'/tag/'+item.title" v-for="item in articInfo.tags" :key="item.id" class="tag">
            <img class="tag__icon" :src="item.icon" />
            <span class="tag__title">{{ item.title }}</span>
          </nuxt-link>
        </div>
        <div v-if="authorInfo" class="author-info" @click="toUser">
          <div class="author__avatar">
            <user-avatar :url="authorInfo.avatarLarge" :round="true"></user-avatar>
          </div>
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
          <div v-if="comments.length !== commentCount" class="comment__more-btn" @click="getMoreComment">查看更多</div>
        </div>
      </div>
      <div class="detail-recommend shadow">
        <div class="recommend-title">相关推荐</div>
        <artic-list :list="recommendArticles"></artic-list>
      </div>
    </div>
    <div class="detail-side">
      <about-author :info="authorInfo"></about-author>
      <about-article :list="aboutArticles"></about-article>
    </div>
  </div>
</template>

<script>
import { formatDate } from '~/utils'
import reachBottom from '~/mixins/reachBottom'
import commentItem from '~/components/business/commentItem.vue'
import aboutAuthor from '~/components/business/aboutAuthor.vue'
import aboutArticle from '~/components/business/aboutArticle.vue'

export default {
  validate ({ params }) {
    if (params.id) {
      return true
    }
    return false
  },
  async asyncData ({ app, params }) {
    // 内容
    const articDetail = await app.$api.getDetail({
      type: 'entryView',
      postId: params.id
    }).then(res => res.s === 1 ? res.d : {})
    // 文章信息
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
    // 相关文章
    const aboutArticles = await app.$api.getRelatedEntry({
      limit: 5,
      entryId: articInfo.objectId
    }).then(res => res.s === 1 ? res.d.entrylist : [])
    let authorInfo = null
    if (articInfo.user) {
      // 用户信息
      authorInfo = await app.$api.getMultiUser({
        ids: articInfo.user.objectId,
        cols: ''
      }).then(res => {
        if (res.s === 1) {
          return res.d[articInfo.user.objectId]
        }
      })
    }
    return {
      articDetail,
      articInfo,
      authorInfo,
      aboutArticles
    }
  },
  components: {
    'comment-item': commentItem,
    'about-author': aboutAuthor,
    'about-article': aboutArticle
  },
  mixins: [reachBottom],
  data () {
    return {
      articDetail: {},
      articInfo: {},
      authorInfo: {},
      aboutArticles: [],
      recommendArticles: [],
      commentCount: 0,
      tagIds: '',
      comments: [],
      catalog: []
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
  mounted () {
    this.$api.getRelatedEntry({
      limit: 'a',
      entryId: this.articInfo.objectId
    })
    this.getCommentList({
      pageSize: 5
    })
    if (this.articInfo.tags) {
      this.tagIds = this.articInfo.tags.map(item => item.id)
    }
    this.$nextTick(() => {
      this.createCatalog()
    })
  },
  methods: {
    formatDate,
    reachBottom(){
      this.getRecommendEntryByTagIds()
    },
    getMoreComment() {
      this.getCommentList({
        pageSize: 20
      })
    },
    getCommentList({ pageSize }) {
      let last = this.comments.slice(-1)[0]
      let createdAt = last ? last.createdAt : ''
      this.$api.getCommentList({
        entryId: this.articDetail.entryId,
        rankType: 'new',
        createdAt,
        pageSize
      }).then(res => {
        if (res.s === 1) {
          this.commentCount = res.d.count
          this.comments = this.comments.concat(res.d.comments)
        }
      })
    },
    // 推荐文章
    getRecommendEntryByTagIds(){
      let last = this.recommendArticles.slice(-1)
      let before = last ? last.rankIndex : ''
      this.$api.getRecommendEntryByTagIds({
        tagIds: this.tagIds.join('|'),
        before,
      }).then(res => {
        if (res.s === 1) {
          this.recommendArticles = this.recommendArticles.concat(res.d.entrylist)
        }
      })
    },
    toUser() {
      this.$router.push('/user/' + this.authorInfo.uid)
    },
    createCatalog() {
      let catalog = []
      function Item(id, title, level){
        this.id = id
        this.title = title
        this.level = level
        this.children = []
      }
      // 一级目录
      function addC1(item){
        catalog.push(item)
      }
      // 二级目录
      function addC2(item){
        const lastC1 = catalog[catalog.length - 1]
        if (!lastC1) {
          catalog[0] = new Item('', '', 'c1')
        }
        lastC1.children.push(item)
      }
      // 三级目录
      function addC3(item){
        const lastC1 = catalog[catalog.length - 1]
        const lastC2 = lastC1.children[lastC1.children.length - 1]
        if (!lastC2) {
          lastC1.children[0] = new Item('', '', 'c2')
        }
        lastC2.children.push(item)
      }
      document.querySelectorAll('.detail__content .heading').forEach((item, index) => {
        if (item.tagName == 'H1') {
          addC1(new Item(`heading-${index}`, item.textContent, 'c1'))
        } else if (item.tagName == 'H2') {
          addC2(new Item(`heading-${index}`, item.textContent, 'c2'))
        } else if (item.tagName == 'H3') {
          addC3(new Item(`heading-${index}`, item.textContent, 'c3'))
        }
      })
      this.catalog = catalog
    }
  }
}
</script>

<style lang='scss' scoped>
.detail-container{
  display: flex;

  .detail-main{
    width: 700px;
    margin-right: 20px;

    .detail-block{
      padding: 0 25px;
      background: #fff;
    }

    .detail-recommend{
      margin-top: 20px;
      background: #fff;

      .recommend-title{
        padding: 20px 25px;
        font-weight: bold;
        border-bottom: 1px solid #eee;
      }
    }
  }

  .detail-side{
    width: 240px;
  }
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

    /deep/ h1{
      padding-bottom: 12px;
      font-size: 26px;
      font-weight: 700;
      border-bottom: 1px solid #ececec;
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

    /deep/ ol,
    /deep/ ul{
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
      word-break: break-all;

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
    cursor: pointer;
  }

  .detail__user__name{
    display: flex;
    align-items: center;
    font-weight: 700;
    color: #333;
    cursor: pointer;
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

  .comment__more-btn{
    padding: 10px;
    text-align: center;
    font-size: 14px;
    color: #406599;
    cursor: pointer;

    &:hover{
      opacity: .8;
    }
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
    text-decoration: none;

    .tag__icon{
      width: 21px;
      height: 21px;
    }

    .tag__title{
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
  cursor: pointer;

  .author__avatar{
    width: 40px;
    height: 40px;
    border-radius: 50%;
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