import {NotificationSettingsRepository} from "../../ports/notification/notification-settings.repository";
import {NotificationSettings} from "../../../domain/models/notification-settings";

export class UpdateNotificationSettingsService {
    constructor(
        private readonly repo: NotificationSettingsRepository,
    ) {}

    async execute(command: {
        userId: string;
        enabled: boolean;
        timeOfDay: string;
        timezone: string;
    }): Promise<void> {
        const settings = new NotificationSettings(
            command.enabled,
            command.timeOfDay,
            command.timezone,
        );

        await this.repo.save(command.userId, settings);
    }
}
