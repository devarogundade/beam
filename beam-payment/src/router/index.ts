import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";
import SwapView from "@/views/SwapView.vue";
import BorrowView from "@/views/BorrowView.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: HomeView,
    },
    {
      path: "/swap",
      name: "swap",
      component: SwapView,
    },
    {
      path: "/borrow",
      name: "borrow",
      component: BorrowView,
    },
  ],
});

export default router;
