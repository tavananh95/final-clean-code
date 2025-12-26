import {Request, Response} from 'express';
import {GetQuizzCardsHandler} from '../../../../src/presentation/http/handlers/cards/get-quizz-cards.handler';
import {Card} from '../../../../src/domain/models/card';
import {Category} from '../../../../src/domain/models/category';
import {GetQuizzCardsService} from "../../../../src/application/services/get-quizz-cards-service";

function makeRes() {
    const res: Partial<Response> = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res as Response;
}

describe('GetQuizzCardsHandler', () => {
    const mockGetQuizzCardsService = {
        execute: jest.fn(),
    } as unknown as GetQuizzCardsService;

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should return 400 if date format is invalid', async () => {
        // ARRANGE
        const handler = new GetQuizzCardsHandler(mockGetQuizzCardsService);
        const req = {query: {date: 'invalid-date-string'}} as unknown as Request;
        const res = makeRes();

        // ACT
        await handler.handle(req, res);

        // ASSERT
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({message: 'Invalid date format'});
        expect(mockGetQuizzCardsService.execute).not.toHaveBeenCalled();
    });

    it('should call service with current date if no date is provided', async () => {
        // ARRANGE
        const fakeNow = new Date('2024-01-01T12:00:00Z');
        jest.useFakeTimers().setSystemTime(fakeNow);

        const handler = new GetQuizzCardsHandler(mockGetQuizzCardsService);
        const req = {query: {}} as unknown as Request;
        const res = makeRes();

        (mockGetQuizzCardsService.execute as jest.Mock).mockResolvedValue([]);

        // ACT
        await handler.handle(req, res);

        // ASSERT
        expect(mockGetQuizzCardsService.execute).toHaveBeenCalledWith(fakeNow);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith([]);

        jest.useRealTimers();
    });

    it('should call service with parsed date if valid date is provided', async () => {
        // ARRANGE
        const handler = new GetQuizzCardsHandler(mockGetQuizzCardsService);
        const validDateStr = '2025-05-20';
        const req = {query: {date: validDateStr}} as unknown as Request;
        const res = makeRes();

        const expectedDate = new Date(validDateStr);
        (mockGetQuizzCardsService.execute as jest.Mock).mockResolvedValue([]);

        // ACT
        await handler.handle(req, res);

        // ASSERT
        expect(mockGetQuizzCardsService.execute).toHaveBeenCalledWith(expectedDate);
        expect(res.status).toHaveBeenCalledWith(200);
    });

    it('should return 200 with mapped cards', async () => {
        // ARRANGE
        const handler = new GetQuizzCardsHandler(mockGetQuizzCardsService);

        const cards = [
            new Card({
                id: '1',
                question: 'Q1',
                answer: 'A1',
                category: Category.FIRST,
                tag: 'T1',
                nextReviewDate: new Date('2024-01-01') // Cette date ne doit PAS être dans la réponse
            }),
            new Card({
                id: '2',
                question: 'Q2',
                answer: 'A2',
                category: Category.SECOND,
                tag: 'T2'
            }),
        ];

        (mockGetQuizzCardsService.execute as jest.Mock).mockResolvedValue(cards);

        const req = {query: {}} as unknown as Request;
        const res = makeRes();

        // ACT
        await handler.handle(req, res);

        // ASSERT
        expect(res.status).toHaveBeenCalledWith(200);

        expect(res.json).toHaveBeenCalledWith([
            {
                id: '1',
                question: 'Q1',
                answer: 'A1',
                category: Category.FIRST,
                tag: 'T1',
            },
            {
                id: '2',
                question: 'Q2',
                answer: 'A2',
                category: Category.SECOND,
                tag: 'T2',
            },
        ]);
    });
});