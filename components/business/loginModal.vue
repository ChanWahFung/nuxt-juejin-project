<template>
  <div class="login-modal-container">
    <div class="login-form">
      <div class="panfish">
        <img v-show="currentFocus===''" src="https://b-gold-cdn.xitu.io/v3/static/img/normal.0447fe9.png" class="normal">
        <img v-show="currentFocus==='account'" src="https://b-gold-cdn.xitu.io/v3/static/img/greeting.1415c1c.png" class="greeting">
        <img v-show="currentFocus==='password'" src="https://b-gold-cdn.xitu.io/v3/static/img/blindfold.58ce423.png" class="blindfold">
      </div>
      <div class="login-pancel">
        <h1 class="title">登录</h1>
        <i title="关闭" class="close-btn el-icon-close" @click="$emit('update:visible', false)"></i>
        <el-input class="account-input" v-model="account" placeholder="请输入手机号或邮箱" maxlength="64" @focus="currentFocus='account'" @blur="currentFocus=''"></el-input>
        <el-input class="password-input" v-model="password" show-password type="password" placeholder="请输入密码" maxlength="64"  @focus="currentFocus='password'" @blur="currentFocus=''"></el-input>
        <div class="submit-btn">登录</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    visible: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      currentFocus: '',
      account: '', // 账号
      password: '', // 密码
    }
  },
  mounted() {
    
  },
  methods: {
    
  }
}
</script>

<style lang='scss' scoped>
.login-modal-container{
  z-index: 1000;
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(0,0,0,.2);

  .login-form{
    position: relative;
    width: 318px;
    background-color: #fff;
    border-radius: 2px;
  }

  .panfish{
    .normal{
      position: absolute;
      top: 0;
      left: 50%;
      width: 120px;
      transform: translate(-50%,-83%);
      z-index: 1;
    }

    .greeting{
      position: absolute;
      top: 0;
      left: 50%;
      width: 120px;
      transform: translate(-50%,-75.8%);
      z-index: 1;
    }

    .blindfold{
      position: absolute;
      top: 0;
      left: 50%;
      width: 104px;
      transform: translate(-50%,-75%);
      z-index: 1;
    }
  }

  .login-pancel{
    position: relative;
    padding: 22px;

    .title{
      margin-bottom: 30px;
      font-size: 18px;
      font-weight: 600;
      color: #333;
    }

    .close-btn{
      position: absolute;
      top: 20px;
      right: 20px;
      padding: 3px;
      color: #bbb;
      font-weight: 600;
      cursor: pointer;
    }

    .account-input,
    .password-input{
      margin-bottom: 8px;

      /deep/ input::placeholder{
        color: #999;
      }
    }

    .submit-btn{
      margin-top: 5px;
      padding: 12px;
      background-color: $theme;
      color: #fff;
      text-align: center;
      font-size: 14px;
      border-radius: 2px;
      cursor: pointer;
    }
  }
}
</style>