import Vue from 'vue'
import App from './App.vue'
import router from './router'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import request from './util/request'
import './style/index.less'
import { ElementTiptapPlugin } from 'element-tiptap'
Vue.use(ElementUI)
Vue.config.productionTip = false
Vue.prototype.$http = request
Vue.use(ElementTiptapPlugin, {
  lang: 'zh'
})
new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
