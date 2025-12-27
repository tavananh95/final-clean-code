import {UserNotificationSettingsEntity} from "../database/entities/user-notification-settings.entity";
import {NotificationSettings} from "../../domain/models/notification-settings";

export class NotificationSettingsMapper {
    static toDomain(entity: UserNotificationSettingsEntity): NotificationSettings {
        return new NotificationSettings(
            entity.enabled,
            entity.timeOfDay,
            entity.timezone,
            entity.nextRunAt
        );
    }

    static toEntity(
        userId: string,
        settings: NotificationSettings
    ): UserNotificationSettingsEntity {
        const entity = new UserNotificationSettingsEntity();
        entity.userId = userId;
        entity.enabled = settings.enabled;
        entity.timeOfDay = settings.timeOfDay;
        entity.timezone = settings.timezone;
        entity.nextRunAt = settings.nextRunAt;
        return entity;
    }
}