export interface NotificationSender {
    send(userId: string): Promise<string>;
}
