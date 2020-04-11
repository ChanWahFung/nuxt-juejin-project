<template>
  <div class="comment-item">
    <div class="comment-item__avatar" @click="toUser(data.userId)">
      <user-avatar :url="data.userInfo.avatarLarge" :round="true"></user-avatar>
    </div>
    <div class="comment-item__main">
      <div class="comment-item__userinfo">
        <span class="comment-item__username" @click="toUser(data.userId)">{{ data.userInfo.username }}</span>
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
      <div v-if="data.topComment.length" class="comment-item__reply-area">
        <div class="reply-item" v-for="item in data.topComment" :key="item.id">
          <div class="comment-item__avatar" @click="toUser(item.userId)">
            <user-avatar :url="item.userInfo.avatarLarge" :round="true"></user-avatar>
          </div>
          <div class="comment-item__main">
            <div class="comment-item__userinfo">
              <span class="comment-item__username" @click="toUser(item.userId)">{{ item.userInfo.username }}</span>
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
        <div v-if="data.replyCount > data.topComment.length" class="reply__more" @click="getReplyMore">加载更多</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  model: {
    prop: 'data',
    event: 'updateData'
  },
  props: {
    entryId: {
      type: String,
      default: ''
    },
    data: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      pageNum: 1,
      pageSize: 5
    }
  },
  methods: {
    toUser(id) {
      this.$router.push('/user/' + id)
    },
    getReplyMore() {
      if (this.entryId) {
        this.$api.getReplyList({
          entryId: this.entryId,
          commentId: this.data.id,
          pageNum: this.pageNum,
          pageSize: this.pageSize
        }).then(res => {
          if (res.s === 1) {
            let data = JSON.parse(JSON.stringify(this.data))
            data.topComment = this.pageNum == 1 ? res.d.comments : data.topComment.concat(res.d.comments)
            this.$emit('updateData', data)
          }
        })
      }
    }
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
    cursor: pointer;
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
      cursor: pointer;
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

  .reply__more{
    padding: 10px;
    font-size: 13px;
    color: #406599;
    text-align: center;
    cursor: pointer;

    &:hover{
      opacity: .8;
    }
  }
}
</style>