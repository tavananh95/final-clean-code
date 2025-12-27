import Joi from 'joi';
import {CreateCardCommand} from "../../../application/services/create-card-service";


export const createCardValidation = Joi.object<CreateCardCommand>({
    question: Joi.string().trim().min(1).required(),
    answer: Joi.string().trim().min(1).required(),
    tag: Joi.string().optional().allow(""),
}).prefs({ abortEarly: false, convert: true });
