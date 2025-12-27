import {
    NotificationSettingsRepository
} from "../../src/application/ports/notification/notification-settings.repository";
import {NotificationSettings} from "../../src/domain/models/notification-settings";


export class InMemoryNotificationSettingsRepository
    implements NotificationSettingsRepository {

    public due: Array<{ userId: string; settings: NotificationSettings }> = [];
    public saved: Array<{ userId: string; settings: NotificationSettings }> = [];

    async findByUserId(): Promise<NotificationSettings | null> {
        return null;
    }

    async findDue(): Promise<any[]> {
        return this.due;
    }

    async save(userId: string, settings: NotificationSettings): Promise<void> {
        this.saved.push({ userId, settings });
    }
}
