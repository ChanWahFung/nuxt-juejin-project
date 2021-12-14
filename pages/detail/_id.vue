<template>
  <div class="detail-container">
    <div class="detail-main">
      <div class="detail-block shadow">
        <div class="detail">
          <div class="detail__header">
            <div class="detail__userInfo">
              <nuxt-link :to="'/user/' + articDetail.author_user_info.user_id" class="detail__user__avatar" target="_blank">
                <user-avatar :url="articDetail.author_user_info.avatar_large" :round="true"></user-avatar>
              </nuxt-link>
              <nuxt-link :to="'/user/' + articDetail.author_user_info.user_id" class="detail__user__name" target="_blank">
                <span style="margin-right: 10px">{{ articDetail.author_user_info.user_name }}</span>
                <level :level="articDetail.author_user_info.level"></level>
              </nuxt-link>
              <div class="detail__user__meta">
                <span class="meta__time">{{ articDetail.article_info.ctime | formatTime }}</span>
                <span>阅读{{ articDetail.article_info.view_count }}</span>
              </div>
            </div>
            <follow-btn :is-follow.sync="articDetail.user_interact.is_follow" type="user" :followee-id="articDetail.author_user_info.user_id"></follow-btn>
          </div>
          <div v-if="articDetail.article_info.cover_image" class="detail__cover" :style="`background-image: url(${articDetail.article_info.cover_image})`"></div>
          <h1 class="detail__title">{{ articDetail.article_info.title }}</h1>
          <div class="detail__content" v-html="content"></div>
        </div>
        <div class="tags">
          <p class="tags__title">关注下面的标签，发现更多相似文章</p>
          <nuxt-link :to="'/tag?name='+item.tag_name" v-for="item in articDetail.tags" :key="item.tag_id" class="tag" target="_blank">
            <img class="tag__icon" :src="item.icon" />
            <span class="tag__title">{{ item.tag_name }}</span>
          </nuxt-link>
        </div>
        <nuxt-link :to="'/user/' + articDetail.author_user_info.user_id" class="author-info" target="_blank">
          <div class="author__avatar">
            <user-avatar :url="articDetail.author_user_info.avatar_large" :round="true"></user-avatar>
          </div>
          <div class="author-info__main">
            <div>
              <span class="author__name">{{ articDetail.author_user_info.user_name }}</span>
              <level :level="articDetail.author_user_info.level"></level>
              <span>
                {{ articDetail.author_user_info.job_title }}
                {{ articDetail.author_user_info.job_title && articDetail.author_user_info.company ? ' @ ' : '' }}
                {{ articDetail.author_user_info.company }}
              </span>
            </div>
            <div>
              <span>发布了 {{ articDetail.author_user_info.post_article_count }} 篇专栏 · </span>
              <span>获取点赞 {{ articDetail.author_user_info.got_digg_count }} · </span>
              <span>获取阅读 {{ articDetail.author_user_info.got_view_count }}</span>
            </div>
          </div>
        </nuxt-link>
        <div class="comment-area">
          <p class="comment-area__title">评论</p>
          <div style="padding-left: 50px">
            <comment-item v-for="(item, index) in comments" :key="item.id" :index="index" :author-id="articDetail.author_user_info.user_id" :data="item" @reply-more="getMoreReply"></comment-item>
            <div v-if="commentInfo.hasMore" class="comment__more-btn" @click="getMoreComment">查看更多</div>
          </div>
        </div>
      </div>
      <div class="detail-recommend shadow">
        <div class="recommend-title">相关推荐</div>
        <artic-list :list="recommendArticles"></artic-list>
      </div>
    </div>
    <div class="detail-side">
      <about-author :info="articDetail"></about-author>
      <about-article :list="aboutArticles"></about-article>
      <catalog></catalog>
    </div>
    <article-suspended-panel ref="panel" :artic-detail="articDetail" @setgood-handler="setGood"></article-suspended-panel>
  </div>
</template>

<script>
import markdownit from 'markdown-it'
import highlight from 'highlight.js'
import reachBottom from '~/mixins/reachBottom'
import commonRequest from '~/mixins/commonRequest'
import aboutAuthor from '~/components/business/detail/aboutAuthor.vue'
import aboutArticle from '~/components/business/detail/aboutArticle.vue'
import articleSuspendedPanel from '~/components/business/detail/articleSuspendedPanel'
import catalog from '~/components/business/detail/catalog.vue'

