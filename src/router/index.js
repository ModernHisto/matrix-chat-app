import { createRouter, createWebHistory } from 'vue-router';
import Login from '../components/Login.vue';
import ChatList from '../components/ChatList.vue';

const routes = [
  { path: '/', component: Login },
  { path: '/chats', component: ChatList },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;