// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import "./plugins/element";
import axios from "axios";

//导入全局样式表
import "../static/global.css";
import './assets/fonts/iconfont.css';
import TreeTable from 'vue-table-with-tree-grid'
/*富文本编辑器*/
import VueQuillEditor from 'vue-quill-editor'
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
Vue.use(VueQuillEditor)

//配置axios
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/';
//拦截器
axios.interceptors.request.use((config)=>{
  config.headers.Authorization = window.sessionStorage.getItem('token')
  //最后必须return
  return config
})
Vue.prototype.$http = axios;



Vue.config.productionTip = false

Vue.component('tree-table', TreeTable)

//全局过滤时间
Vue.filter('dateFormat',function (originVal) {
  const dt = new Date(originVal*1000)

  const y = dt.getFullYear()
  const m = (dt.getMonth()+1+'').padStart(2,'0')
  const d = (dt.getDate()+'').padStart(2,'0')

  const hh = (dt.getHours()+'').padStart(2,'0')
  const mm = (dt.getMinutes()+'').padStart(2,'0')
  const ss = (dt.getSeconds()+'').padStart(2,'0')

  return `${y}-${m}-${d} ${hh}:${mm}:${ss}`

})
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
