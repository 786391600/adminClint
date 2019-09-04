import Vue from 'vue';
import VueRouter from 'vue-router';
import { routers } from './route';
import { Loading } from 'element-ui';
import { setTitle } from 'src/assets/js/util';
import store from '../store/index';

Vue.use(VueRouter);

const routerConfig = {
  mode: 'history',
  linkActiveClass: 'active',
  routes: routers
};

const router = new VueRouter(routerConfig);

let loading;
router.beforeEach((to, form, next) => {
  if (to.meta.requireAuth) {  // 判断该路由是否需要登录权限
    if (store.state.token) {  // 通过vuex state获取当前的token是否存在
      next();
    } else {
      next({
        path: '/login',
        query: {redirect: to.fullPath}  // 将跳转的路由path作为参数，登录成功后跳转到该路由
      })
    }
  } else {
    next();
  }
  loading = Loading.service({
    // fullscreen: true,
    target: '.content-wrapper',
    text: '跳转中...'
  });
  
  // 设置window.document.title 的名称
  setTitle(to.meta.title);
  if (!to.matched.length) {
    next({
      path: '/error/404',
      replace: true
    });
  } else {
    next();
  }
});

router.afterEach((to, from) => {
  // 解决某些情况下loading无法关闭的情况
  setTimeout(() => {
    loading.close();
  }, 0)
});

export default router;
