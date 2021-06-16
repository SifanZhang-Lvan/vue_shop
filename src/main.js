import Vue from 'vue'
import './plugins/axios'
import App from './App.vue'
import router from './router'
import './css/global.css'
import './plugins/element.js'
import axios from 'axios'

// 配置请求根路径
axios.defaults.baseURL = 'http://timemeetyou.com:8889/api/private/v1/'
axios.interceptors.request.use(config => {
  config.headers.Authorization = window.sessionStorage.getItem('token')
  // 在最后必须 return config
  console.log(config)
  return config
})
Vue.prototype.$http = axios

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
