import { createRouter, createWebHistory } from 'vue-router';

const Home = () => import('../views/Home');
const About = () => import('../views/About');
const ButtonDemo = () => import('../views/demos/ButtonDemo');
const InputDemo = () => import('../views/demos/InputDemo');
const ColorPickerDemo = () => import('../views/demos/ColorPickerDemo');
const DropdownDemo = () => import('../views/demos/DropdownDemo');

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
    path: '/color-picker',
    component: ColorPickerDemo,
    name: 'ColorPicker',
  },
  {
    path: '/dropdown',
    component: DropdownDemo,
    name: 'Dropdown',
  },
  {
    path: '/input',
    component: InputDemo,
    name: 'Input',
  },
];

export const router = createRouter({
  history: createWebHistory(),
  routes,
});
