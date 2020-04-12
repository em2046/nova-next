import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home'
import About from '../views/About'
import ButtonDemo from '../views/demos/ButtonDemo'
import InputDemo from '../views/demos/InputDemo'

const routes = [
  {
    path: '/',
    component: Home,
    name: 'Home',
  },
  {
    path: '/about',
    component: About,
    name: 'About',
  },
  {
    path: '/button',
    component: ButtonDemo,
    name: 'Button',
  },
  {
    path: '/input',
    component: InputDemo,
    name: 'Input',
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
