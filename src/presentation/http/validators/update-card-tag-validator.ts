import Joi from 'joi';


export const updateCardTagValidation = Joi.object({
    tag: Joi.alternatives().try(
        Joi.string().trim(),
        Joi.valid(null)
    ).optional(),
}).prefs({ abortEarly: false, convert: true });
