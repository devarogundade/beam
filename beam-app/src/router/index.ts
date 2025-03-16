import { createRouter, createWebHistory } from "vue-router";
import TreasuryView from "../views/TreasuryView.vue";
import PaymentsView from "@/views/PaymentsView.vue";
import SalesView from "@/views/checkouts/SalesView.vue";
import ProductsView from "@/views/checkouts/ProductsView.vue";
import CheckoutView from "@/views/checkouts/CheckoutView.vue";
import SubscriptionView from "@/views/subscriptions/SubscriptionView.vue";
import PlansView from "@/views/subscriptions/PlansView.vue";
import SubsPaymentsView from "@/views/subscriptions/SubsPaymentsView.vue";
import ChatView from "@/views/ChatView.vue";
import SettingsView from "@/views/SettingsView.vue";
import ConnectView from "@/views/onboarding/ConnectView.vue";
import App from "@/App.vue";
import Home from "@/Home.vue";
import WatchView from "@/views/onboarding/WatchView.vue";
import ProfileView from "@/views/onboarding/ProfileView.vue";
import ReviewView from "@/views/onboarding/ReviewView.vue";
import MultisigView from "@/views/onboarding/MultisigView.vue";
import GeneralView from "@/views/settings/GeneralView.vue";
import WalletSettings from "@/views/settings/WalletSettings.vue";
import PaymentsSettingsView from "@/views/settings/PaymentsSettingsView.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition;
    } else {
      return { top: 0 };
    }
  },
  routes: [
    {
      path: "/onboarding",
      name: "onboarding",
      component: Home,
      children: [
        {
          path: "/onboarding",
          name: "onboarding-wallet",
          component: ConnectView,
        },
        {
          path: "/onboarding/watch",
          name: "onboarding-watch-wallet",
          component: WatchView,
        },
        {
          path: "/onboarding/profile",
          name: "onboarding-connect-profile",
          component: ProfileView,
        },
        {
          path: "/onboarding/multisig",
          name: "onboarding-connect-multisig",
          component: MultisigView,
        },
        {
          path: "/onboarding/review",
          name: "onboarding-connect-review",
          component: ReviewView,
        },
      ],
    },
    {
      path: "/",
      name: "app",
      component: App,
      children: [
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
        {
          path: "/chat",
          name: "chat",
          component: ChatView,
        },
        {
          path: "/settings",
          name: "settings",
          component: SettingsView,
          children: [
            {
              path: "/settings",
              name: "settings-general",
              component: GeneralView,
            },
            {
              path: "/settings/payments",
              name: "settings-payments",
              component: PaymentsSettingsView,
            },
            {
              path: "/settings/wallet",
              name: "settings-wallet",
              component: WalletSettings,
            },
          ],
        },
      ],
    },
  ],
});

export default router;
