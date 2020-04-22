<template>
  <div class="book-container">
    <div class="book-main shadow">
      <book-list :list="books"></book-list>
    </div>
  </div>
</template>

<script>
import reachBottom from '~/mixins/reachBottom'
import bookList from '~/components/business/bookList'

export default {
  head() {
    return {
      title: '掘金小册'
    }
  },
  async asyncData({ app }) {
    let books = await app.$api.getBooks({
      alias: '',
      pageNum: 1
    }).then(res => res.s === 1 ? res.d : [])
    return {
      books
    }
  },
  mixins: [reachBottom],
  components: {
    'book-list': bookList
  },
  data() {
    return {
      books: [],
      alias: '',
      pageNum: 1,
    }
  },
  methods: {
    reachBottom() {
      this.pageNum++
      this.getBooks({ isLoadMore: true })
    },
    async getBooks({ isLoadMore = false } = {}) {
      let res = await this.$api.getBooks({
        alias: this.alias,
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