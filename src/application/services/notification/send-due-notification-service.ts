import {NotificationSettingsRepository} from "../../ports/notification/notification-settings.repository";
import { NotificationScheduler } from "../../../domain/services/notification-scheduler";
import {NotificationSender} from "../../ports/notification/notification-sender";


export class SendDueNotifications {
    constructor(
        private readonly settingsRepo: NotificationSettingsRepository,
        private readonly notifier: NotificationSender
    ) {}

    async execute(now: Date): Promise<void> {
        const due = await this.settingsRepo.findDue(now);

        for (const { userId, settings } of due) {
            await this.notifier.send(userId);

            settings.nextRunAt = NotificationScheduler.computeNextRun(
                settings,
                now
            );

            await this.settingsRepo.save(userId, settings);
        }
    }
}
