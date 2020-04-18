<template>
  <nav class="nav-view shadow" :class="{'nav-view--sticky': !isTopbarBlock}">
    <ul class="nav-list">
      <li class="nav-item" :class="{'nav-item--active': item.title === currentCategoryItem.title}" v-for="item in categoryList" :key="item.id" @click="navItemClick(item)">{{ item.name }}</li>
      <nuxt-link tag="li" to="/subscribe" class="nav-item" style="margin-left: auto;">标签管理</nuxt-link>
    </ul>
  </nav>
</template>

<script>
import { mapState, mapMutations } from 'vuex'
export default {
  model: {
    prop: 'currentCategoryItem',
    event: 'update-item'
  },
  props: {
    currentCategoryItem: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      categoryList: []
    }
  },
  computed: {
    ...mapState([
      'isTopbarBlock'
    ])
  },
  mounted() {
    this.getCategories()
  },
  methods: {
    ...mapMutations([
      'updateTopbarBlock'
    ]),
    async getCategories() {
      let res = await this.$api.getCategories()
      if (res.s === 1) {
        this.categoryList = [
          {
            id: 0,
            name: '推荐',
            title: 'recommended'
          },
          ...res.d.categoryList
        ]
        if (this.$route.params.title) {
          let arr = this.categoryList.filter(item => item.title === this.$route.params.title)
          arr[0] && (this.$emit('update-item', arr[0]))
        } else {
          this.$emit('update-item', this.categoryList[0])
        }
      }
    },
    async getTagByCategories(categoryId) {
      await this.$api.getTagByCategories({
        categoryId,
        limit: 15
      })
    },
    navItemClick(item) {
      if (this.currentCategoryItem.title != item.title) {
        this.isTopbarBlock === false && this.updateTopbarBlock(true)
        window.scrollTo({ top: 0 })
        this.$router.push({
          name: 'timeline-title',
          params: {
            title: item.title,
            categoryId: item.id
          }
        })
      }
    }
  }
}
</script>

<style lang='scss' scoped>
.nav-view{
  z-index: 9999;
  position: fixed;
  left: 0;
  top: 60px;
  width: 100vw;
  background: #fff;
  border-top: 1px solid #eee;
  transition: all .2s;

  &.nav-view--sticky{
    top: 0px;
  }
}

.nav-list{
  display: flex;
  width: 960px;
  margin: 0 auto;

  .nav-item{
    padding: 15px 0;
    font-size: 14px;
    color: #71777c;
    cursor: pointer;

    &.nav-item--active,
    &:hover{
      color: $theme;
    }

    &:not(:last-child){
      margin-right: 24px;
    }
  }
}
</style>