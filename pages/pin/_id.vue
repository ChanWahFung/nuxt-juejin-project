<template>
  <div class="pin-detail-container">
    <div class="detail-main">
      <div class="detail-info">
        <pin-item style="border-bottom: 1px solid #eee" :item.sync="pinDetail"></pin-item>
      </div>
      <div class="comment-list">
        <comment-item v-for="(item, index) in comments" :key="item.id" :index="index" :author-id="pinDetail.uid" :data="comments[index]" @reply-more="getMoreReply"></comment-item>
      </div>
    </div>
  </div>
</template>

<script>
import reachBottom from '~/mixins/reachBottom'
export default {
  async asyncData({ app, params }) {
    let [pinDetail, comments] = await Promise.all([
      app.$api.getPinById({
        pinId: params.id
      }).then(res => res.s === 1 ? res.d : {}),
      app.$api.getPinCommentList({
        pinId: params.id,
        pageNum: 1,
        pageSize: 20
      }).then(res => res.s === 1 ? res.d.comments : []),
    ])
    return {
      pinDetail,
      comments
    }
  },
  head() {
    return {
      title: this.pinDetail.content || '掘金'
    }
  },
  validate ({ params }) {
    if (params.id && params.id != 'undefined') {
      return true
    }
    return false
  },
  mixins: [reachBottom],
  data() {
    return {
      pinDetail: {},
      page: 1,
      comments: []
    }
  },
  methods: {
    reachBottom() {
      this.page++
      this.getPinCommentList({ isLoadMore: true })
    },
    async getPinCommentList({ isLoadMore = false } = {}) {
      let res = await this.$api.getPinCommentList({
        pinId: this.$route.params.id,
        pageNum: this.page,
        pageSize: 20
      })
      if (res.s === 1) {
        this.comments = isLoadMore ? this.comments.concat(res.d.comments) : res.d.comment
      }
    },
    // 更多回复
    getMoreReply({ index, pageNum, pageSize }) {
      let comment = this.comments[index]
      this.$api.getPinReplyList({
        commentId: comment.id,
        pageNum,
        pageSize
      }).then(res => {
        if (res.s === 1) {
          let data = pageNum == 1 ? res.d.comments : comment.topComment.concat(res.d.comments)
          this.$set(comment, 'topComment', data)
        }
      })
    }
  },
}
</script>

<style lang='scss' scoped>
.pin-detail-container{
  display: flex;
  
  .detail-main{
    flex: 0 0 640px;
    width: 640px;
  }

  .comment-list{
    padding: 40px 20px 0 80px;
    background: #fff;
  }
}
</style>