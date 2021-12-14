<template>
  <div class="login-modal-container">
    <div class="login-form">
      <div class="panfish">
        <img v-show="currentFocus===''" src="https://b-gold-cdn.xitu.io/v3/static/img/normal.0447fe9.png" class="normal">
        <img v-show="currentFocus==='phoneNumber'" src="https://b-gold-cdn.xitu.io/v3/static/img/greeting.1415c1c.png" class="greeting">
        <img v-show="currentFocus==='password'" src="https://b-gold-cdn.xitu.io/v3/static/img/blindfold.58ce423.png" class="blindfold">
      </div>
      <div class="login-pancel">
        <h1 class="title">登录</h1>
        <i title="关闭" class="close-btn el-icon-close" @click="cancel"></i>
        <el-input class="phoneNumber-input" v-model="phoneNumber" placeholder="请输入手机号或邮箱" maxlength="64" @focus="currentFocus='phoneNumber'" @blur="currentFocus=''"></el-input>
        <el-input class="password-input" v-model="password" type="password" placeholder="请输入密码" maxlength="64" @focus="currentFocus='password'" @blur="currentFocus=''" @keydown.enter.native="login"></el-input>
        <el-button style="width:100%;margin-top:10px" :loading="loginLoading" type="primary" @click="login">登录</el-button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      currentFocus: '',
      phoneNumber: '', // 账号
      password: '',    // 密码
      loginLoading: false,
    }
  },
  methods: {
    show(ctx, cb) {
      this.ctx = ctx
      this.cb = cb
      return new Promise((resolve, reject) => {
        document.body.style.overflow = 'hidden'
        this.resolve = resolve
        this.reject = reject
      })
    },
    async login() {
      if (this.phoneNumber.trim() === '') {
        this.$message.warning('请输入账号')
        return
      }
      if (this.password.trim() === '') {
        this.$message.warning('请输入密码')
        return
      }
      this.loginLoading = true
      let res = await this.ctx.$api.loginAuth({
        phoneNumber: this.phoneNumber,
        password: this.password
      })
      this.loginLoading = false
      // 登录成功
      if (res.token) {
        this.ctx.$utils.setAuthInfo(this.ctx, res)
        this.resolve()
        location.reload()
        this.hideModal()
      } else {
        this.$message.error('登录失败，请重试')
      }
    },
    // 销毁弹窗
    hideModal() {
      typeof this.cb === 'function' && this.cb()
      document.body.removeChild(this.$el)
      document.body.style.overflow = ''
      this.$destroy()
    },
    cancel() {
      this.reject()
      this.hideModal()
    }
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

    .phoneNumber-input,
    .password-input{
      margin-bottom: 8px;

       ::v-deep  input::placeholder{
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