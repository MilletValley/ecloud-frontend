import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/components/pages/Login'
import Layout from '@/components/Layout'
import Dashboard from '@/components/pages/Dashboard'
import Apply from '@/components/pages/Apply'
import SystemManage from '@/components/pages/SystemManage'
import ApplicationManage from '@/components/pages/ApplicationManage'
import DatabaseManage from '@/components/pages/DatabaseManage'
import MiddlewareManage from '@/components/pages/MiddlewareManage'

Vue.use(Router)

export const routes = [
  {
    path: '/login',
    component: Login
  },
  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [
      {
        path: 'dashboard',
        component: Dashboard,
        name: 'dashboard',
        meta: {
          title: '资源概览',
          icon: 'dashboard'
        }
      }
    ]
  },
  {
    path: '/apply',
    component: Layout,
    meta: {
      title: '业务系统',
      icon: 'business'
    },
    children: [
      {
        path: '',
        name: 'apply',
        component: Apply,
        meta: {
          title: '申请',
          breadcrumb: [
            {
              name: '首页',
              path: '/'
            },
            {
              name: '业务申请',
              path: '/apply'
            }
          ]
        }
      }
    ]
  },
  {
    path: '/servermanage',
    component: Layout,
    meta: {
      title: '服务器管理',
      icon: 'server-manage'
    },
    children: [
      {
        path: 'system',
        name: 'system',
        component: SystemManage,
        meta: {
          title: '系统服务',
          breadcrumb: [
            {
              name: '首页',
              path: '/'
            },
            {
              name: '系统服务',
              path: '/servermanage/system'
            }
          ]
        }
      },
      {
        path: 'application',
        name: 'application',
        component: ApplicationManage,
        meta: {
          title: '应用服务器',
          breadcrumb: [
            {
              name: '首页',
              path: '/'
            },
            {
              name: '应用服务器',
              path: '/servermanage/application'
            }
          ]
        }
      },
      {
        path: 'database',
        name: 'database',
        component: DatabaseManage,
        meta: {
          title: '数据库服务器',
          breadcrumb: [
            {
              name: '首页',
              path: '/'
            },
            {
              name: '数据库服务器',
              path: '/servermanage/database'
            }
          ]
        }
      },
      {
        path: 'middleware',
        name: 'middleware',
        component: MiddlewareManage,
        meta: {
          title: '中间件服务器',
          breadcrumb: [
            {
              name: '首页',
              path: '/'
            },
            {
              name: '中间件服务器',
              path: '/servermanage/middleware'
            }
          ]
        }
      }
    ]
  }
]
export default new Router({
  routes
})
