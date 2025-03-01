import { createRouter, createWebHistory } from "vue-router";
import TreasuryView from "../views/TreasuryView.vue";
import PaymentsView from "@/views/PaymentsView.vue";
import SalesView from "@/views/checkouts/SalesView.vue";
import ProductsView from "@/views/checkouts/ProductsView.vue";
import CheckoutView from "@/views/checkouts/CheckoutView.vue";
import SubscriptionView from "@/views/subscriptions/SubscriptionView.vue";
import PlansView from "@/views/subscriptions/PlansView.vue";
import SubsPaymentsView from "@/views/subscriptions/SubsPaymentsView.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "treasury",
      component: TreasuryView,
    },
    {
      path: "/payments",
      name: "payments",
      component: PaymentsView,
      children: [
        {
          path: "/payments",
          name: "payments-checkouts",
          component: CheckoutView,
          children: [
            {
              path: "/payments",
              name: "payments-checkouts-products",
              component: ProductsView,
            },
            {
              path: "/payments/checkouts/sales",
              name: "payments-checkouts-sales",
              component: SalesView,
            },
          ],
        },
        {
          path: "/payments/subscriptions",
          name: "payments-subscriptions",
          component: SubscriptionView,
          children: [
            {
              path: "/payments/subscriptions",
              name: "payments-subscriptions-plans",
              component: PlansView,
            },
            {
              path: "/payments/subscriptions/payments",
              name: "payments-subscriptions-payments",
              component: SubsPaymentsView,
            },
          ],
        },
      ],
    },
  ],
});

export default router;
