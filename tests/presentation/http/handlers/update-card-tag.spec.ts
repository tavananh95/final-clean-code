// tests/presentation/update-card-tag.handler.spec.ts
import { Request, Response } from 'express';
import {UpdateCardTagService} from "../../../../src/application/services/update-card-tag-service";
import {UpdateCardTagHandler} from "../../../../src/presentation/http/handlers/cards/update-card-tag.handler";
import * as httpErrorModule from '../../../../src/presentation/http/errors/http-error-handler';

function makeRes() {
    const res: Partial<Response> = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    res.send = jest.fn().mockReturnValue(res);
    return res as Response;
}

describe('UpdateCardTagHandler', () => {
    const mockService = {
        execute: jest.fn(),
    } as unknown as UpdateCardTagService;

    beforeEach(() => jest.clearAllMocks());

    it('should return 400 if body is an array', async () => {
        // ARRANGE
        const handler = new UpdateCardTagHandler(mockService);
        const req = { params: { cardId: '123' }, body: [] } as unknown as Request;
        const res = makeRes();

        // ACT
        await handler.handle(req, res);

        // ASSERT
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ message: 'Body must be an object' });
        expect(mockService.execute).not.toHaveBeenCalled();
    });

    it('should return 400 when cardId is missing/blank', async () => {
        // ARRANGE
        const handler = new UpdateCardTagHandler(mockService);
        const req = { params: { cardId: '   ' }, body: { tag: 'learning' } } as unknown as Request;
        const res = makeRes();

        // ACT
        await handler.handle(req, res);

        // ASSERT
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ message: 'cardId is required' });
        expect(mockService.execute).not.toHaveBeenCalled();
    });

    it('should return 400 when tag is whitespace-only', async () => {
        // ARRANGE
        const handler = new UpdateCardTagHandler(mockService);
        const req = { params: { cardId: '123' }, body: { tag: '   ' } } as unknown as Request;
        const res = makeRes();

        // ACT
        await handler.handle(req, res);

        // ASSERT
        expect(res.status).toHaveBeenCalledWith(400);
        expect(mockService.execute).not.toHaveBeenCalled();
    });

    it('should call service with command and return 204 on success', async () => {
        // ARRANGE
        const handler = new UpdateCardTagHandler(mockService);
        (mockService.execute as jest.Mock).mockResolvedValue(undefined);

        const req = {
            params: { cardId: '123' },
            body: { tag: '  learning  ' },
        } as unknown as Request;
        const res = makeRes();

        // ACT
        await handler.handle(req, res);

        // ASSERT
        expect(mockService.execute).toHaveBeenCalledWith({
            cardId: '123',
            tag: 'learning',
        });
        expect(res.status).toHaveBeenCalledWith(204);
        expect(res.send).toHaveBeenCalled();
    });

    it('should allow removing tag by sending null and return 204', async () => {
        // ARRANGE
        const handler = new UpdateCardTagHandler(mockService);
        (mockService.execute as jest.Mock).mockResolvedValue(undefined);

        const req = {
            params: { cardId: '123' },
            body: { tag: null },
        } as unknown as Request;
        const res = makeRes();

        // ACT
        await handler.handle(req, res);

        // ASSERT
        expect(mockService.execute).toHaveBeenCalledWith({
            cardId: '123',
            tag: undefined,
        });
        expect(res.status).toHaveBeenCalledWith(204);
        expect(res.send).toHaveBeenCalled();
    });

    it('should return 400 when tag is empty string', async () => {
        // ARRANGE
        const handler = new UpdateCardTagHandler(mockService);

        const req = {
            params: { cardId: '123' },
            body: { tag: '' },
        } as unknown as Request;

        const res = makeRes();

        // ACT
        await handler.handle(req, res);

        // ASSERT
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalled();
        expect(mockService.execute).not.toHaveBeenCalled();
    });

    it('should call handleHttpError if service throws', async () => {
        const mockService = {
            execute: jest.fn().mockRejectedValue(new Error('Unexpected')),
        } as unknown as UpdateCardTagService;

        const handler = new UpdateCardTagHandler(mockService);

        const req = {
            params: { cardId: '123' },
            body: { tag: 'test' },
        } as unknown as Request;

        const res = makeRes();
        const handleSpy = jest.spyOn(httpErrorModule, 'handleHttpError');

        await handler.handle(req, res);

        expect(handleSpy).toHaveBeenCalledWith(res, expect.any(Error));

        handleSpy.mockRestore();
    });

});