export default {
  async asyncData ({ app, params }) {
    // 文章信息
    const articDetail = await app.$api.getDetail({
      article_id: params.id
    }).then(res => res.err_no === 0 ? res.data : {})
    // 格式化文章内容
    let content = ''
    let info = articDetail.article_info
    if (info) {
      content = info.mark_content
        ? markdownit({
          html: true,
          linkify: true,
          typographer: true,
          langPrefix: 'hljs hl',
          highlight(str, lang) {
            if (lang && highlight.getLanguage(lang)) {
              try {
                return highlight.highlight(lang, str).value;
              } catch (__) {}
            }
            return ''; // 使用额外的默认转义
          }
        }).render(info.mark_content)
        : info.content
    }
    // 相关文章
    let aboutArticles = null
    if (articDetail.author_user_info && articDetail.tags) {
      aboutArticles = await app.$api.getRelatedEntry({
        item_id: params.id,
        user_id: articDetail.author_user_info.user_id,
        tag_ids: articDetail.tags.map(item => item.tag_id)
      }).then(res => res.err_no === 0 ? res.data : [])
    }
    return {
      content,
      articDetail,
      aboutArticles
    }
  },
  head () {
    return {
      title: this.articDetail.article_info.title,
      meta: [
        { hid: 'description', name: 'description', content: this.articDetail.article_info.brief_content }
      ]
    }
  },
  validate ({ params }) {
    if (params.id && params.id != 'undefined') {
      return true
    }
    return false
  },
  components: {
    aboutAuthor,
    aboutArticle,
    articleSuspendedPanel,
    catalog
  },
  mixins: [reachBottom, commonRequest],
  data () {
    return {
      content: '',
      articDetail: {},
      aboutArticles: [],
      recommendArticles: [],
      comments: [],
      // 评论分页信息
      commentInfo: {
        hasMore: true,
        cursor: ''
      },
      // 末尾推荐文章信息
      recommendArticlesInfo: {
        hasMore: true,
        cursor: ''
      },
      tagIds: '',
    }
  },
  mounted () {
    this.setTagIds()
    this.getCommentList()
    this.getRecommendEntryByTagIds()
    if (location.hash === '#comment') {
      this.$refs.panel.scrollIntoComment()
    }
  },
  methods: {
    reachBottom(){
      if (this.recommendArticlesInfo.hasMore) {
        this.getRecommendEntryByTagIds()
      }
    },
    getMoreComment() {
      if (this.commentInfo.hasMore) {
        this.getCommentList()
      }
    },
    setTagIds() {
      if (this.articDetail.tags) {
        this.tagIds = this.articDetail.tags.map(item => item.tag_id)
      }
    },
    // 获取评论
    getCommentList() {
      this.$api.getCommentList({
        item_type: 2,
        item_id: this.$route.params.id,
        limit: 10,
        cursor: this.commentInfo.cursor
      }).then(res => {
        if (res.err_no === 0) {
          this.comments.push(...res.data)
          this.commentInfo = {
            hasMore: res.has_more,
            cursor: res.cursor
          }
        }
      })
    },
    // 推荐文章
    getRecommendEntryByTagIds(){
      this.$api.getRecommendEntryByTagIds({
        item_id: this.$route.params.id,
        user_id: this.articDetail.author_user_info.user_id,
        cursor: this.recommendArticlesInfo.cursor,
        sort_type: 200,
        tag_ids: this.tagIds
      }).then(res => {
        if (res.err_no === 0) {
          this.recommendArticles = this.recommendArticles.concat(res.data)
          this.recommendArticlesInfo = {
            hasMore: res.has_more,
            cursor: res.cursor
          }
        }
      })
    },
    // 点赞（暂时废了）
    setGood() {
      if (!this.$store.state.auth.token) {
        this.$loginModal(this)
        return
      }
      let isLike = this.articDetail.user_interact.is_digg
      let count = this.articDetail.article_info.digg_count
      this.$api.articleLike({
        isCollected: !isLike,
        entryId: this.articDetail.entryId
      }).then(res => {
        if (res.s === 1) {
          isLike = !isLike
          isLike ? count++ : count--
        }
      })
    },
    // 更多回复
    getMoreReply({ index }) {
      let comment = this.comments[index]
      this.$api.getReplyList({
        item_type: 2,
        item_id: this.$route.params.id,
        limit: 5,
        cursor: comment.cursor || '',
        comment_id: comment.comment_id,
      }).then(res => {
        if (res.err_no === 0) {
          comment.reply_infos = comment.cursor ? comment.reply_infos.concat(res.data) : res.data
          comment.cursor = res.cursor
          comment.has_reply_more = res.has_more
        }
      })
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

     ::v-deep  img{
      width: 100%;
    }

     ::v-deep  strong{
      font-weight: bold;
    }

     ::v-deep  p{
      margin: 22px 0;

      >code{
        background-color: rgb(255, 245, 245);
        color: rgb(255, 80, 44);
        font-size: 13px;
        padding: 1px 5px;
        border-radius: 2px;
        overflow-x: auto;
      }
    }

     ::v-deep  h1{
      margin-top: 40px;
      margin-bottom: 12px;
      font-size: 26px;
      font-weight: 700;
    }

     ::v-deep  h2{
      margin-top: 24px;
      margin-bottom: 12px;
      font-size: 24px;
      font-weight: 700;
      border-bottom: 1px solid rgb(236, 236, 236);
    }

     ::v-deep  h3{
      margin-top: 15px;
      margin-bottom: 12px;
      font-size: 18px;
      font-weight: 700;
    }

     ::v-deep  h4{
      margin-top: 15px;
      margin-bottom: 12px;
      font-size: 16px;
      font-weight: 700;
    }

     ::v-deep  h5{
      margin-top: 5px;
      margin-bottom: 5px;
      font-size: 14px;
      font-weight: 700;
    }

     ::v-deep  code{
      font-size: 13px;
      line-height: 1.8;
      letter-spacing: .6px;
    }

     ::v-deep  ol,
     ::v-deep  ul{
      padding-left: 28px;
      list-style: initial;
      list-style-type: decimal;
    }

     ::v-deep  li{
      padding-left: 6px;
      list-style: initial;
      list-style-type: decimal;
    }

     ::v-deep  blockquote{
      color: #666;
      padding: 1px 23px;
      margin: 22px 0;
      border-left: 4px solid #cbcbcb;
      background-color: #f8f8f8;
    }

     ::v-deep  a{
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
  padding: 20px 0;

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