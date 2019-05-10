import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
// 引入自动注册组件插件
import '@components/basic_component/componentRegister.js'
// 引入elemnet样式
import 'element-ui/lib/theme-chalk/index.css'
import '@assets/fonts/iconfont.css'
// 引入自己封装的npm组件
import PublicTree from 'jzd.public.compt'
// 引入自定义指令
import Directive from './directive'
// 引入权限控制
import './permission.js'
// 引入echarts，并暴露到全局
import echarts from 'echarts'
// 引入aggrid，并暴露到全局
import { AgGridVue } from 'ag-grid-vue'
// 引入api
import api from '@api/apis'
import config from '@config'
import Loading from './plugins/loading.js'
// 按需引入iview
import './plugins/iview.js'
import '@icons'

Vue.use(Loading)
Vue.use(PublicTree)
Vue.use(Directive)
Vue.prototype.$echarts = echarts
Vue.component('AgGridVue', AgGridVue)
Vue.prototype.$api = api
Vue.prototype.$config = config
// 去掉生产环境提示
Vue.config.productionTip = false
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
