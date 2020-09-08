<template>
  <nav class="nav-view">
    <div class="nav-mian shadow" :class="{'nav-main--sticky': !isTopbarBlock}">
      <ul class="nav-list">
        <li class="nav-item" :class="{'nav-item--active': item.category_url === paramsTitle}" v-for="item in channels" :key="item.category_id" @click="navItemClick(item)">{{ item.category_name }}</li>
        <nuxt-link v-if="token" tag="li" to="/subscribe" class="nav-item" style="margin-left: auto;">标签管理</nuxt-link>
      </ul>
    </div>
  </nav>
</template>

<script>
import { mapState, mapMutations } from 'vuex'
export default {
  props: {
    channels: {
      type: Array,
      default: () => []
    }
  },
  computed: {
    ...mapState([
      'isTopbarBlock'
    ]),
    ...mapState('auth', [
      'token'
    ]),
    paramsTitle() {
      return this.$route.params.title || 'recommended'
    }
  },
  methods: {
    ...mapMutations([
      'UPDATE_TOPBAR_BLOCK'
    ]),
    async getTagByCategories(categoryId) {
      await this.$api.getTagByCategories({
        categoryId,
        limit: 15
      })
    },
    navItemClick(item) {
      if (this.paramsTitle != item.category_url) {
        this.isTopbarBlock === false && this.UPDATE_TOPBAR_BLOCK(true)
        window.scrollTo({ top: 0 })
        this.$router.push({
          name: 'timeline-title',
          params: {
            title: item.category_url
          }
        })
      }
    }
  }
}
</script>

<style lang='scss' scoped>
.nav-view{
  height: 45px;
}

.nav-mian{
  z-index: 999;
  position: fixed;
  left: 0;
  top: 60px;
  width: 100%;
  background: #fff;
  border-top: 1px solid #eee;
  transition: all .2s;

  &.nav-main--sticky{
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