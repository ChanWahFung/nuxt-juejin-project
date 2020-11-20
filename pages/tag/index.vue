<template>
  <div>
    <div class="tag-info-box">
      <div class="tag-info">
        <div class="tag-title">{{ tagInfo.tag.tag_name }}</div>
        <div class="tag-meta">{{ tagInfo.tag.concern_user_count }} 关注，{{ tagInfo.tag.post_article_count }} 文章</div>
      </div>
    </div>
    <main class="main">
      <div class="list-header">
        <img class="list-header__icon" :src="tagInfo.tag.icon" />
        <follow-btn type="tag" :is-follow.sync="tagInfo.user_interact.is_follow" :followee-id="tagInfo.tag_id"></follow-btn>
        <div class="list-header__nav">
          <span v-for="item in sortList" :key="item.sort" :class="{'nav--active': sort === item.sort}" @click="changeSort(item.sort)">{{ item.title }}</span>
        </div>
      </div>
      <artic-list :list="articleList"></artic-list>
      <div v-if="articleList.length === 0" class="nodata-tip">暂无文章</div>
    </main>
  </div>
</template>

<script>
import reachBottom from '~/mixins/reachBottom'

export default {
  async asyncData({ app, query, error }) {
    // 标签详情
    const tagInfo = await app.$api.getTagDetail({
      key_word: encodeURIComponent(query.name)
    }).then(res => {
      if (res.err_no === 0) {
        return res.data
      } else {
        error({
          statusCode: 404,
          message: res.m
        })
        return {}
      }
    })
    // 标签下的文章
    const articleListRes = await app.$api.getTagEntry({
      sort_type: 200,
      tag_ids: [tagInfo.tag_id]
    })
    let articleList = []
    let articleListInfo = {}
    if (articleListRes.err_no == 0) {
      articleList = articleListRes.data
      articleListInfo = {
        hasMore: articleListRes.has_more,
        cursor: articleListRes.cursor
      }
    }
    return {
      tagInfo,
      articleList,
      articleListInfo
    }
  },
  head(){
    return {
      title: `${this.$route.query.name} - 标签 - 掘金`
    }
  },
  layout: 'full',
  validate ({ query }) {
    if (query.name && query.name != 'undefined') {
      return true
    }
    return false
  },
  mixins: [reachBottom],
  data() {
    return {
      articleListInfo: {},
      articleList: [],
      tagInfo: null,
      sortList: [
        {
          title: '热门',
          sort: 200
        },
        {
          title: '最新',
          sort: 300
        },
        {
          title: '最热',
          sort: 0
        }
      ],
      sort: 200,
      isReachBottomFetching: false,  // 防止触底多次请求
    }
  },
  methods: {
    reachBottom() {
      if (this.articleListInfo.hasMore) {
        this.getTagEntry({ isLoadMore: true })
      }
    },
    changeSort(sort) {
      if (this.sort !== sort) {
        this.sort = sort
        this.getTagEntry()
      }
    },
    async getTagEntry({ isLoadMore = false } = {}) {
      if (this.isReachBottomFetching && isLoadMore) {
        return
      }
      this.isReachBottomFetching = true
      await this.$api.getTagEntry({
        sort_type: this.sort,
        tag_ids: [this.tagInfo.tag_id]
      }).then(res => {
        if (res.err_no === 0) {
          this.articleList = isLoadMore ? this.articleList.concat(res.data) : res.data
          this.articleListInfo = {
            hasMore: res.has_more,
            cursor: res.cursor
          }
        }
      })
      this.isReachBottomFetching = false
    }
  }
}
</script>

<style lang='scss' scoped>
.tag-info-box{
  position: relative;
  height: 150px;
  background-color: #f8f9fa;
  border-bottom: 1px solid #f1f1f1;
  display: flex;
  align-items: center;
  justify-content: center;
}
.tag-info{
  color: #666;
  text-align: center;

  .tag-title{
    font-size: 25px;
    line-height: 30px;
    font-weight: 700;
    margin-bottom: 10px;
  }

  .tag-meta{
    font-size: 14px;
  }
}
.list-header{
  display: flex;
  align-items: center;
  margin-bottom: 20px;

  .list-header__icon{
    width: auto;
    height: 24px;
    margin-right: 20px;
  }

  .list-header__nav{
    margin-left: auto;
    font-size: 14px;

    span{
      color: #999;
      cursor: pointer;

      &.nav--active{
        color: $theme;
      }

      &:not(:last-child){
        margin-right: 20px;
      }
    }
  }
}
.nodata-tip{
  padding: 20px 0;
  background: #fff;
  text-align: center;
  color: #999;
}
</style>