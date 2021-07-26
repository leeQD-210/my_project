import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/Login.vue'
import Home from '../components/Home.vue'
import Welcome from '../components/Welcome.vue'
import Users from '../components/users/Users.vue'
import GoodsList from '../components/goods/GoodsList.vue'
import Rights from '../components/rights/Rights.vue'
import Roles from '../components/rights/Roles.vue'
import GoodsCate from '../components/goods/Goods_cate.vue'
import GoodsParams from '../components/goods/Goods_params.vue'
import GoodsAdd from '../components/goods/Goods_add.vue'
import GoodsOrder from '../components/goods/Goods_order.vue'
import axios from 'axios'
Vue.use(VueRouter)

const routes = [
  /* 重定向路由 */
  { path: '/', redirect: '/login' },
  /* 登录路由 */
  { path: '/login', component: Login },
  /* home主页路由 */
  {
    path: '/home',
    component: Home,
    children: [
      { path: '/', redirect: '/welcome' },
      { path: '/welcome', component: Welcome },
      { path: '/users', component: Users },
      { path: '/goods', component: GoodsList },
      { path: '/goods/add', component: GoodsAdd },
      { path: '/rights', component: Rights },
      { path: '/roles', component: Roles },
      { path: '/categories', component: GoodsCate },
      { path: '/params', component: GoodsParams },
      { path: '/orders', component: GoodsOrder }
    ]
  }
]
const router = new VueRouter({
  routes
})
/* 添加请求拦截，向headers请求参数中添加authorization字段token认证
若authorization字段认证通过，则能拿到后台数据，否则请求会被驳回 */
axios.interceptors.request.use(config => {
  config.headers.Authorization = window.sessionStorage.getItem('token')
  return config
})
/* 添加路由拦截导航函数 */
router.beforeEach((to, from, next) => {
  /* to表示将要跳转的地址
     from表示从什么地址跳转
     next表示向下执行命令
  */
  /* 如果访问的登录路由，直接放行 */
  if (to.path === '/login') return next()
  /* 如果浏览器sessionStorage中没有token，表示未登录状态，强制定下到登录路由 */
  if (!window.sessionStorage.getItem('token')) return next('/login')
  /* 如果有token,代表已登录，直接放行 */
  next()
})
export default router
