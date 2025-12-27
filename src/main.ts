import {initDatabase} from "./infrastructure/database/init";
import {createApp} from "./app";
import {
    TypeOrmNotificationSettingsRepository
} from "./infrastructure/database/repositories/typeorm-notification-settings.repository";
import {SendDueNotifications} from "./application/services/notification/send-due-notification-service";
import {startNotificationCron} from "./infrastructure/cron/notification.cron";
import {AppDataSource} from "./infrastructure/database/data-source";
import {EmailNotificationProvider} from "./infrastructure/providers/email-notification-provider";


async function bootstrap() {
    // db
    await initDatabase();

    // cron
    const settingsRepo = new TypeOrmNotificationSettingsRepository(AppDataSource);
    const notifier = new EmailNotificationProvider();

    const sendDueNotifications = new SendDueNotifications(
        settingsRepo,
        notifier
    );

    startNotificationCron(sendDueNotifications);

    // app
    const app = createApp();
    const port = 3000;

    app.listen(port, () => {
        console.log(`Server running on port ${port}`);
    });
}

bootstrap();