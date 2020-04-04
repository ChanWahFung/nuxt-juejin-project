<template>
  <div class="comment-item">
    <div class="comment-item__avatar">
      <user-avatar :url="data.userInfo.avatarLarge" :round="true"></user-avatar>
    </div>
    <div class="comment-item__main">
      <div class="comment-item__userinfo">
        <span class="comment-item__username">{{ data.userInfo.username }}</span>
        <level :level="data.userInfo.level"></level>
        <p style="margin-left: 5px">
          <span>
            {{ data.userInfo.jobTitle }}
            {{ data.userInfo.jobTitle && data.userInfo.company ? ' @ ' : '' }}
            {{ data.userInfo.company }}
          </span>
        </p>
      </div>
      <p class="comment-item__content">{{ data.content }}</p>
      <div class="comment-item__meta">
        <span class="comment-item__meta__time">{{ data.createdAt | formatTime }}</span>
      </div>
      <div class="comment-item__reply-area">
        <div class="reply-item" v-for="item in data.topComment" :key="item.id">
          <div class="comment-item__avatar">
            <user-avatar :url="item.userInfo.avatarLarge" :round="true"></user-avatar>
          </div>
          <div class="comment-item__main">
            <div class="comment-item__userinfo">
              <span class="comment-item__username">{{ item.userInfo.username }}</span>
              <level :level="item.userInfo.level"></level>
              <p style="margin-left: 5px">
                <span>
                  {{ item.userInfo.jobTitle }}
                  {{ item.userInfo.jobTitle && item.userInfo.company ? ' @ ' : '' }}
                  {{ item.userInfo.company }}
                </span>
              </p>
            </div>
            <p class="comment-item__content">{{ item.content }}</p>
            <div class="comment-item__meta">
              <span class="comment-item__meta__time">{{ item.createdAt | formatTime }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    data: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
    }
  },
  created() {
  },
  methods: {
  }
}
</script>

<style lang='scss'>
.comment-item{
  position: relative;
  padding-left: 32px;
  margin-bottom: 20px;

  .comment-item__avatar{
    position: absolute;
    top: 0;
    left: 0;
    width: 32px;
    height: 32px;
    border-radius: 50%;
    overflow: hidden;
  }

  &>.comment-item__main{
    margin-left: 14px;
    padding-bottom: 20px;
  }

  &:not(:last-child){
    &>.comment-item__main{
      border-bottom: 1px solid #f4f4f4;
    }
  }

  .comment-item__userinfo{
    display: flex;
    align-items: center;
    line-height: 1.5;
    font-size: 13px;
    color: #bbb;

    .comment-item__username{
      color: #333;
      margin-right: 5px;
    }
  }

  .comment-item__content{
    font-size: 14px;
    line-height: 1.5;
    color: #505050;
  }

  .comment-item__meta{
    display: flex;
    margin-top: 10px;
    font-size: 13px;

    .comment-item__meta__time{
      color: #999;
    }
  }
}
.comment-item__reply-area{
  margin-top: 20px;
  padding: 0 10px;
  background: #fafbfc;
  overflow: hidden;

  .reply-item{
    position: relative;
    margin-top: 10px;
    padding-left: 32px;

    .comment-item__main{
      padding-bottom: 10px;
      margin-left: 14px;
    }

    &:not(:last-child){
      .comment-item__main{
        border-bottom: 1px solid #f4f4f4;
      }
    }
  }
}
</style>