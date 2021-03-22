import Vue from 'vue'
import Router from 'vue-router'
import home from './views/home.vue'
import loginSignup from './views/login-signup.vue'
import board from './views/board.vue'
import boardGallery from './views/board-gallery.vue'
import taskDetails from './views/task-details.vue'

Vue.use(Router)

export const router = new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'home',
      component: home
    },
    {
      path: '/login',
      name: 'login-signup',
      component: loginSignup
    },
    {
      path: '/board/:boardId',
      name: 'board',
      component: board,
      children: [
        {
          path: 'details/:taskId',
          name: 'task-details',
          component: taskDetails
        },
      ]
    },
    {
      path: '/boards',
      name: 'board-gallery',
      component: boardGallery
    }
  ]
})
