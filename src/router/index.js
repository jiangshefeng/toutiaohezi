import Vue from 'vue'
import VueRouter from 'vue-router'
import '../style/index.less'

Vue.use(VueRouter)

const routes = [
  {
    path: '/login',
    component: () => import('@/views/login/login.vue'),
    name: 'login'
  }
]

const router = new VueRouter({
  routes
})

export default router
