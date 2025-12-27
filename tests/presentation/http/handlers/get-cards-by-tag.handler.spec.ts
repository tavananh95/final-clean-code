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

    it('should return all cards when no tags are provided', async () => {
        const handler = new GetCardsByTagHandler(mockGetCardsByTag as any);

        const cards = [
            new Card({ id: '1', question: 'Q1', answer: 'A1', category: Category.FIRST }),
        ];

        (mockGetCardsByTag.execute as jest.Mock).mockResolvedValue(cards);

        const req = { query: {} } as unknown as Request;
        const res = makeRes();

        await handler.handle(req, res);

        expect(mockGetCardsByTag.execute).toHaveBeenCalledWith(undefined);
        expect(res.status).toHaveBeenCalledWith(200);
    });

    it('should accept comma separated tags', async () => {
        const handler = new GetCardsByTagHandler(mockGetCardsByTag as any);

        (mockGetCardsByTag.execute as jest.Mock).mockResolvedValue([]);

        const req = { query: { tags: 'learning,review' } } as unknown as Request;
        const res = makeRes();

        await handler.handle(req, res);

        expect(mockGetCardsByTag.execute).toHaveBeenCalledWith(['learning', 'review']);
    });

    it('should accept multiple tags as array', async () => {
        const handler = new GetCardsByTagHandler(mockGetCardsByTag as any);

        (mockGetCardsByTag.execute as jest.Mock).mockResolvedValue([]);

        const req = { query: { tags: ['learning', 'review'] } } as unknown as Request;
        const res = makeRes();

        await handler.handle(req, res);

        expect(mockGetCardsByTag.execute).toHaveBeenCalledWith(["learning", "review"]);
        expect(res.status).toHaveBeenCalledWith(200);
    });

    
    it('should call handleHttpError if service throws', async () => {
        const handler = new GetCardsByTagHandler(mockGetCardsByTag as any);
        const req = { query: { tags: 'learning' } } as unknown as Request;
        const res = makeRes();

        const error = new Error('Service failure');
        (mockGetCardsByTag.execute as jest.Mock).mockRejectedValue(error);

        const spyHandleHttpError = jest.spyOn(require('../../../../src/presentation/http/errors/http-error-handler'), 'handleHttpError');

        await handler.handle(req, res);

        expect(spyHandleHttpError).toHaveBeenCalledWith(res, error);

        spyHandleHttpError.mockRestore();
    });

    it('should set tagArray to undefined if tags array is empty after trimming', async () => {
        const handler = new GetCardsByTagHandler(mockGetCardsByTag as any);

        (mockGetCardsByTag.execute as jest.Mock).mockResolvedValue([]);

        const req = { query: { tags: ['   ', ''] } } as unknown as Request;
        const res = makeRes();

        await handler.handle(req, res);

        expect(mockGetCardsByTag.execute).toHaveBeenCalledWith(undefined);
        expect(res.status).toHaveBeenCalledWith(200);
    });


});
