import { createRouter, createWebHistory } from "vue-router";
import DefaultView from "../views/DefaultView.vue";
import SwapView from "@/views/SwapView.vue";
import BorrowView from "@/views/BorrowView.vue";
import ReceiptView from "@/views/ReceiptView.vue";
import App from "@/App.vue";
import Home from "@/Home.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "app",
      component: App,
      children: [
        {
          path: "/",
          name: "default",
          component: DefaultView,
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
    },
    {
      path: "/receipt",
      name: "home",
      component: Home,
      children: [
        {
          path: "/receipt",
          name: "receipt",
          component: ReceiptView,
        },
      ],
    },
  ],
});

export default router;
