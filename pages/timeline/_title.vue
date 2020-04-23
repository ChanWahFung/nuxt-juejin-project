<template>
  <div>
    <timeline-category :channels="categoryList"></timeline-category>
    <div class="index-container">
      <div class="index-main shadow">
        <div class="list__header">
          <ul class="list__nav">
            <li class="list__nav-item" :class="{'list__nav-item--active': item.id == navId}" v-for="item in navs" :key="item.title" @click="changeNavType(item)">{{ item.title }}</li>
            <el-select v-if="navTypes.length" size="mini" style="width:100px" v-model="navType" placeholder="请选择" @change="changeNavType">
              <el-option v-for="item in navTypes" :key="item.title" :label="item.title" :value="item.type">
              </el-option>
            </el-select>
          </ul>
        </div>
        <artic-list :list="list"></artic-list>
      </div>
      <div class="index-side">
        <author-rank :list="recommendAuthors"></author-rank>
        <recommend-book :list="recommendBooks"></recommend-book>
      </div>
    </div>
  </div>
</template>

<script>
import reachBottom from '~/mixins/reachBottom'
import authorRank from '~/components/business/authorRank'
import recommendBook from '~/components/business/recommendBook'
import timelineCategory from '~/components/business/timelineCategory'

export default {
  async asyncData({ app, params, store }) {
    // 分类列表
    let initCategoryList = [{ id: 0, name: '推荐', title: 'recommended' }]
    let categoryList = []
    // 获取分类列表缓存
    if (store.state.category.timelineCategoryList.length) {
      categoryList = store.state.category.timelineCategoryList
    } else {
      categoryList = await app.$api.getCategories().then(res => res.s === 1 ? initCategoryList.concat(res.d.categoryList) : initCategoryList)
      store.commit('category/update_timelineCategoryList', categoryList)
    }
    let currentCategoryItem = categoryList.filter(item => item.title === params.title)[0] || initCategoryList[0]
    let [indexData, recommendAuthors, recommendBooks] = await Promise.all([
      // 文章列表
      app.$api.getIndexList({
        first: 20,
        order: 'POPULAR',
        category: currentCategoryItem.id || ''
      }).then(res => res.s == 1 ? res.d : {}),
      // 推荐作者
      app.$api.getRecommendAuthor({ 
        limit: 5
      }).then(res => res.s == 1 ? res.d : []),
      // 推荐小册
      app.$api.getRecommendBook().then(res => res.s === 1 ? res.d.data : []),
    ])
    return {
      currentCategoryItem,
      categoryList,
      list: indexData.edges || [],
      pageInfo: indexData.pageInfo || {},
      recommendAuthors,
      recommendBooks
    };
  },
  head () {
    return {
      title: `${this.currentCategoryItem.name ? this.currentCategoryItem.name + ' - ' : ''}掘金`
    }
  },
  mixins: [reachBottom],
  components: {
    'author-rank': authorRank,
    'recommend-book': recommendBook,
    'timeline-category': timelineCategory
  },
  data() {
    return {
      navs: [
        {
          id: 1,
          title: '热门',
          type: 'POPULAR'
        },
        {
          id: 2,
          title: '最新',
          type: 'NEWEST'
        },
        {
          id: 3,
          title: '热榜',
          type: 'THREE_DAYS_HOTTEST',
          types: [
            {
              title: '3天内',
              type: 'THREE_DAYS_HOTTEST'
            },
            {
              title: '7天内',
              type: 'WEEKLY_HOTTEST'
            },
            {
              title: '30天内',
              type: 'MONTHLY_HOTTEST'
            },
            {
              title: '全部',
              type: 'HOTTEST'
            }
          ]
        }
      ],
      navId: 1,
      navType: 'POPULAR',
      navTypes: [],
      categoryList: [],
      currentCategoryItem: {},
      tags: [],
      list: [],
      pageInfo: {},
      recommendAuthors: [],
      recommendBooks: [],
      isReachBottomFetching: false,  // 防止触底多次请求
    };
  },
  methods: {
    reachBottom() {
      if (this.pageInfo.hasNextPage) {
        this.getArticList({
          isLoadMore: true
        })
      } else {
        this.$message.info('没有更多文章了')
      }
    },
    // 热门 最新 热榜
    changeNavType (item) {
      if (item.id && this.navId !== item.id) {
        this.navId = item.id
        this.navType = item.type
        this.navTypes = item.types || []
      }
      this.getArticList()
    },
    async getArticList({ isLoadMore = false } = {}){
      if (this.isReachBottomFetching) {
        return
      }
      this.isReachBottomFetching = true
      let params = {
        first: 20,
        after: '',
        order: this.navType,
        tags: this.tags,
        category: this.currentCategoryItem.id || ''
      }
      if (isLoadMore) {
        params.after = this.pageInfo.endCursor || ''
      }
      let res = await this.$api.getIndexList(params);
      if (res.s == 1) {
        this.list = isLoadMore ? this.list.concat(res.d.edges) : res.d.edges
        this.pageInfo = res.d.pageInfo
        this.isReachBottomFetching = false
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.index-container{
  display: flex;
  margin-top: 60px;

  .index-main{
    width: 700px;
    margin-right: 20px;
    background: #fff;
    border-radius: 2px;
  }

  .index-side{
    width: 240px;
  }
}
.list__header{
  padding: 15px 25px;
  border-bottom: 1px solid #eee;
}

.list__nav{
  height: 28px;
  display: flex;
  align-items: center;
  
  .list__nav-item{
    display: inline-block;
    font-size: 14px;
    color: #909090;
    cursor: pointer;

    &:hover,
    &.list__nav-item--active{
      color: $theme;
    }

    &:not(:last-child){
      &::after{
        content: '|';
        margin: 10px;
        color: #eee;
      }
    }
  }
}
</style>
