import { Application, Request, Response } from 'express';
import { AppDataSource } from '../../infrastructure/database/data-source';
import { CreateCardService } from "../../application/services/createCardService";
import {AnswerCardService} from "../../application/services/answerCardService";
import {TypeOrmCardRepository} from "../../infrastructure/database/repositories/typeorm-card.repository";
import {CardHandler} from "./card.handler";
import {FakeOidcProvider} from "../../infrastructure/database/repositories/fake-auth/fake-oidc-provider";
import {
    FakeAuthAccountRepository
} from "../../infrastructure/database/repositories/fake-auth/fake-auth-account.repository";
import {FindOrCreateUserService} from "../../application/services/find-or-create-user-service";
import {JwtTokenService} from "../../infrastructure/database/repositories/fake-auth/fake-token.service";
import {TypeormUserRepository} from "../../infrastructure/database/repositories/typeorm-user.repository";
import {AuthenticateService} from "../../application/services/authenticate-service";
import {AuthenticateHandler} from "./authenticate.handler";


export const initHandlers = (app: Application) => {
    // Health check
    // ─────────────────────────
    app.get('/health', (_: Request, res: Response) => {
        res.send({ message: 'ping' });
    });

    // ─────────────────────────
    // Card feature
    // ─────────────────────────
    const cardRepository = new TypeOrmCardRepository(AppDataSource);
    const answerCardService = new AnswerCardService(cardRepository);
    const createCardService = new CreateCardService(cardRepository);

    const cardHandler = new CardHandler(
        createCardService,
        answerCardService
    );

    app.post('/cards', cardHandler.create);
    app.patch('/cards/:cardId/answer', cardHandler.answer);

    // ─────────────────────────
    // Auth / OIDC feature
    // ─────────────────────────
    const oidcProvider = new FakeOidcProvider();
    const userRepository = new TypeormUserRepository(AppDataSource);
    const authAccountRepository = new FakeAuthAccountRepository();
    const tokenService = new JwtTokenService();

    const findOrCreateUserService = new FindOrCreateUserService(
        userRepository,
        authAccountRepository,
    );

    const authenticateService = new AuthenticateService(
        oidcProvider,
        findOrCreateUserService,
        tokenService,
    );

    const authenticateHandler = new AuthenticateHandler(authenticateService);

    
    app.post('/auth/provider', authenticateHandler.handle);
};