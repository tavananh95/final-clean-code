import { Request, Response } from 'express';
import {GetCardsByTagService} from "../../../../src/application/services/get-cards-by-tag-service";
import {Card} from "../../../../src/domain/models/card";
import {Category} from "../../../../src/domain/models/category";
import {CreateCardService} from "../../../../src/application/services/create-card-service";
import {AnswerCardService} from "../../../../src/application/services/answer-card-service";
import {GetCardsByTagHandler} from "../../../../src/presentation/http/handlers/cards/get-cards-by-tag.handler";


function makeRes() {
    const res: Partial<Response> = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res as Response;
}

describe('getCardsByTagHandler', () => {
    const mockCreateCard = {
        execute: jest.fn(),
    } as unknown as CreateCardService;
    const mockAnswerCard = {
        execute: jest.fn(),
    } as unknown as AnswerCardService;
    const mockGetCardsByTag = {
        execute: jest.fn(),
    } as unknown as GetCardsByTagService;

    beforeEach(() => jest.clearAllMocks());

    it('should return 400 if tag is missing', async () => {
        // ARRANGE
        const handler = new GetCardsByTagHandler(mockGetCardsByTag as any);
        const req = { query: {} } as unknown as Request;
        const res = makeRes();

        // ACT
        await handler.handle(req, res);

        // ASSERT
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ message: 'Tag query parameter is required' });
        expect(mockGetCardsByTag.execute).not.toHaveBeenCalled();
    });

    it('should return 400 if tag is blank/whitespace', async () => {
        // ARRANGE
        const handler = new GetCardsByTagHandler(mockGetCardsByTag as any);
        const req = { query: { tag: '   ' } } as unknown as Request;
        const res = makeRes();

        // ACT
        await handler.handle(req, res);

        // ASSERT
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ message: 'Tag query parameter is required' });
        expect(mockGetCardsByTag.execute).not.toHaveBeenCalled();
    });

    it('should call service with trimmed tag and return 200 + mapped cards', async () => {
        // ARRANGE
        const handler = new GetCardsByTagHandler(mockGetCardsByTag as any);

        const cards = [
            new Card({ id: '1', question: 'Q1', answer: 'A1', category: Category.FIRST, tag: 'learning' }),
            new Card({ id: '2', question: 'Q2', answer: 'A2', category: Category.SECOND, tag: 'learning' }),
        ];

        (mockGetCardsByTag.execute as jest.Mock).mockResolvedValue(cards);

        const req = { query: { tag: '  learning  ' } } as unknown as Request;
        const res = makeRes();

        // ACT
        await handler.handle(req, res);

        // ASSERT
        expect(mockGetCardsByTag.execute).toHaveBeenCalledWith('learning');
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith([
            {
                id: '1',
                question: 'Q1',
                answer: 'A1',
                category: Category.FIRST,
                tag: 'learning',
            },
            {
                id: '2',
                question: 'Q2',
                answer: 'A2',
                category: Category.SECOND,
                tag: 'learning',
            },
        ]);
    });

    it('should return 400 if tag is not a string (e.g. tag[]=x)', async () => {
        // ARRANGE
        const handler = new GetCardsByTagHandler(mockGetCardsByTag as any);
        const req = { query: { tag: ['learning'] } } as unknown as Request;
        const res = makeRes();

        // ACT
        await handler.handle(req, res);

        // ASSERT
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ message: 'Tag query parameter is required' });
        expect(mockGetCardsByTag.execute).not.toHaveBeenCalled();
    });
});
