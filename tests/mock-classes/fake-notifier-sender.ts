import {NotificationSender} from "../../src/application/ports/notification/notification-sender";

export class FakeNotificationSender implements NotificationSender {
    public sentTo: string[] = [];

    async send(userId: string): Promise<string> {
        this.sentTo.push(userId);
        return "Notification sent to user!"
    }
}
