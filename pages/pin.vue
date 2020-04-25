<template>
  <div class="pin-container">
    <div class="nav-wrap">
      <pin-category v-model="currentCategory"></pin-category>
    </div>
    <nuxt-child class="pin-main shadow" />
  </div>
</template>

<script>
import pinCategory from '~/components/business/pinCategory'
export default {
  head() {
    return {
      title: '沸点 - 掘金'
    }
  },
  components: {
    'pin-category': pinCategory
  },
  data() {
    return {
      currentCategory: {}
    }
  },
}
</script>

<style lang='scss' scoped>
.pin-container{
  display: flex;

  .nav-wrap{
    flex: 0 0 112px;
    width: 112px;
  }

  .pin-main{
    flex: 1;
    margin: 0 20px;
    border-radius: 2px;
  }
}
</style>