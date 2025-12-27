import { Request, Response } from 'express';
import { AnswerCardHandler } from '../../../../src/presentation/http/handlers/cards/answer-card.handler';
import { AnswerCardService } from '../../../../src/application/services/answer-card-service';
import { CardNotFoundError } from '../../../../src/domain/errors/card-not-found-error';
import { GeneralRequestValidationError } from '../../../../src/presentation/http/errors/general-request-validation-error';
import { isUUID } from 'class-validator';


function makeRes() {
    const res: Partial<Response> = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    res.send = jest.fn().mockReturnValue(res);
    return res as Response;
}

describe('AnswerCardHandler with comparison', () => {
    let mockService: Partial<AnswerCardService>;
    let handler: AnswerCardHandler;

    beforeEach(() => {
        mockService = {
            executeWithComparison: jest.fn(),
        };
        handler = new AnswerCardHandler(mockService as AnswerCardService);
        jest.clearAllMocks();
    });

    it('should return 204 when userAnswer matches card answer', async () => {
        const req = { params: { cardId: '123e4567-e89b-12d3-a456-426614174000' }, body: { userAnswer: '42' } } as unknown as Request;
        const res = makeRes();

        (mockService.executeWithComparison as jest.Mock).mockResolvedValue({
            state: { answer: '42' }
        });

        await handler.handle(req, res);

        expect(mockService.executeWithComparison).toHaveBeenCalledWith('123e4567-e89b-12d3-a456-426614174000', '42', false);
        expect(res.status).toHaveBeenCalledWith(204);
        expect(res.send).toHaveBeenCalled();
    });

    it('should return 204 when force is true even if userAnswer is wrong', async () => {
        const req = { 
            params: { cardId: '123e4567-e89b-12d3-a456-426614174005' }, 
            body: { userAnswer: 'wrong', force: true } 
        } as unknown as Request;
        const res = makeRes();

        (mockService.executeWithComparison as jest.Mock).mockResolvedValue({
            state: { answer: 'correct' }
        });

        await handler.handle(req, res);

        expect(mockService.executeWithComparison).toHaveBeenCalledWith(
            '123e4567-e89b-12d3-a456-426614174005', 'wrong', true
        );
        expect(res.status).toHaveBeenCalledWith(204);
        expect(res.send).toHaveBeenCalled();
    });

    it('should return 200 with correct answer if userAnswer is wrong and force is false', async () => {
        const req = { 
            params: { cardId: '123e4567-e89b-12d3-a456-426614174006' }, 
            body: { userAnswer: 'wrong', force: false } 
        } as unknown as Request;
        const res = makeRes();

        (mockService.executeWithComparison as jest.Mock).mockResolvedValue({
            state: { answer: 'correct' }
        });

        await handler.handle(req, res);

        expect(mockService.executeWithComparison).toHaveBeenCalledWith(
            '123e4567-e89b-12d3-a456-426614174006', 'wrong', false
        );
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
            message: 'Incorrect answer',
            correctAnswer: 'correct'
        });
    });


    it('should return 200 with correct answer if userAnswer is wrong', async () => {
        const req = { params: { cardId: '123e4567-e89b-12d3-a456-426614174001' }, body: { userAnswer: 'wrong' } } as unknown as Request;
        const res = makeRes();

        (mockService.executeWithComparison as jest.Mock).mockResolvedValue({
            state: { answer: 'correct' }
        });

        await handler.handle(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
            message: 'Incorrect answer',
            correctAnswer: 'correct'
        });
    });

    it('should return 400 if userAnswer is missing or not a string', async () => {
        const req = { params: { cardId: '123e4567-e89b-12d3-a456-426614174002' }, body: { userAnswer: 123 } } as unknown as Request;
        const res = makeRes();

        await handler.handle(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ message: 'userAnswer must be a non-empty string' });
    });

    it('should return 400 if cardId is invalid', async () => {
        const req = { params: { cardId: 'invalid-uuid' }, body: { userAnswer: '42' } } as unknown as Request;
        const res = makeRes();

        await handler.handle(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ message: 'Invalid cardId format' });
    });

    it('should return 404 if card not found', async () => {
        const req = { params: { cardId: '123e4567-e89b-12d3-a456-426614174003' }, body: { userAnswer: '42' } } as unknown as Request;
        const res = makeRes();

        (mockService.executeWithComparison as jest.Mock).mockRejectedValue(new CardNotFoundError());

        await handler.handle(req, res);

        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({ message: 'Card not found' });
    });

    it('should return 500 for unexpected errors', async () => {
        const req = { params: { cardId: '123e4567-e89b-12d3-a456-426614174004' }, body: { userAnswer: '42' } } as unknown as Request;
        const res = makeRes();

        (mockService.executeWithComparison as jest.Mock).mockRejectedValue(new Error('Unexpected'));

        await handler.handle(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ message: 'internal error' });
    });
});
