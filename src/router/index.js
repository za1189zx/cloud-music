import { createRouter, createWebHashHistory } from 'vue-router'
import store from '@/store'

const routes = [
  {
    path: '/',
    name: 'Discover',
    component: () => import(/* webpackChunkName: "discover" */ '@/views/Discover/Discover.vue'),
    meta: {
      title: '网易云音乐'
    }
  },
  {
    path: '/playlist',
    name: 'Playlist',
    component: () => import(/* webpackChunkName: "playlist" */ '@/views/Playlist/Playlist.vue')
  },
  {
    path: '/song',
    name: 'Song',
    component: () => import(/* webpackChunkName: "song" */ '@/views/Song/Song.vue')
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

router.beforeEach((to, _from, next) => {
  store.commit('toLogin', false)
  window.document.title = to.meta.title === undefined ? '网易云音乐' : to.meta.title
  next()
})

export default router
