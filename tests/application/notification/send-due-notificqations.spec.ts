import {FakeNotificationSender} from "../../mock-classes/fake-notifier-sender";
import {SendDueNotifications} from "../../../src/application/services/notification/send-due-notification-service";
import {NotificationSettings} from "../../../src/domain/models/notification-settings";
import {InMemoryNotificationSettingsRepository} from "../../mock-classes/in-memory-notification-settings-repository";
import {NotificationScheduler} from "../../../src/domain/services/notification-scheduler";


describe("SendDueNotifications", () => {

    beforeEach(() => {
        jest.useFakeTimers();
        jest.setSystemTime(new Date("2025-01-01T10:00:00.000Z"));
    });

    afterEach(() => {
        jest.useRealTimers();
    });

    it("should send notifications and reschedule nextRunAt for due users", async () => {
        // Arrange
        const repo = new InMemoryNotificationSettingsRepository();
        const notifier = new FakeNotificationSender();
        const service = new SendDueNotifications(repo, notifier);

        const now = new Date();

        const settings = new NotificationSettings(
            true,
            "19:30",
            "Europe/Paris",
            new Date("2025-01-01T08:00:00.000Z")
        );

        repo.due = [
            { userId: "user-1", settings }
        ];

        // Act
        await service.execute(now);

        // Assert
        expect(notifier.sentTo).toEqual(["user-1"]);

        expect(repo.saved).toHaveLength(1);
        expect(repo.saved[0].userId).toBe("user-1");

        const savedSettings = repo.saved[0].settings;
        expect(savedSettings.nextRunAt).toBeInstanceOf(Date);

        const expectedNextRun = NotificationScheduler.computeNextRun(
            savedSettings,
            now
        );

        expect(savedSettings.nextRunAt?.toISOString())
            .toBe(expectedNextRun?.toISOString());
    });

    it("should return a success message from notifier (optional assertion)", async () => {
        const notifier = new FakeNotificationSender();

        const result = await notifier.send("user-42");

        expect(result).toBe("Notification sent to user!");
        expect(notifier.sentTo).toEqual(["user-42"]);
    });

});
