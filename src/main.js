// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import ElementUI, { Message } from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import App from './App'
import router from './router'
import store from './store/index'
import { userToken } from './utils/storage'
import types from './store/type'
import './utils/icon-svg'

Vue.use(ElementUI)
Vue.config.productionTip = false

router.beforeEach((to, from, next) => {
  if (store.state.base.token) {
    if (to.path === '/login') {
      next('/')
    } else {
      next()
    }
  } else if (userToken.get()) {
    const token = userToken.get()
    store
      .dispatch('getUserInfo', { token })
      .then(() => {
        store.commit(types.SET_TOKEN, { token })
        next('/')
      })
      .catch(error => {
        Message.error(error)
        store.commit(types.CLEAR_TOKEN)
        userToken.remove()
        next('/login')
      })
  } else if (to.path === '/login') {
    next()
  } else {
    next('/login')
  }
})

router.afterEach(to => {
  store.commit(types.SET_BREADCRUMB, to.meta.breadcrumb)
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
