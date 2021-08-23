import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import baseUrl from '@/config/baseUrl' //baseUrl配置
import Tools from "@/utils/tools" //工具
import Interface from '@/config/interface'    // 接口路径配置文件
import axios from '@/axios/index'  //axios封装
import {REGEX, PROMPT} from '@/config/constants'  //提示语

//引入ant-design-vue
import antComponents from '@/config/ant-design.config'

Vue.use(antComponents)


// CSS部分
import "@/assets/css/antd.less"//引入ant-design-vue css
import "@/assets/css/reset.css"//清除默认样式

//部分工具挂在在Vue原型
Vue.prototype.$Tools = Tools;//工具类
Vue.prototype.$store = store;//Vuex
Vue.prototype.$Url = Interface;//接口地址
Vue.prototype.$axios = axios;//axios请求
Vue.prototype.$baseUrl = baseUrl;//基本路径
Vue.prototype.$CONST = {REGEX, PROMPT};//常量定义

Vue.config.productionTip = false

//路由守卫
router.beforeEach((to, from, next) => {
  if (to.meta.requireAuth) {  // 判断该路由是否需要登录权限
    next();
    if (localStorage.getItem('token')) {
      next();
    } else {
      next({
        path: '/login'
      })
    }
  } else {
    next();
  }
})

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
