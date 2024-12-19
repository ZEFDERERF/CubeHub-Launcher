import { createRouter, createWebHashHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    component: () => import('./views/Home.vue')
  },
  {
    path: '/download',
    component: () => import('./views/Download.vue')
  },
  {
    path: '/download/:version/more',
    component: () => import('./views/download/VersionDetail.vue'),
    props: true
  },
  {
    path: '/settings',
    component: () => import('./views/Settings.vue')
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router 