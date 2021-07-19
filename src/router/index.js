import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/Login.vue'
import Home from '../components/Home.vue'
Vue.use(VueRouter)

const routes = [
  /* 重定向路由 */
  { path: '/', redirect: '/login' },
  /* 登录路由 */
  { path: '/login', component: Login },
  /* home主页路由 */
  { path: '/home', component: Home }
]
const router = new VueRouter({
  routes
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
