import Vue from 'vue'
import VueRouter from 'vue-router'
/* 引入各个组件 */
/* 使用路由懒加载方式，当路由组件被调用时再获取路由，
    webpackChunkName可以将不同路由根据功能进行分组
*/
const Login = () => import(/* webpackChunkName:"homepage" */ '../components/Login.vue')
const Home = () => import(/* webpackChunkName:"homepage" */ '../components/Home.vue')
const Welcome = () => import(/* webpackChunkName:"homepage" */ '../components/Welcome.vue')
const Users = () => import(/* webpackChunkName:"userpage" */ '../components/users/Users.vue')
const Rights = () => import(/* webpackChunkName:"userpage" */ '../components/rights/Rights.vue')
const Roles = () => import(/* webpackChunkName:"userpage" */ '../components/rights/Roles.vue')
const GoodsCate = () => import(/* webpackChunkName:"goodscate" */ '../components/goods/Goods_cate.vue')
const GoodsParams = () => import(/* webpackChunkName:"goodscate" */ '../components/goods/Goods_params.vue')
const GoodsList = () => import(/* webpackChunkName:"goodslist" */ '../components/goods/GoodsList.vue')
const GoodsAdd = () => import(/* webpackChunkName:"goodslist" */ '../components/goods/Goods_add.vue')
const Order = () => import(/* webpackChunkName:"order" */ '../components/orders/order.vue')
const Report = () => import(/* webpackChunkName:"report" */ '../components/report/report.vue')
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
      { path: '/orders', component: Order },
      { path: '/reports', component: Report }
    ]
  }
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
