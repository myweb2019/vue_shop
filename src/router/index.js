import Vue from 'vue'
import Router from 'vue-router'
import login from "@/components/login"
import welcome from "../components/welcome";
import users from "../components/user/user";
import Rights from "../components/power/Rights";
import Roles from "../components/power/Roles";
import Cate from "../components/goods/cate";
import Params from "../components/goods/params";
import List from "../components/goods/list";
import Add from "../components/goods/add";
import Order from "../components/order/order";
import Report from "../components/report/report";







Vue.use(Router)

const router = new Router({
  routes: [
    {path: '/', redirect: '/login'},//重定向
    {path: '/login', component: login},
    {
      path: '/home',
      component: () => import('@/components/home'),
      redirect: '/welcome',
      children: [
        { path: '/welcome',component:welcome },
        { path: '/users',component:users },
        { path: '/rights',component:Rights },
        { path: '/roles',component:Roles },
        { path: '/categories',component:Cate },
        { path: '/params',component:Params },
        { path: '/goods',component:List },
        { path: '/goods/add',component:Add },
        { path: '/orders',component:Order },
        { path: '/reports',component:Report },
      ]
    }
  ]
})
//挂载路由导航守卫
router.beforeEach((to, from, next) => {
  //to将要访问的路径
  //form代表从哪个路径跳转而来
  //next是哪一个函数，放行
  if (to.path == '/login') return next();
  //获取token
  const tokenStr = window.sessionStorage.getItem('token');
  if (!tokenStr) {
    next('/login');
    return
  }
  next()
})

export default router
