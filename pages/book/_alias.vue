<template>
  <div class="book-container">
    <book-category :channels="bookCategoryList"></book-category>
    <div class="book-main shadow">
      <book-list :list="books"></book-list>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import reachBottom from '~/mixins/reachBottom'
import bookList from '~/components/business/book/bookList'
import bookCategory from '~/components/business/book/bookCategory'

export default {
  async asyncData({ app, params, store }) {
    let currentCategoryItem = store.state.category.bookCategoryList.filter(item => item.category_url == params.alias)[0] || {}
    let booksInfo = {}
    // 小册列表
    let books = await app.$api.getBooks({
      category_id: currentCategoryItem.category_id || 0,
      limit: 20
    }).then(res => {
      if (res.err_no === 0) {
        booksInfo = {
          hasMore: res.has_more,
          cursor: res.cursor
        }
      }
      return res.data || []
    })
    return {
      booksInfo,
      books
    }
  },
  head() {
    return {
      title: '掘金小册'
    }
  },
  async validate ({ app, params, store }) {
    // 分类列表
    let initCategoryList = [{ category_id: 0, category_name: '全部', category_url: 'recommended' }]
    let categoryList = []
    // 获取分类列表缓存
    if (store.state.category.bookCategoryList.length) {
      categoryList = store.state.category.bookCategoryList
    } else {
      categoryList = await app.$api.getCategories({ show_type: 2 }).then(res => res.err_no === 0 ? initCategoryList.concat(res.data) : initCategoryList)
      store.commit('category/UPDATE_BOOK_CATEGORY_LIST', categoryList)
    }
    return params.alias === undefined || categoryList.filter(item => item.category_url === params.alias).length
  },
  mixins: [reachBottom],
  components: {
    'book-list': bookList,
    'book-category': bookCategory
  },
  data() {
    return {
      booksInfo: [],
      books: [],
    }
  },
  computed: {
    ...mapState('category', ['bookCategoryList'])
  },
  methods: {
    reachBottom() {
      if (this.booksInfo.hasMore) {
        this.getBooks({ isLoadMore: true })
      }
    },
    async getBooks({ isLoadMore = false } = {}) {
      let currentCategoryItem = this.bookCategoryList.filter(item => item.category_url == this.$route.params.alias)[0] || {}
      let res = await this.$api.getBooks({
        category_id: currentCategoryItem.category_id,
        limit: 20,
        cursor: this.booksInfo.cursor
      })
      if (res.err_no === 0) {
        this.books = isLoadMore ? this.books.concat(res.data) : res.data
        this.booksInfo = {
          hasMore: res.has_more,
          cursor: res.cursor
        }
      }
    }
  }
}
</script>

<style lang='scss' scoped>
.book-main{
  border-radius: 2px;
}
</style>