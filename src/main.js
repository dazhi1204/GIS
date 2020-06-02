import Vue from 'vue'
import App from './App.vue'
import ElementUI from 'element-ui'
import './assets/css/index.scss'
import './assets/iconfont/iconfont.css'
import directives from './directives'
import 'element-ui/lib/theme-chalk/index.css'
import router from './router'
import store from './store'
// import BaiduMap from 'vue-baidu-map'
import VueDND from 'awe-dnd'
import '@/assets/js/rem'
Vue.use(VueDND)

// Vue.prototype.$echarts = echarts

// 	Vue.use(BaiduMap, {
//   ak: 'zBVgvYN3Dxf8fhoAauPHnqe2bydWVV18'
// })
Vue.use(ElementUI, {
  size: 'mini'
})

Vue.config.productionTip = false


new Vue({
  store,
  router,
  render: h => h(App)
}).$mount('#app')


Object.keys(directives).forEach(key => {
  Vue.directive(key, directives[key])
})