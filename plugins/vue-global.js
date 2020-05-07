import Vue from 'vue'
import utils from '~/utils'
import myComponentsInstall from '~/components/myComponentsInstall'
import eleComponentsInstall from '~/components/eleComponentsInstall'
import loginModal from '~/components/common/loginModal/index'
import '~/assets/scss/element-variables.scss' // elementUI 自定义主题色

Vue.prototype.$utils = utils
// 调起登录弹窗，方法返回Promise  then为登录成功  catch为关闭弹窗
Vue.prototype.$loginModal = loginModal

Vue.use(myComponentsInstall)
Vue.use(eleComponentsInstall)

Vue.filter('formatTime', d => utils.formatTime(d))