<template>
  <nuxt-link :to="'/user/'+item.user_id" target="_blank">
    <div class="user-item">
      <div class="user__avatar">
        <user-avatar :url="item.avatar_large" :round="true"></user-avatar>
      </div>
      <div class="user__info">
        <div class="user__name">
          <span>{{ item.user_name }}</span>
          <level :level="item.level"></level>
        </div>
        <div class="user__job-title ellipsis">
          {{ item.job_title }}
          {{ item.job_title && item.company ? '@' : '' }}
          {{ item.company }}
        </div>
        <div class="user__meta">{{ item.description }}</div>
      </div>
      <div class="user__follow-btn">
        <follow-btn type="user" :is-follow.sync="item.isfollowed" :followee-id="item.user_id"></follow-btn>
      </div>
    </div>
  </nuxt-link>
</template>

<script>
export default {
  props: {
    item: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
    }
  },
  mounted() {
  },
  methods: {
  }
}
</script>

<style lang='scss' scoped>
.user-item{
  display: flex;
  padding: 30px;

  &:hover{
    background: #fcfcfc;
  }

  .user__avatar{
    width: 50px;
    height: 50px;
    margin-right: 20px;
  }

  .user__info{
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    flex: 1 1 auto;
    overflow: hidden;

    .user__name{
      font-size: 16px;
      color: #393939;

      >span{
        margin-right: 3px;
      }
    }

    .user__job-title{
      font-size: 12px;
      color: #b9c0c8;
    }

    .user__meta{
      font-size: 12px;
      color: #777d81;
    }
  }

  .user__follow-btn{
    display: flex;
    align-items: center;
    margin-left: auto;
  }
}
</style>