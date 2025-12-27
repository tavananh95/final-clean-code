import {Request, Response} from 'express';
import {AnswerCardHandler} from '../../../../src/presentation/http/handlers/cards/answer-card.handler';
import {AnswerCardService} from '../../../../src/application/services/answer-card-service';
import {makeRes} from "../../utils";


describe('AnswerCardHandler', () => {
    const mockAnswerCardService = {
        execute: jest.fn(),
    } as unknown as AnswerCardService;

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should return 404 if the card does not exist', async () => {
        // ARRANGE
        const handler = new AnswerCardHandler(mockAnswerCardService);
        const req = {
            params: {cardId: 'unknown-uuid'},
            body: {isValid: true}
        } as unknown as Request;
        const res = makeRes();

        (mockAnswerCardService.execute as jest.Mock).mockRejectedValue(new Error('Card not found'));

        // ACT
        await handler.handle(req, res);

        // ASSERT
        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({message: 'Card not found'});
    });
});