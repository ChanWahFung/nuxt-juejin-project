<template>
  <div class="back-top" @click="backTop">
    <i class="arrow"></i>
  </div>
</template>

<script>
import { mapMutations } from 'vuex'

export default {
  methods: {
    ...mapMutations([
      'UPDATE_TOPBAR_BLOCK'
    ]),
    backTop() {
      window.scrollTo({
        top: 0
      })
      // 解决置顶后导航栏不显示
      this.UPDATE_TOPBAR_BLOCK(true)
    }
  }
}
</script>

<style lang='scss' scoped>
.back-top{
  position: fixed;
  bottom: 20px;
  right: 20px;
  width: 40px;
  height: 40px;
  line-height: 40px;
  text-align: center;
  border-radius: 50%;
  background: #fff;
  box-shadow: 0 0 5px rgba(0,0,0,.05);
  cursor: pointer;

  .arrow{
    display: inline-block;
    width: 5px;
    height: 0px;
    border: 5px solid #999;
    border-top: 5px solid transparent;
    border-left: 5px solid transparent;
    border-right: 5px solid transparent;
    margin-bottom: 3px;
  }
}
</style>