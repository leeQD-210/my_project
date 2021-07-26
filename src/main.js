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
/* 取消生产环境的提示 */
Vue.config.productionTip = false
/* 全局配置axios */
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'
Vue.prototype.$http = axios
/* 设定防抖算法 */
Vue.prototype.$debounce = function(fn, wait) {
  var timeout
  return function() {
    /* 保存调用当前函数的对象 */
    const context = this
    /* 保存调用当前函数传入的参数 */
    const args = [...arguments]
    /* 如果定时器存在，说明已经触发了一次函数,清除上一个定时器 */
    if (timeout) {
      clearTimeout(timeout)
    }
    timeout = setTimeout(() => {
      fn.apply(context, args)
    }, wait)
  }
}
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
Vue.use(VueQuillEditor) // 全局挂载富文本编辑器组件
new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
