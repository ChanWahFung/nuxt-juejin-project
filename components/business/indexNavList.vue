<template>
  <nav class="nav-view shadow" :class="{'nav-view--sticky': isTopbarBlock}">
    <ul class="nav-list">
      <li class="nav-item" :class="{'nav-item--active': item.id === currentId}" v-for="item in categoryList" :key="item.id" @click="navItemClick(item)">{{ item.name }}</li>
    </ul>
  </nav>
</template>

<script>
import { mapState, mapMutations } from 'vuex'
export default {
  data() {
    return {
      currentId: 0,
      categoryList: [
        {
          id: 0,
          name: '推荐'
        }
      ]
    }
  },
  computed: {
    ...mapState([
      'isTopbarBlock'
    ]),
    ...mapState('category', [
      'tagsList'
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
        this.categoryList = this.categoryList.concat(res.d.categoryList)
      }
    },
    async getTagByCategories(categoryId) {
      await this.$api.getTagByCategories({
        categoryId,
        limit: 15
      })
    },
    navItemClick(item) {
      if (this.currentId != item.id) {
        this.currentId = item.id
        this.getTagByCategories(item.id)
        this.$emit('nav-item-click', item)
        this.isTopbarBlock === false && this.updateTopbarBlock(true)
        window.scrollTo({ top: 0 })
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
  top: 0;
  width: 100vw;
  background: #fff;
  border-top: 1px solid #eee;
  transition: all .2s;

  &.nav-view--sticky{
    top: 60px;
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