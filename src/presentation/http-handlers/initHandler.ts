import { Application, Request, Response } from 'express';
import { AppDataSource } from '../../infrastructure/database/data-source';
import {AnswerCardService} from "../../application/services/answerCardService";
import {TypeOrmCardRepository} from "../../infrastructure/database/repositories/typeorm-card.repository";
import {CardHandler} from "./card.handler";

export const initHandlers = (app: Application) => {
    // Health check
    app.get('/health', (_: Request, res: Response) => {
        res.send({ message: 'ping' });
    });

    // Card dependencies
    const cardRepository = new TypeOrmCardRepository(AppDataSource);
    const answerCardService = new AnswerCardService(cardRepository);
    const cardHandler = new CardHandler(answerCardService);

    app.patch('/cards/:cardId/answer', cardHandler.answer);
};
