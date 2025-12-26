import {NotificationSettings} from "../../../domain/models/notification-settings";

export interface NotificationSettingsRepository {
    findByUserId(userId: string): Promise<NotificationSettings | null>;
    save(userId: string, settings: NotificationSettings): Promise<void>;
}
