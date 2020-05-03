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
import bookList from '~/components/business/bookList'
import bookCategory from '~/components/business/bookCategory'

export default {
  async asyncData({ app, params, store }) {
    // 小册列表
    let books = await app.$api.getBooks({
      alias: params.alias,
      pageNum: 1
    }).then(res => res.s === 1 ? res.d : [])
    return {
      books
    }
  },
  head() {
    return {
      title: '掘金小册'
    }
  },
  async validate ({ app, params, store }) {
    let initBookCategoryList = [{ name: '全部', alias: '' }]
    let bookCategoryList = []
    // 分类
    if (store.state.category.bookCategoryList.length) {
      bookCategoryList = store.state.category.bookCategoryList
    } else {
      bookCategoryList = await app.$api.getBookChannel()
        .then(res => res.s === 1 ? initBookCategoryList.concat(res.d) : initBookCategoryList)
      store.commit('category/updateBookCategoryList', bookCategoryList)
    }
    return params.alias === undefined || bookCategoryList.includes(params.alias)
  },
  mixins: [reachBottom],
  components: {
    'book-list': bookList,
    'book-category': bookCategory
  },
  data() {
    return {
      // bookCategoryList: [],
      books: [],
      pageNum: 1,
    }
  },
  computed: {
    ...mapState('category', ['bookCategoryList'])
  },
  methods: {
    reachBottom() {
      this.pageNum++
      this.getBooks({ isLoadMore: true })
    },
    async getBooks({ isLoadMore = false } = {}) {
      let res = await this.$api.getBooks({
        alias: this.$route.params.alias,
        pageNum: this.pageNum
      })
      if (res.s === 1) {
        this.books = isLoadMore ? this.books.concat(res.d) : res.d
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