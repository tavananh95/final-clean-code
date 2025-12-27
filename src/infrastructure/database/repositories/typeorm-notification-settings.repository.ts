import { DataSource, Repository, LessThanOrEqual } from "typeorm";
import { NotificationSettings } from "../../../domain/models/notification-settings";
import { UserNotificationSettingsEntity } from "../entities/user-notification-settings.entity";
import { NotificationSettingsRepository } from "../../../application/ports/notification/notification-settings.repository";
import {NotificationSettingsMapper} from "../../mappers/notification-settings-mapper";

export class TypeOrmNotificationSettingsRepository
    implements NotificationSettingsRepository {

    private readonly repo: Repository<UserNotificationSettingsEntity>;

    constructor(dataSource: DataSource) {
        this.repo = dataSource.getRepository(UserNotificationSettingsEntity);
    }

    async findByUserId(userId: string): Promise<NotificationSettings | null> {
        const entity = await this.repo.findOneBy({ userId });
        if (!entity) return null;

        return NotificationSettingsMapper.toDomain(entity);
    }

    async save(userId: string, settings: NotificationSettings): Promise<void> {
        await this.repo.save(NotificationSettingsMapper.toEntity(userId, settings));
    }

    async findDue(now: Date): Promise<Array<{ userId: string; settings: NotificationSettings }>> {
        const entities = await this.repo.find({
            where: {
                enabled: true,
                nextRunAt: LessThanOrEqual(now),
            },
            order: { nextRunAt: "ASC" },
            take: 100,
        });

        return entities.map(e => ({
            userId: e.userId,
            settings: NotificationSettingsMapper.toDomain(e),
        }));
    }

}
