import type { Notification } from "@/scripts/types";
import { reactive } from "vue";

export const notify = reactive({
  notifications: [] as Notification[],

  push: function (notification: Notification) {
    this.notifications = [...this.notifications, notification];

    setTimeout(() => {
      this.remove(this.notifications.length - 1);
    }, 5000);
  },

  remove: function (index: number) {
    this.notifications.splice(index, 1);
  },
});
