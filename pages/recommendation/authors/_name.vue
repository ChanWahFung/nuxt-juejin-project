<template>
  <div>
    <recommend-category :channels="categoryList"></recommend-category>
    <div class="authors-main shadow">
      <div class="user-wrap" v-for="item in authors" :key="item.user_id">
        <user-item2 :item="item"></user-item2>
      </div>
    </div>
  </div>
</template>

<script>
import reachBottom from '~/mixins/reachBottom'
import recommendCategory from '~/components/business/recommendation/recommendCategory'

export default {
  async asyncData({ app, params, store }) {
    let categoryList = []
    // 分类
    if (store.state.category.recommendCategoryList.length) {
      categoryList = store.state.category.recommendCategoryList
    } else {
      let initCategoryList = [{ category_id: 0, category_name: '推荐', category_url: 'recommended' }]
      categoryList = await app.$api.getCategories({ show_type: 1 }).then(res => res.err_no === 0 ? res.data : [])
      categoryList = initCategoryList.concat(categoryList)
      store.commit('category/UPDATE_RECOMMEND_CATEGORY_LIST', categoryList)
    }
    let currentCategoryItem = categoryList.filter(item => item.category_url == params.name)[0] || {}
    // 作者榜单
    let res = await app.$api.getRecommendAuthor({
      category_id: currentCategoryItem.category_id,
      cursor: '0',
      limit: 20
    })
    let authors = []
    let pageInfo = {}
    if (res.err_no == 0) {
      authors = res.data
      pageInfo = {
        hasMore: res.has_more,
        cursor: res.cursor
      }
    }
    return {
      categoryList,
      authors,
      pageInfo
    }
  },
  head () {
    return {
      title: `${this.currentCategoryItem.category_name ? this.currentCategoryItem.category_name + ' - ' : ''}掘金`
    }
  },
  validate ({ params }) {
    if (params.name && params.name != 'undefined') {
      return true
    }
    return false
  },
  mixins: [reachBottom],
  components: {
    'recommend-category': recommendCategory
  },
  data() {
    return {
      categoryList: [],
      authors: [],
      pageInfo: {}
    }
  },
  computed: {
    currentCategoryItem() {
      return this.categoryList.filter(item => item.category_url === this.$route.params.name)[0] || {}
    }
  },
  methods: {
    reachBottom() {
      if (this.pageInfo.hasMore) {
        this.getAuthorRank({ isLoadMore: true })
      }
    },
    async getAuthorRank({ isLoadMore = false } = {}) {
      let res = await this.$api.getRecommendAuthor({
        category_id: this.currentCategoryItem.category_id,
        cursor: this.pageInfo.cursor,
        limit: 20
      })
      if (res.err_no === 0) {
        this.authors = isLoadMore ? this.authors.concat(res.data) : res.data
        this.pageInfo = {
          hasMore: res.has_more,
          cursor: res.cursor
        }
      }
    }
  }
}
</script>

<style lang='scss' scoped>
.authors-main{
  width: 700px;
  background: #fff;
  border-radius: 2px;
}
.user-wrap{
  
  &:not(:last-child){
    border-bottom: 1px solid #eee;
  }
}
</style>