import { CreateCardHandler } from '../../../../src/presentation/http/handlers/cards/create-card.handler';
import { CreateCardService } from '../../../../src/application/services/create-card-service';
import { Request, Response } from 'express';
import { Category } from '../../../../src/domain/models/category';
import { Card } from '../../../../src/domain/models/card';

describe('CreateCardHandler', () => {
    const mockService = {
        execute: jest.fn()
    } as unknown as CreateCardService;

    const handler = new CreateCardHandler(mockService);

    const mockResponse = () => {
        const res: Partial<Response> = {};
        res.status = jest.fn().mockReturnValue(res);
        res.json = jest.fn().mockReturnValue(res);
        return res as Response;
    };

    it('should return 201 and card when request is valid', async () => {
        const req = {
            body: {
                question: 'What is SOLID?',
                answer: 'Design principles',
                tag: 'architecture'
            }
        } as Request;

        const card = new Card({
            id: '1',
            question: 'What is SOLID?',
            answer: 'Design principles',
            category: Category.FIRST,
            tag: 'architecture'
        });

        mockService.execute = jest.fn().mockResolvedValue(card);

        const res = mockResponse();

        await handler.handle(req, res);

        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith(card.state);
    });

    it('should return 400 if body is an array', async () => {
        const req = {
            body: []
        } as Request;

        const res = mockResponse();

        await handler.handle(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ message: 'Body must be an object' });
    });

    it('should return 400 when validation fails', async () => {
        const req = {
            body: {
                question: '',
                answer: ''
            }
        } as Request;

        const res = mockResponse();

        await handler.handle(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
    });
});
