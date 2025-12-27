import { AuthenticateHandler } from '../../../../src/presentation/http/handlers/authenticate/authenticate.handler';
import { AuthenticateService } from '../../../../src/application/services/auth/authenticate-service';
import { Request, Response } from 'express';

function makeRes() {
    const res: Partial<Response> = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res as Response;
}

describe('AuthenticateHandler', () => {
    let mockService: Partial<AuthenticateService>;
    let handler: AuthenticateHandler;

    beforeEach(() => {
        mockService = {
            execute: jest.fn(),
        };
        handler = new AuthenticateHandler(mockService as AuthenticateService);
        jest.clearAllMocks();
    });

    it('should return 400 if neither idToken nor authorizationCode is provided', async () => {
        const req = { body: {} } as Request;
        const res = makeRes();

        await handler.handle(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
            message: 'Provide either idToken or authorizationCode.',
        });
    });

    it('should return 400 if authorizationCode is provided but redirectUri is missing', async () => {
        const req = { body: { authorizationCode: 'code123' } } as Request;
        const res = makeRes();

        await handler.handle(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
            message: 'redirectUri is required for authorizationCode flow.',
        });
    });

    it('should call service with idToken if provided', async () => {
        const req = { body: { idToken: 'token123' } } as Request;
        const res = makeRes();
        (mockService.execute as jest.Mock).mockResolvedValue({ accessToken: 'abc', userId: 'user1' });

        await handler.handle(req, res);

        expect(mockService.execute).toHaveBeenCalledWith({ idToken: 'token123' });
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ accessToken: 'abc', userId: 'user1' });
    });

    it('should call service with authorizationCode flow if provided', async () => {
        const req = {
            body: {
                authorizationCode: 'code123',
                redirectUri: 'https://callback',
                codeVerifier: 'verifier',
            },
        } as Request;
        const res = makeRes();
        (mockService.execute as jest.Mock).mockResolvedValue({ accessToken: 'abc', userId: 'user1' });

        await handler.handle(req, res);

        expect(mockService.execute).toHaveBeenCalledWith({
            authorizationCode: 'code123',
            redirectUri: 'https://callback',
            codeVerifier: 'verifier',
        });
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ accessToken: 'abc', userId: 'user1' });
    });

    it('should return 401 if service throws token/auth related error', async () => {
        const req = { body: { idToken: 'token123' } } as Request;
        const res = makeRes();
        (mockService.execute as jest.Mock).mockRejectedValue(new Error('Invalid token'));

        await handler.handle(req, res);

        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({ message: 'Invalid token' });
    });

    it('should return 500 if service throws unknown error', async () => {
        const req = { body: { idToken: 'token123' } } as Request;
        const res = makeRes();
        (mockService.execute as jest.Mock).mockRejectedValue(new Error('Database down'));

        await handler.handle(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ message: 'Database down' });
    });

    it('should handle undefined req.body', async () => {
        const req = {} as Request;
        const res = makeRes();

        await handler.handle(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
            message: 'Provide either idToken or authorizationCode.',
        });
    });

    it('should handle unknown thrown value', async () => {
        const req = { body: { idToken: 'token123' } } as Request;
        const res = makeRes();
        (mockService.execute as jest.Mock).mockRejectedValue('string error');

        await handler.handle(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ message: 'Unexpected error' });
    });



});
