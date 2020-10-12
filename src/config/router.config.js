// eslint-disable-next-line
import { UserLayout, BasicLayout, ArticleLayout } from '@/layouts'
import { bxAnaalyse } from '@/core/icons'

// const RouteView = {
//   name: 'RouteView',
//   render: (h) => h('router-view')
// }

export const asyncRouterMap = [

  {
    path: '/',
    name: 'index',
    component: BasicLayout,
    meta: { title: 'menu.home', permission: [] },
    redirect: '/main',
    children: [
      {
        path: '/main',
        name: '首页',
        meta: { title: '首页', keepAlive: true, icon: bxAnaalyse, permission: [] },
        component: () => import('@/views/dashboard/Main')
      },
      {
        path: '/user-manage',
        name: '用户管理',
        meta: { title: '用户管理', keepAlive: true, icon: bxAnaalyse, permission: [] },
        component: () => import('@/views/dashboard/UserManage')
      },
      {
        path: '/article-manage',
        name: '作品管理',
        meta: { title: '作品管理', keepAlive: true, icon: bxAnaalyse, permission: [] },
        component: () => import('@/views/dashboard/ArticleManage')
      },
      // {
      //   path: '/account-manage',
      //   name: '账户管理',
      //   meta: { title: '账户管理', keepAlive: true, icon: bxAnaalyse, permission: [] },
      //   component: () => import('@/views/dashboard/AccountManage')
      // },
      {
        path: '/comment-manage',
        name: '评论管理',
        meta: { title: '评论管理', keepAlive: true, icon: bxAnaalyse, permission: [] },
        component: () => import('@/views/dashboard/CommentManage')
      },
      {
        path: '/routine-manage',
        name: '游记管理',
        meta: { title: '游记管理', keepAlive: true, icon: bxAnaalyse, permission: [] },
        component: () => import('@/views/dashboard/RoutineManage')
      },
      {
        path: '/trash-manage',
        name: '垃圾箱',
        meta: { title: '垃圾箱', keepAlive: true, icon: bxAnaalyse, permission: [] },
        component: () => import('@/views/dashboard/TrashManage')
      },
      {
        path: '/verify-manage',
        name: '审核管理',
        meta: { title: '审核管理', keepAlive: true, icon: bxAnaalyse, permission: [] },
        component: () => import('@/views/dashboard/VerifyManage')
      },
      {
        path: '/words-manage',
        name: '屏蔽词管理',
        meta: { title: '屏蔽词管理', keepAlive: true, icon: bxAnaalyse, permission: [] },
        component: () => import('@/views/dashboard/WordsManage')
      }
    ]
  },
  {
    path: '*', redirect: '/404', hidden: true
  }
]

/**
 * 基础路由
 * @type { *[] }
 */
export const constantRouterMap = [
  {
    path: '/user',
    component: UserLayout,
    redirect: '/user/login',
    hidden: true,
    children: [
      {
        path: 'login',
        name: 'login',
        component: () => import(/* webpackChunkName: "user" */ '@/views/user/Login')
      },
      {
        path: 'register',
        name: 'register',
        component: () => import(/* webpackChunkName: "user" */ '@/views/user/Register')
      },
      {
        path: 'register-result',
        name: 'registerResult',
        component: () => import(/* webpackChunkName: "user" */ '@/views/user/RegisterResult')
      },
      {
        path: 'recover',
        name: 'recover',
        component: undefined
      }
    ]
  },
  {
    path: '/article',
    component: ArticleLayout,
    children: [
      {
        path: 'routine',
        name: '行程详情',
        component: () => import('@/views/dashboard/RoutineDetail')
      },
      {
        path: 'comment',
        name: '评论详情',
        component: () => import('@/views/dashboard/CommentDetail')
      },
      {
        path: 'tour',
        name: '游记详情',
        component: () => import('@/views/dashboard/TourDetail')
      }
    ]
  },
  {
    path: '/404',
    component: () => import(/* webpackChunkName: "fail" */ '@/views/exception/404')
  }

]
