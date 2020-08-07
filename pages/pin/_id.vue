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
    let commentsInfo = {}
    let [pinDetail, comments] = await Promise.all([
      app.$api.getPinDetail({
        msg_id: params.id
      }).then(res => res.err_no === 0 ? res.data : {}),
      app.$api.getCommentList({
        item_type: 4,
        item_id: params.id,
        limit: 10,
      }).then(res => {
        if (res.err_no === 0) {
          commentsInfo = {
            hasMore: res.has_more,
            cursor: res.cursor
          }
        }
        return res.data || []
      })
    ])
    return {
      pinDetail,
      comments,
      commentsInfo
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
      comments: [],
      commentsInfo: {}
    }
  },
  methods: {
    reachBottom() {
      if (this.commentsInfo.hasMore) {
        this.getCommentList({ isLoadMore: true })
      }
    },
    async getCommentList({ isLoadMore = false } = {}) {
      let res = await this.$api.getCommentList({
        item_type: 4,
        item_id: this.$route.params.id,
        limit: 10,
        cursor: this.commentsInfo.cursor
      })
      if (res.err_no === 0) {
        this.comments = isLoadMore ? this.comments.concat(res.data) : res.data
        this.commentsInfo = {
          hasMore: res.hsa_more,
          cursor: res.cursor
        }
      }
    },
    // 更多回复
    getMoreReply({ index }) {
      let comment = this.comments[index]
      this.$api.getReplyList({
        item_type: 4,
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