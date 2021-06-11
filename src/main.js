import Vue from 'vue'
import './plugins/axios'
import App from './App.vue'
import router from './router'
import './css/global.css'
import './plugins/element.js'
import axios from 'axios'

// 配置请求根路径
axios.defaults.baseURL = 'http://timemeetyou.com:8889/api/private/v1/'
Vue.prototype.$http = axios

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
