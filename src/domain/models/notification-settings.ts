export class NotificationSettings {
    constructor(
        public readonly enabled: boolean,
        public readonly timeOfDay: string,
        public readonly timezone: string,
    ) {}
}
