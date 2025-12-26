import Joi from 'joi';

export const updateNotificationSettingsValidation = Joi.object({
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
