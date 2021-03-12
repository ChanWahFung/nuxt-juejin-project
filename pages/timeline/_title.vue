<template>
  <div>
    <timeline-category :channels="timelineCategoryList"></timeline-category>
    <div class="index-container">
      <div class="index-main shadow">
        <div class="list__header">
          <ul class="list__nav">
            <li class="list__nav-item" :class="{'list__nav-item--active': item.id == navId}" v-for="item in navs" :key="item.title" @click="changeNavType(item)">{{ item.title }}</li>
            <el-select v-if="navTypes.length" size="mini" style="width:100px" v-model="sort_type" placeholder="请选择" @change="changeNavType">
              <el-option v-for="item in navTypes" :key="item.title" :label="item.title" :value="item.type">
              </el-option>
            </el-select>
          </ul>
        </div>
        <artic-list :list="list"></artic-list>
      </div>
      <div class="index-side">
        <author-rank :list="recommendAuthors"></author-rank>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import reachBottom from '~/mixins/reachBottom'
import authorRank from '~/components/business/timeline/authorRank'
import timelineCategory from '~/components/business/timeline/timelineCategory'

export default {
  async asyncData({ app, params, store }) {
    // 分类列表
    let initCategoryList = [{ category_id: 0, category_name: '推荐', category_url: 'recommended' }]
    let currentCategoryItem = store.state.category.timelineCategoryList.filter(item => item.category_url === params.title)[0] || initCategoryList[0]
    let [indexData, recommendAuthors] = await Promise.all([
      // 文章列表
      app.$api.getIndexList({
        cate_id: currentCategoryItem.category_id || '',
        limit: 20,
        sort_type: 200,
        feed_type: currentCategoryItem.category_id ? 'cate' : 'all',
      }).then(res => res.err_no == 0 ? res : {}),
      // 推荐作者
      app.$api.getRecommendAuthor({ 
        limit: 5
      }).then(res => res.err_no == 0 ? res.data : []),
    ])
    // 列表下一页信息
    let pageInfo = {
      cursor: indexData.cursor,
      has_more: indexData.has_more
    }
    return {
      currentCategoryItem,
      list: indexData.data || [],
      pageInfo,
      recommendAuthors
    };
  },
  head () {
    return {
      title: `${this.currentCategoryItem.category_name ? this.currentCategoryItem.category_name + ' - ' : ''}掘金`
    }
  },
  async validate ({ app, params, store }) {
    // 分类列表
    let initCategoryList = [{ category_id: 0, category_name: '推荐', category_url: 'recommended' }]
    let categoryList = []
    // 获取分类列表缓存
    if (store.state.category.timelineCategoryList.length) {
      categoryList = store.state.category.timelineCategoryList
    } else {
      categoryList = await app.$api.getCategories({ show_type: 0 }).then(res => res.err_no === 0 ? initCategoryList.concat(res.data) : initCategoryList)
      store.commit('category/UPDATE_TIMELINE_CATEGORY_LIST', categoryList)
    }
    return params.title === undefined || categoryList.filter(item => item.category_url === params.title).length
  },
  mixins: [reachBottom],
  components: {
    'author-rank': authorRank,
    'timeline-category': timelineCategory
  },
  data() {
    return {
      navs: [
        {
          id: 1,
          title: '热门',
          type: 200
        },
        {
          id: 2,
          title: '最新',
          type: 300
        },
        {
          id: 3,
          title: '热榜',
          type: 3,
          types: [
            {
              title: '3天内',
              type: 3
            },
            {
              title: '7天内',
              type: 7
            },
            {
              title: '30天内',
              type: 30
            },
            {
              title: '全部',
              type: 0
            }
          ]
        }
      ],
      navId: 1,
      sort_type: 200,
      navTypes: [],
      currentCategoryItem: {},
      tags: [],
      list: [],
      pageInfo: {},
      recommendAuthors: [],
      isReachBottomFetching: false,  // 防止触底多次请求
    };
  },
  computed: {
    ...mapState('category', ['timelineCategoryList'])
  },
  methods: {
    reachBottom() {
      if (this.pageInfo.has_more) {
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
        this.sort_type = item.type
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
        feed_type: this.currentCategoryItem.cate_id ? 'cate' : 'all',
        limit: 20,
        cursor: '',
        sort_type: this.sort_type,
        cate_id: this.currentCategoryItem.cate_id || ''
      }
      if (isLoadMore) {
        params.cursor = this.pageInfo.cursor || ''
      }
      let res = await this.$api.getIndexList(params);
      if (res.err_no == 0) {
        this.list = isLoadMore ? this.list.concat(res.data) : res.data
        this.pageInfo = {
          cursor: res.cursor,
          has_more: res.has_more
        }
        this.isReachBottomFetching = false
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.index-container{
  display: flex;

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
