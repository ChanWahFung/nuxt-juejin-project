import Vue from 'vue'
import ElementUI from 'element-ui'
import * as utils from '../assets/utils'

Vue.use(ElementUI)

Vue.filter('formatTime', d => utils.formatTime(d))