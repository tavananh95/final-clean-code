import {Application, Request, Response} from 'express';
import {AppDataSource} from '../../../infrastructure/database/data-source';
import {CreateCardService} from "../../../application/services/create-card-service";
import {AnswerCardService} from "../../../application/services/answer-card-service";
import {TypeOrmCardRepository} from "../../../infrastructure/database/repositories/typeorm-card.repository";
import {FakeOidcProvider} from "../../../infrastructure/database/repositories/fake-auth/fake-oidc-provider";
import {
    FakeAuthAccountRepository
} from "../../../infrastructure/database/repositories/fake-auth/fake-auth-account.repository";
import {FindOrCreateUserService} from "../../../application/services/find-or-create-user-service";
import {JwtTokenService} from "../../../infrastructure/database/repositories/fake-auth/fake-token.service";
import {TypeormUserRepository} from "../../../infrastructure/database/repositories/typeorm-user.repository";
import {AuthenticateService} from "../../../application/services/authenticate-service";
import {AuthenticateHandler} from "./authenticate/authenticate.handler";
import {GetCardsByTagService} from "../../../application/services/get-cards-by-tag-service";
import {CreateCardHandler} from "./cards/create-card.handler";
import {AnswerCardHandler} from "./cards/answer-card.handler";
import {GetCardsByTagHandler} from "./cards/get-cards-by-tag.handler";
import {GetQuizzCardsService} from "../../../application/services/get-quizz-cards-service";
import {GetQuizzCardsHandler} from "./cards/get-quizz-cards.handler";


export const initHandlers = (app: Application) => {
    // Health check
    // ─────────────────────────
    app.get('/health', (_: Request, res: Response) => {
        res.send({message: 'ping'});
    });

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

    // ─────────────────────────
    // Card feature
    // ─────────────────────────
    const cardRepository = new TypeOrmCardRepository(AppDataSource);

    const answerCardService = new AnswerCardService(cardRepository);
    const createCardService = new CreateCardService(cardRepository);
    const getCardsByTagService = new GetCardsByTagService(cardRepository);
    const getQuizzCardsService = new GetQuizzCardsService(cardRepository);

    const createCardHandler = new CreateCardHandler(createCardService);
    app.post('/cards', createCardHandler.handle);

    const getQuizzCardsHandler = new GetQuizzCardsHandler(getQuizzCardsService);
    app.get('/cards/quizz', getQuizzCardsHandler.handle);

    const answerCardHandler = new AnswerCardHandler(answerCardService);
    app.patch('/cards/:cardId/answer', answerCardHandler.handle);

    const getCardsByTagHandler = new GetCardsByTagHandler(getCardsByTagService);
    app.get('/cards', getCardsByTagHandler.handle);

};