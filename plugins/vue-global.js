import Vue from 'vue'
import utils from '~/utils'
import myComponentsInstall from '~/components/myComponentsInstall'
import eleComponentsInstall from '~/components/eleComponentsInstall'

Vue.prototype.$utils = utils

Vue.use(myComponentsInstall)
Vue.use(eleComponentsInstall)

Vue.filter('formatTime', d => utils.formatTime(d))