<template>
  <div class="user-follow-item shadow">
    <div class="follow__count">{{ item.count }}个新的关注者</div>
    <div class="user-item" v-for="user in item.users" :key="user.uid">
      <div class="user__avatar" @click="toUser(user.uid)">
        <user-avatar :url="user.avatarLarge" :round="true"></user-avatar>
      </div>
      <div class="user__info" @click="toUser(user.uid)">
        <span class="user__name">{{ user.username }}</span>
        <span class="user__job">
          {{ user.jobTitle }}
          {{ user.jobTitle && user.company ? '@' : '' }}
          {{ user.company }}
        </span>
      </div>
      <follow-btn></follow-btn>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    item: {
      type: Object,
      default: () => ({})
    }
  },
  methods: {
    toUser(uid) {
      this.$router.push('/user/' + uid)
    }
  },
}
</script>

<style lang='scss' scoped>
.user-follow-item{
  padding: 25px;
  background: #fff;

  .follow__count{
    margin-bottom: 10px;
    color: #333;
  }

  .user-item{
    display: flex;
    align-items: center;
    padding: 10px;
    border: 1px solid #eee;
    border-radius: 2px;
    margin-bottom: 5px;

    .user__avatar{
      width: 50px;
      height: 50px;
      margin-right: 10px;cursor: pointer;
    }

    .user__info{
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      line-height: 1.3;
      margin-right: auto;
      cursor: pointer;

      .user__name{
        font-weight: bold;
        color: #222;
        margin-bottom: 5px;
      }

      .user__job{
        font-size: 14px;
        color: #8a9aa9;
      }
    }
  }
}
</style>