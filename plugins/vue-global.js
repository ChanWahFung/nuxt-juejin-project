import Vue from 'vue'
import ElementUI from 'element-ui'
import * as utils from '../assets/utils'
import level from '~/components/common/level.vue'

Vue.use(ElementUI)
Vue.component('level', level)
Vue.filter('formatTime', d => utils.formatTime(d))