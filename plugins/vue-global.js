import Vue from 'vue'
import ElementUI from 'element-ui'
import * as utils from '../utils'
import level from '~/components/common/level.vue'
import articList from '~/components/common/articList.vue'

Vue.prototype.$utils = utils
Vue.use(ElementUI)
Vue.component('level', level)
Vue.component('artic-list', articList)
Vue.filter('formatTime', d => utils.formatTime(d))