import Vue from 'vue'
/* 导入根组件 */
import App from './App.vue'
/* 导入路由组件 */
import router from './router'
/* 导入插件 */
import './plugins/element.js'
/* 导入样式 */
import './assets/css/global.css'
import './assets/font/iconfont.css'
/* 导入axios */
import axios from 'axios'
/* 导入树形table组件 */
import treeTable from 'vue-table-with-tree-grid'
/* 导入富文本编辑器组件 */
import VueQuillEditor from 'vue-quill-editor'
import 'quill/dist/quill.core.css' // import styles
import 'quill/dist/quill.snow.css' // for snow theme
import 'quill/dist/quill.bubble.css' // for bubble theme
/* 引入进度条插件 */
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
/* 取消生产环境的提示 */
Vue.config.productionTip = false
/* 全局配置axios */
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'
Vue.prototype.$http = axios
/* 注册自定义全局组件 */
Vue.component('tree-table', treeTable)
/* 定义过滤器，处理日期格式 */
Vue.filter('dateFormat', function(val) {
  if (!val) return
  /* 根据传入参数创建日期对象 */
  const dt = new Date(val)
  const y = dt.getFullYear()
  /* 设定字符串长度为2，若不足2时，添加0补齐 */
  const m = (dt.getMonth() + 1 + '').padStart(2, '0')
  const d = (dt.getDate() + '').padStart(2, '0')
  const hh = (dt.getHours() + '').padStart(2, '0')
  const mm = (dt.getMinutes() + '').padStart(2, '0')
  const ss = (dt.getSeconds() + '').padStart(2, '0')
  return `${y}-${m}-${d} ${hh}:${mm}:${ss}`
})
/* 添加请求拦截，向headers请求参数中添加authorization字段token认证
若authorization字段认证通过，则能拿到后台数据，否则请求会被驳回 */
axios.interceptors.request.use(config => {
  config.headers.Authorization = window.sessionStorage.getItem('token')
  /* 进度条功能开启 */
  NProgress.start()
  return config
})
axios.interceptors.response.use(config => {
  /* 进度条功能关闭 */
  NProgress.done()
  return config
})
Vue.use(VueQuillEditor) // 全局挂载富文本编辑器组件
new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
