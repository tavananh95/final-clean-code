import {NotificationSettingsRepository} from "../../ports/notification/notification-settings.repository";
import {NotificationSettings} from "../../../domain/models/notification-settings";
import {NotificationScheduler} from "../../../domain/services/notification-scheduler";

export interface UpdateNotificationSettingsCommand  {
    userId: string,
    enabled: boolean,
    timeOfDay: string,
    timezone: string,
}

export class UpdateNotificationSettingsService {
    constructor(
        private readonly repo: NotificationSettingsRepository,
    ) {
    }

    async execute(command: UpdateNotificationSettingsCommand): Promise<void> {
        const settings = new NotificationSettings(
            command.enabled,
            command.timeOfDay,
            command.timezone,
            null
        );
        settings.nextRunAt = NotificationScheduler.computeNextRun(settings)

        await this.repo.save(command.userId, settings);
    }
}

