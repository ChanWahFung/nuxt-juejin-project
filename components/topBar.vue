<template>
  <header class="header">
    <div class="wrap">
      <div class="container">
        <ul class="label-list">
          <li v-for="item in labelList" :key="item.id" class="label">{{ item.title }}</li>
        </ul>
      </div>
    </div>
  </header>
</template>

<script>
export default {
  data() {
    return {
      labelList: []
    }
  },
  created() {
    this.$api.getLabelList().then(res => {
      this.labelList = res.data
    })
  }
}
</script>

<style lang='scss' scoped>
.header{
  position: relative;
  background-color: #fff;
  height: 60px;
}
.wrap{
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  background: #fff;
  box-shadow: 0 0 6px #ddd;
}
.container{
  max-width: 960px;
  height: 100%;
  margin: 0 auto;
}
.label-list{
  display: flex;
  line-height: 60px;
  font-size: 16px;
  color: #71777c;
}
.label{
  padding: 0 20px;
}
</style>