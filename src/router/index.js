import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import Download from '../views/Download.vue'
import Settings from '../views/Settings.vue'
import VersionMore from '../views/download/VersionMore.vue'
import VersionList from '../views/download/VersionList.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home
    },
    {
      path: '/download',
      name: 'Download',
      component: Download,
      children: [
        {
          path: '',
          name: 'VersionList',
          component: VersionList
        },
        {
          path: ':id/more',
          name: 'VersionMore',
          component: VersionMore
        }
      ]
    },
    {
      path: '/settings',
      name: 'Settings',
      component: Settings
    }
  ]
})

export default router 