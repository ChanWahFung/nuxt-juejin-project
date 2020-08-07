<template>
  <nav class="nav-view">
    <div class="nav-mian shadow" :class="{'nav-main--sticky': !isTopbarBlock}">
      <ul class="nav-list">
        <li class="nav-item" :class="{'nav-item--active': item.category_url === paramsAlias}" v-for="item in channels" :key="item.category_id" @click="navItemClick(item)">{{ item.category_name }}</li>
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
    paramsAlias() {
      return this.$route.params.alias || 'recommended'
    }
  },
  methods: {
    ...mapMutations([
      'UPDATE_TOPBAR_BLOCK'
    ]),
    navItemClick(item) {
      if (this.paramsAlias != item.category_url) {
        this.isTopbarBlock === false && this.UPDATE_TOPBAR_BLOCK(true)
        window.scrollTo({ top: 0 })
        if (item.category_url) {
          this.$router.push({
            name: 'book-alias',
            params: {
              alias: item.category_url
            }
          })
        } else {
          this.$router.push('/book')
        }
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