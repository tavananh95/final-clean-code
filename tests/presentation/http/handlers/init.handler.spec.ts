import request from 'supertest';
import express, { Application } from 'express';
import { initHandlers } from '../../../../src/presentation/http/handlers/init-handlers';

describe('initHandlers', () => {
    let app: Application;

    beforeEach(() => {
        app = express();
        initHandlers(app);
    });

    it('should respond to /health', async () => {
        const res = await request(app).get('/health');

        expect(res.status).toBe(200);
        expect(res.body).toEqual({ message: 'Leitner system back end service is online' });
    });
});
