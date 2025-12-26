import { Request, Response } from 'express';
import {
    UpdateNotificationSettingsService
} from "../../../../application/services/notification/update-notification-settings-service";
import {generateValidationErrorMessage} from "../../validators/generate-validation-message";
import {updateNotificationSettingsValidation} from "../../validators/update-notification-settings.validator";

export class PatchNotificationSettingsHandler {
    constructor(private readonly updateSettings: UpdateNotificationSettingsService) {}

    handle = async (req: Request, res: Response) => {
        if (Array.isArray(req.body)) {
            return res.status(400).json({ message: 'Body must be an object' });
        }

        const { error, value } = updateNotificationSettingsValidation.validate(req.body);
        if (error) {
            return res.status(400).json(generateValidationErrorMessage(error.details));
        }

        const userId = 'fake-user-id';

        await this.updateSettings.execute({
            userId,
            enabled: value.enabled,
            timeOfDay: value.timeOfDay,
            timezone: value.timezone,
        });

        return res.status(204).send();
    };
}
