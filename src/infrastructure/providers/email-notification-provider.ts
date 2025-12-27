import { NotificationSender } from "../../application/ports/notification/notification-sender";

export class EmailNotificationProvider implements NotificationSender {
    async send(userId: string): Promise<string> {
       return "Notification sent to user!"
    }
}
