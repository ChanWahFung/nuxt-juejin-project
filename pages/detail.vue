<template>
  <div>
    <div class="detail">
      <div class="header">
        <div class="userInfo">
          <img class="avatar" :src="articInfo.user.avatarLarge" alt="头像">
          <div class="username lv" :class="['lv'+articInfo.user.level]" :data-lv="'Lv'+articInfo.user.level">{{ articInfo.user.username }}</div>
          <div class="meta">
            <span class="create_time">{{ formatDate('Y年M月D' ,articInfo.createdAt) }}</span>
            <span>阅读{{ articInfo.viewsCount }}</span>
          </div>
        </div>
        <div class="follow-btn">关注</div>
      </div>
      <div v-if="articInfo.screenshot" class="cover" :style="`background-image: url(${articInfo.screenshot})`"></div>
      <h1 class="title">{{ articInfo.title }}</h1>
      <!-- <div class="content" v-html="articDetail.content"></div> -->
    </div>
  </div>
</template>

<script>
import { formatDate } from '~/assets/utils'

export default {
  props: {
    id: {
      type: String,
      default: ''
    }
  },
  async asyncData ({ app, params }) {
    const articDetail = await app.$api.getDetail({
      type: 'entryView',
      postId: params.id
    }).then(res => {
      if (res.s === 1) {
        return res.d
      }
      return {}
    })
    const articInfo = await app.$api.getDetail({
      type: 'entry',
      postId: params.id
    }).then(res => {
      if (res.s === 1) {
        return res.d
      }
      return {}
    })
    
    return {
      articDetail,
      articInfo
    }
  },
  data () {
    return {
      articDetail: {},
      articInfo: {},
      commentCount: 0,
      comments: []
    }
  },
  created () {
    this.getCommentList()
  },
  methods: {
    formatDate,
    getCommentList() {
      this.$api.getCommentList({
        entryId: this.articDetail.entryId
      }).then(res => {
        if (res.s === 1) {
          this.commentCount = res.d.count
          this.comments = res.d.comments
        }
      })
    }
  }
}
</script>

<style lang='scss' scoped>
.detail{
  padding: 30px;
  background-color: #fff;
  box-shadow: 0 0 4px #eee;
  border-radius: 2px;

  .header{
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 30px;

    .follow-btn{
      padding: 5px 12px;
      font-size: 14px;
      color: $success;
      border: 1px solid currentColor;
      border-radius: 2px;
    }
  }

  .cover{
    width: 100%;
    padding-top: 50%;
    background-size: cover;
    background-position: 50%;
    margin-bottom: 30px;
  }

  .title{
    color: #000;
    font-size: 30px;
    font-weight: 700;
    margin-bottom: 50px;
  }

  .content{
    line-height: 1.6;
    color: #333;

    /deep/ img{
      width: 100%;
    }

    /deep/ p{
      margin: 22px 0;
    }

    /deep/ h2{
      padding-bottom: 12px;
      font-size: 24px;
      font-weight: 700;
      border-bottom: 1px solid #ececec;
    }

    /deep/ code{
      font-size: 13px;
      line-height: 1.8;
      letter-spacing: .6px;
    }

    /deep/ ol{
      padding-left: 28px;
      list-style: initial;
      list-style-type: decimal;
    }
    
    /deep/ li{
      padding-left: 6px;
      list-style: initial;
      list-style-type: decimal;
    }

    /deep/ blockquote{
      color: #666;
      padding: 1px 23px;
      margin: 22px 0;
      border-left: 4px solid #cbcbcb;
      background-color: #f8f8f8;
    }

    /deep/ a{
      color: #0269c8;
      border-bottom: 1px solid #d1e9ff;

      &:hover{
        color: #007fff;
      }

      &:active{
        color: #275b8c;
      }
    }
  }
}

.userInfo{
  display: flex;
  height: 40px;
  flex-direction: column;
  justify-content: space-between;
  position: relative;
  padding-left: 50px;

  .avatar{
    position: absolute;
    top: 0;
    left: 0;
    width: 40px;
    height: 40px;
    background: #f4f4f4;
    border-radius: 50%;
  }

  .username{
    font-weight: 700;
    color: #333;

    &.lv:after{
      content: attr(data-lv);
      padding: 0 2px;
      margin-left: 10px;
      border-radius: 2px;
      color: #fff;
      font-size: 12px;
      font-weight: bolder;
      background-color: #f4f4f4;
    }

    &.lv1::after,
    &.lv2::after{
      background: lightblue;
    }

    &.lv3::after{
      background: skyblue;
    }

    &.lv4::after{
      background: lightgreen;
    }

    &.lv5::after{
      background: lightsalmon;
    }

    &.lv6::after{
      background: lightcoral;
    }
  
  }

  .meta{
    letter-spacing: 1px;
    font-size: 14px;
    color: #909090;

    .create_time{
      margin-right: 10px;
    }
  }
}
</style>