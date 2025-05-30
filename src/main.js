import Vue from 'vue'

import 'normalize.css/normalize.css' // A modern alternative to CSS resets

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import locale from 'element-ui/lib/locale/lang/en' // lang i18n

import '@/styles/index.scss' // global css

import App from './App'
import store from './store'
import router from './router'

import '@/icons' // icon
import '@/router/guard' // permission control

import api from '@/api'
import axios from '@/utils/axios'
Vue.prototype.$api = api
Vue.prototype.$axios = axios

// import global components
import CommonForm from '@/components/CommonForm'
Vue.component('common-form', CommonForm)
import CommonTable from '@/components/CommonTable'
Vue.component('common-table', CommonTable)
// 通用对象管理组件注册
import GeneralObjectMgmt from '@/components/GeneralObjectMgmt/GeneralObjectMgmt.vue'
Vue.component('GeneralObjectMgmt', GeneralObjectMgmt)

import VueClipboard from 'vue-clipboard2'
Vue.use(VueClipboard)

/**
 * If you don't want to use mock-server
 * you want to use MockJs for mock api
 * you can execute: mockXHR()
 *
 * Currently MockJs will be used in the production environment,
 * please remove it before going online ! ! !
 */
if (process.env.NODE_ENV === 'production') {
  const { mockXHR } = require('../mock')
  mockXHR()
}

// set ElementUI lang to EN
Vue.use(ElementUI, { locale })
// 如果想要中文版 element-ui，按如下方式声明
// Vue.use(ElementUI)

Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
