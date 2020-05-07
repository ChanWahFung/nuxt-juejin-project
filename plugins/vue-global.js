import Vue from 'vue'
import utils from '~/utils'
import myComponentsInstall from '~/components/myComponentsInstall'
import eleComponentsInstall from '~/components/eleComponentsInstall'
import loginModal from '~/components/common/loginModal/index'
import '~/assets/scss/element-variables.scss' // elementUI 自定义主题色

Vue.prototype.$utils = utils

Vue.use(loginModal)
Vue.use(myComponentsInstall)
Vue.use(eleComponentsInstall)

Vue.filter('formatTime', d => utils.formatTime(d))