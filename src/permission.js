import router from './router'
import store from './store'
// import storage from 'store'
import NProgress from 'nprogress' // progress bar
import '@/components/NProgress/nprogress.less' // progress bar custom style
// import notification from 'ant-design-vue/es/notification'
// import { setDocumentTitle, domTitle } from '@/utils/domUtil'
// import { ACCESS_TOKEN } from '@/store/mutation-types'
// import { i18nRender } from '@/locales'
// import * as CookieUtil from '@/utils/cookie'

NProgress.configure({ showSpinner: false }) // NProgress Configuration

// const allowList = ['login', 'register', 'registerResult'] // no redirect allowList
// const loginRoutePath = '/user/login'
// const defaultRoutePath = '/user-manage'

const roles = {
  permissionList: ['user']
}
// console.log('start store')
// generate dynamic router
store.dispatch('GenerateRoutes', { roles }).then(() => {
  // 根据roles权限生成可访问的路由表
  // 动态添加可访问路由表
  router.addRoutes(store.getters.addRouters)
})
// router.beforeEach((to, from, next) => {
//   NProgress.start() // start progress bar
//   to.meta && (typeof to.meta.title !== 'undefined' && setDocumentTitle(`${i18nRender(to.meta.title)} - ${domTitle}`))
//   /* has token */
//   console.log(CookieUtil.get(ACCESS_TOKEN))
//   if (CookieUtil.get(ACCESS_TOKEN)) {
//     if (to.path === loginRoutePath) {
//       next({ path: defaultRoutePath })
//       NProgress.done()
//     } else {
//       next()
//     }
//   } else {
//     if (allowList.includes(to.name)) {
//       // 在免登录名单，直接进入
//       next()
//     } else {
//       next({ path: loginRoutePath, query: { redirect: to.fullPath } })
//       NProgress.done() // if current page is login will not trigger afterEach hook, so manually handle it
//     }
//   }
// })

router.afterEach(() => {
  NProgress.done() // finish progress bar
})
