import Joi from 'joi';
import {
    UpdateNotificationSettingsCommand
} from "../../../application/services/notification/update-notification-settings-service";

export const updateNotificationSettingsValidation = Joi.object<UpdateNotificationSettingsCommand>({
    userId: Joi.required(),
    enabled: Joi.boolean().optional(),

    timeOfDay: Joi.string()
        .pattern(/^([01]\d|2[0-3]):([0-5]\d)$/)
        .optional(),

    timezone: Joi.string()
        .min(1)
        .optional(),
})
    .min(1)
    .prefs({ abortEarly: false, convert: true });
