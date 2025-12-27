import request from 'supertest';
import { createApp } from '../../src/app';


describe('Express app', () => {
    let app = createApp();

    it('should create an app instance without starting the server', () => {
        expect(app).toBeDefined();
        expect(typeof app.use).toBe('function');
    });

    it('should parse JSON requests', async () => {
        app.post('/test-json', (req, res) => {
            res.json(req.body);
        });

        const payload = { key: 'value' };
        const response = await request(app).post('/test-json').send(payload);

        expect(response.status).toBe(200);
        expect(response.body).toEqual(payload);
    });

    it('should apply CORS headers', async () => {
        app.get('/test-cors', (req, res) => res.send('ok'));
        const response = await request(app).get('/test-cors');

        expect(response.headers['access-control-allow-origin']).toBe('http://localhost:5173');
    });
});
