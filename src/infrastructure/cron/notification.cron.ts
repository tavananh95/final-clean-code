import cron from "node-cron";
import {SendDueNotifications} from "../../application/services/notification/send-due-notification-service";

export function startNotificationCron(
    useCase: SendDueNotifications
) {
    cron.schedule("* * * * *", async () => {
        try {
            await useCase.execute(new Date());
        } catch (e) {
            console.error("Notification cron failed", e);
        }
    });
}
