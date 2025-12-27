import {
    UpdateNotificationSettingsService
} from "../../../src/application/services/notification/update-notification-settings-service";
import {NotificationSettings} from "../../../src/domain/models/notification-settings";
import {NotificationScheduler} from "../../../src/domain/services/notification-scheduler";
import {InMemoryNotificationSettingsRepository} from "../../mock-classes/in-memory-notification-settings-repository";


describe("UpdateNotificationSettingsService", () => {

    it("should save notification settings with computed nextRunAt when enabled", async () => {
        // Arrange
        const repo = new InMemoryNotificationSettingsRepository();
        const service = new UpdateNotificationSettingsService(repo);

        const command = {
            userId: "user-123",
            enabled: true,
            timeOfDay: "19:30",
            timezone: "Europe/Paris",
        };

        // Freeze time (important)
        const now = new Date("2025-01-01T10:00:00.000Z");
        jest.useFakeTimers().setSystemTime(now);

        // Act
        await service.execute(command);

        // Assert
        expect(repo.saved).toHaveLength(1);

        const saved = repo.saved[0];

        expect(saved.userId).toBe("user-123");
        expect(saved.settings).toBeInstanceOf(NotificationSettings);
        expect(saved.settings.enabled).toBe(true);
        expect(saved.settings.timeOfDay).toBe("19:30");
        expect(saved.settings.timezone).toBe("Europe/Paris");
        expect(saved.settings.nextRunAt).toBeInstanceOf(Date);

        // Optional: exact value assertion
        const expected = NotificationScheduler.computeNextRun(
            saved.settings,
            now
        );
        expect(saved.settings.nextRunAt?.toISOString())
            .toBe(expected?.toISOString());

        jest.useRealTimers();
    });

    it("should save settings with nextRunAt null when disabled", async () => {
        const repo = new InMemoryNotificationSettingsRepository();
        const service = new UpdateNotificationSettingsService(repo);

        const command = {
            userId: "user-456",
            enabled: false,
            timeOfDay: "19:30",
            timezone: "Europe/Paris",
        };

        await service.execute(command);

        expect(repo.saved).toHaveLength(1);
        expect(repo.saved[0].settings.nextRunAt).toBeNull();
    });


});
