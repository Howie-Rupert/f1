import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'login',
    component: () => import(/* webpackChunkName: "userlogin" */ '../views/Login.vue')
  },
  {
    path: '/account',
    name: 'account',
    component: () => import(/* webpackChunkName: "userlogin" */ '../views/Account.vue')
  },
  {
    path: '/main',
    name: 'main',
    component: () => import(/* webpackChunkName: "main" */ '../views/MainPage.vue')
  },
  {
    path: '/SourceDetail',
    name: 'test',
    component: () => import('../views/SourceDetail.vue')
  },
  {
    path: '/Addfriend',
    component: () => import('../views/AddFriend.vue')
  },
  {
    path: '/Shenqing',
    component: () => import('../views/ShenQing.vue')
  },
  {
    path: '/MyInfo',
    component: () => import('../views/MyInfo.vue')
  },
  {
    path: '/GroupAdd',
    component: () => import('../views/AddGroup.vue')
  }
]

const router = new VueRouter({
  // mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
