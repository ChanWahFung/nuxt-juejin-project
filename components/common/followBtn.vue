<template functional>
  <div class="follow-btn" :class="{'follow-btn--active': props.isFollow}">{{ props.isFollow ? '已关注' : '关注' }}</div>
</template>

<style lang='scss' scoped>
.follow-btn{
  width: 75px;
  height: 32px;
  line-height: 30px;
  font-size: 14px;
  text-align: center;
  color: $success;
  border: 1px solid $success;
  border-radius: 2px;

  &.follow-btn--active{
    background: $success;
    color: #fff;
  }
}
</style>