<template functional>
  <img class="user__avatar" :class="{'user__avatar--round': props.round}" width="100%" height="100%" v-if="props.url" :src="props.url">
  <img class="user__avatar" :class="{'user__avatar--round': props.round}" width="100%" height="100%" v-else src="~/assets/images/default-avatar.svg" >
</template>

<style lang='scss' scoped>
.user__avatar{
  background: #f4f4f4;
  object-fit: cover;

  &.user__avatar--round{
    border-radius: 50%;
  }
}
</style>