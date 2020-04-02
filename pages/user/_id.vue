<template>
  <div class="user-view">
    <div class="major-area">
      <div class="user-block shadow">
        <div class="user-block__avatar">
          <img :src="userInfo.avatarLarge">
        </div>
        <div class="user-block__info">
          <div class="info__username">
            <h1>
              {{ userInfo.username }}
              <level :level="userInfo.level"></level>
            </h1>
          </div>
          <div class="info__position">
            <span>{{ userInfo.jobTitle }}</span>
            <span> | {{ userInfo.company }}</span>
          </div>
          <div class="info__intro">{{ userInfo.selfDescription }}</div>
        </div>
        <div class="user-block__action">
          <follow-btn :is-follow="isFollowed"></follow-btn>
        </div>
      </div>
      <div class="user-post">
        <post-item></post-item>
      </div>
    </div>
    <div class="minor-area">
      <div class="honor-block shadow">
        <div class="honor-block__title">个人成就</div>
        <div class="honor-block__list">
          <template v-if="userInfo.roles">
            <div class="honor-item" v-if="userInfo.roles.builder.isGranted">
              <img class="honor-item__icon shadow" src="~/assets/images/honor-1.svg" />
              <span class="honor-item__title">掘金共建者</span>
            </div>
            <div class="honor-item" v-if="userInfo.roles.bookAuthor.isGranted">
              <img class="honor-item__icon shadow" src="~/assets/images/honor-2.svg" />
              <span class="honor-item__title">掘金小册写作权限</span>
            </div>
            <div class="honor-item" v-if="userInfo.roles.favorableAuthor.isGranted">
              <img class="honor-item__icon shadow" src="~/assets/images/honor-3.svg" />
              <span class="honor-item__title">掘金优秀作者</span>
            </div>
          </template>
          <div class="honor-item">
            <img class="honor-item__icon shadow" src="~/assets/images/honor-3.svg" />
            <span class="honor-item__title">获得点赞 {{ userInfo.totalCollectionsCount }}</span>
          </div>
          <div class="honor-item">
            <img class="honor-item__icon shadow" src="~/assets/images/honor-3.svg" />
            <span class="honor-item__title">文章被阅读 {{ userInfo.totalViewsCount }}</span>
          </div>
          <div class="honor-item">
            <img class="honor-item__icon shadow" src="~/assets/images/honor-3.svg" />
            <span class="honor-item__title">掘力值 {{ userInfo.juejinPower }}</span>
          </div>
        </div>
      </div>
      <div class="follow-block shadow">
        <div class="follow-item">
          关注了<span class="follow-count">{{ userInfo.followeesCount }}</span>
        </div>
        <div class="follow-item">
          关注者<span class="follow-count">{{ userInfo.followersCount }}</span>
        </div>
      </div>
      <div class="more-block">
        <div class="more-item">
          收藏集<span>{{ userInfo.collectionSetCount }}</span>
        </div>
        <div class="more-item">
          关注标签<span>{{ userInfo.subscribedTagsCount }}</span>
        </div>
        <div class="more-item">
          加入于<span>{{ formatDate('Y-MM-DD', userInfo.createdAt) }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import postItem from '~/components/business/postItem'
import { formatDate } from '~/utils'

export default {
  head() {
    return {
      title: `${this.userInfo.username} 的个人主页 - 掘金`
    }
  },
  validate ({ params }) {
    if (params.id) {
      return true
    }
    return false
  },
  async asyncData({ app, params }) {
    let userInfo = await app.$api.getMultiUser({
      ids: params.id,
      cols: ''
    }).then(res => res.s === 1 ? res.d[params.id] : {})
    let postList = await app.$api.getUserPost({
      targetUid: params.id,
      limit: 20,
      order: 'createdAt'
    }).then(res => res.s === 1 ? res.d.entery : [])
    let isFollowed = await app.$api.isCurrentUserFollowed({
      currentUid: '5c455fe56fb9a049ef26e4e6',
      targetUids: params.id,
    }).then(res => res.s === 1 ? res.d[params.id] : false)
    return {
      userInfo,
      isFollowed,
      postList
    }
  },
  components: {
    'post-item': postItem
  },
  data() {
    return {
      postList: [],
      userInfo: {},
      isFollowed: false,
    }
  },
  created() {
  },
  methods: {
    formatDate,
  }
}
</script>

<style lang='scss' scoped>
.user-view{
  display: flex;

  .major-area{
    flex: 1 1 auto;
  }

  .minor-area{
    flex: 0 0 auto;
    width: 240px;
    margin-left: 10px;
  }
}
.user-block{
  display: flex;
  padding: 25px;
  background: #fff;
  border-radius: 2px;

  .user-block__avatar{
    margin-right: 20px;

    >img{
      width: 90px;
      height: 90px;
      border-radius: 50%;
      object-fit: cover;

      &:hover{
        transform: rotate(666turn);
        transition-delay: 1s;
        transition-property: all;
        transition-duration: 59s;
        transition-timing-function: cubic-bezier(.34,0,.84,1);
      }
    }
  }

  .user-block__info{
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    margin-right: 20px;
    font-size: 14px;
    line-height: 1.5;
    color: #72777b;

    .info__username{
      font-size: 24px;
      font-weight: bold;
      color: #262626;
    }

    .info__position{
      margin-top: 10px;
    }

    .info__intro{
      margin-top: 5px;
    }
  }

  .user-block__action{
    margin-left: auto;
  }
}
.honor-block{
  background: #fff;

  .honor-block__title{
    padding: 15px 10px;
    font-weight: bold;
    color: #31445b;
    border-bottom: 1px solid #eee;
  }  

  .honor-block__list{
    padding: 15px 10px;
    color: #262626;

    .honor-item{
      display: flex;
      align-items: center;
      
      &:not(:last-child){
        margin-bottom: 10px;
      }
    }

    .honor-item__icon{
      width: 25px;
      height: 25px;
      margin-right: 10px;
      border-radius: 50%;
    }

    .honor-item__title{
      font-size: 15px;
    }
  }
}
.follow-block{
  display: flex;
  margin-top: 10px;
  background: #fff;

  .follow-item{
    display: flex;
    flex-direction: column;
    flex: 1;
    justify-content: center;
    align-items: center;
    padding: 15px 0;
    color: #31445b;

    .follow-count{
      margin-top: 5px;
      font-weight: bold;
    }
  }
}
.more-block{
  margin-top: 10px;
  color: #262626;

  .more-item{
    padding: 15px;
    display: flex;
    justify-content: space-between;
    border-top: 1px solid rgba(230,230,231,.5);

    &:last-child{
      border-bottom: 1px solid rgba(230,230,231,.5);
    }
  }
}
</style>