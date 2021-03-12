<template>
  <div class="comment-item">
    <nuxt-link class="comment-item__avatar" :to="'/user/'+data.user_info.user_id" target="_blank">
      <user-avatar :url="data.user_info.avatar_large" :round="true"></user-avatar>
    </nuxt-link>
    <div class="comment-item__main">
      <div class="comment-item__userinfo ellipsis">
        <nuxt-link :to="'/user/'+data.user_info.user_id" class="comment-item__username" target="_blank">
          <span style="margin-right:5px">{{ data.user_info.user_name }}</span>
          <level :level="data.user_info.level"></level>
        </nuxt-link>
        <p style="margin-left: 5px">
          {{ data.user_info.job_title }}
          {{ data.user_info.job_title && data.user_info.company ? ' @ ' : '' }}
          {{ data.user_info.company }}
        </p>
      </div>
      <p class="comment-item__content">{{ data.comment_info.comment_content }}</p>
      <div class="comment-item__meta">
        <span class="comment-item__meta__time">{{ data.comment_info.ctime | formatTime }}</span>
      </div>
      <div v-if="data.reply_infos && data.reply_infos.length" class="comment-item__reply-area">
        <div class="reply-item" v-for="(item, i) in data.reply_infos" :key="i">
          <nuxt-link :to="'/user/'+item.user_info.user_id" class="comment-item__avatar" target="_blank">
            <user-avatar :url="item.user_info.avatar_large" :round="true"></user-avatar>
          </nuxt-link>
          <div class="comment-item__main">
            <div class="comment-item__userinfo ellipsis">
              <nuxt-link :to="'/user/'+item.user_info.user_id" class="comment-item__username" target="_blank">
                <span style="margin-right:5px">{{ item.user_info.user_name }}</span>
                <level :level="item.user_info.level"></level>
                <span v-if="item.is_author" style="margin-left:5px">(作者)</span>
              </nuxt-link>
              <p style="margin-left: 5px">
                {{ item.user_info.job_title }}
                {{ item.user_info.job_title && item.user_info.company ? ' @ ' : '' }}
                {{ item.user_info.company }}
              </p>
            </div>
            <p class="comment-item__content">
              <span v-if="item.reply_user.user_id > 0" class="comment-item__resp-userinfo">
                回复 
                <nuxt-link class="comment-item__resp-username" :to="'/user/'+item.reply_user.user_id" target="_blank"> {{ item.reply_user.user_name }}:</nuxt-link>
              </span>
              <span>{{ item.reply_info.reply_content }}</span>
            </p>
            <div class="comment-item__meta">
              <span class="comment-item__meta__time">{{ item.reply_info.ctime | formatTime }}</span>
            </div>
          </div>
        </div>
        <div v-if="data.comment_info.reply_count > data.reply_infos.length" class="reply__more" @click="replyMore">加载更多</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    authorId: {
      type: String,
      default: ''
    },
    index: {
      type: Number,
      default: -1,
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
    replyMore() {
      // has_reply_more 初次为undefined
      if (this.data.has_reply_more === undefined || this.data.has_reply_more === true) {
        this.$emit('reply-more', {
          index: this.index
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
  background: #fff;

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
    overflow: hidden;
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
      display: inline-flex;
      align-items: center;
      color: #333;
      cursor: pointer;
      text-decoration: none;
    }
  }

  .comment-item__content{
    font-size: 14px;
    line-height: 1.5;
    color: #505050;
  }

  .comment-item__resp-userinfo{
    display: inline-flex;
    align-items: center;

    .comment-item__resp-username{
      padding: 0 5px;
      color: #406599;
      text-decoration: none;
    }
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