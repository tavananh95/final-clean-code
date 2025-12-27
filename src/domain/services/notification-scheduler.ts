import {NotificationSettings} from "../models/notification-settings";
import { DateTime } from "luxon";

export class NotificationScheduler {

    static computeNextRun(
        settings: NotificationSettings,
        nowUtc: Date = new Date()
    ): Date | null {
        if (!settings.enabled) return null;

        const [hour, minute] = settings.timeOfDay.split(":").map(Number);

        const now = DateTime.fromJSDate(nowUtc, { zone: "utc" });
        const localNow = now.setZone(settings.timezone);

        let candidate = localNow.set({
            hour,
            minute,
            second: 0,
            millisecond: 0,
        });

        if (candidate <= localNow) {
            candidate = candidate.plus({ days: 1 });
        }

        return candidate.toUTC().toJSDate();
    }
}
