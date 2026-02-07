import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";

import DashboardView from "@/views/Dashboard.vue";
import UserList from "@/views/UserList.vue";
import UserForm from "@/views/UserForm.vue";

import PaymentList from "@/views/PaymentList.vue";
import PaymentForm from "@/views/PaymentForm.vue";
import PaymentDetail from "@/views/PaymentDetail.vue";



const routes = [
  { path: "/", component: DashboardView },
  { path: "/users", component: UserList },
  { path: "/users/new", component: UserForm },
  { path: "/users/:id", component: UserForm },
  { path: "/payments", component: PaymentList },
  { path: "/payments/new", component: PaymentForm },
  { path: "/payments/:id/edit", component: PaymentForm },
  { path: "/payments/:id", component: PaymentDetail },
  
];


const router = createRouter({
  history: createWebHistory(process.env.BASE_URL || '/'),
  routes,
});

export default router;
