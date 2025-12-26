import {DataSource, Repository} from 'typeorm';
import { NotificationSettings } from '../../../domain/models/notification-settings';
import { UserNotificationSettingsEntity } from '../entities/user-notification-settings.entity';
import {NotificationSettingsRepository} from "../../../application/ports/notification/notification-settings.repository";

export class TypeOrmNotificationSettingsRepository
    implements NotificationSettingsRepository {

    private repo: Repository<UserNotificationSettingsEntity>;

    constructor(dataSource: DataSource) {
        this.repo = dataSource.getRepository(UserNotificationSettingsEntity);
    }


    async findByUserId(userId: string): Promise<NotificationSettings | null> {
        const entity = await this.repo.findOneBy({ userId });
        if (!entity) return null;

        return new NotificationSettings(
            entity.enabled,
            entity.timeOfDay,
            entity.timezone,
        );
    }

    async save(userId: string, settings: NotificationSettings): Promise<void> {
        await this.repo.save({
            userId,
            enabled: settings.enabled,
            timeOfDay: settings.timeOfDay,
            timezone: settings.timezone,
        });
    }
}
