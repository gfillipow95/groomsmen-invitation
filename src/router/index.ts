import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import StoryView from '@/views/StoryView.vue'
import NotFoundView from '@/views/NotFound.vue'

const routes: RouteRecordRaw[] = [
  { path: '/', component: HomeView },
  { path: '/story/:friend', component: StoryView, props: true },
  { path: '/:pathMatch(.*)*', component: NotFoundView }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

export default router
