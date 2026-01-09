import type { RouteRecordRaw } from 'vue-router'
import { Info } from 'lucide-vue-next'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'root',
    redirect: '/home',
    component: () => import('@/layout/AppLayout.vue'),
    children: [
      {
        path: '/404',
        name: 'not-found',
        meta: {
          title: '资源不存在',
          icon: Info,
          hidden: true,
        },
        component: () => import('@/components/Exception/NotFound.vue'),
      },
      { path: '/:pathMatch(.*)*', component: { template: '<div></div>' } },
    ],
  },
  {
    path: '/login',
    name: 'login',
    meta: {
      title: '登录',
      icon: 'Login',
      hidden: true,
    },
    component: () => import('@/views/system/login/index.vue'),
  },
  {
    path: '/profile',
    name: 'profile',
    meta: {
      title: '个人中心',
      icon: 'User',
      hidden: true,
    },
    component: () => import('@/views/profile/index.vue'),
  },
  {
    path: '/500',
    name: 'server-error',
    meta: {
      title: '服务器错误',
      icon: 'Server',
      hidden: true,
    },
    component: () => import('@/components/Exception/ServerError.vue'),
  },
]

export default routes
