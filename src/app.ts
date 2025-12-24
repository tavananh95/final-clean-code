import express, { type Request, type Response } from 'express';

export function createApp() {
    const app = express();
    const port = 3000;
    const cors = require('cors');

    app.use(cors({
        origin: "http://localhost:5173"
    }));
    app.use(express.json());
    // initHandlers(app);

    try {
        app.listen(port, () => {
            console.log(`Server running on http://localhost:${port}`);
            // swaggerDocs(app, port);
        });
    } catch (error) {
        if (error instanceof Error) {
            console.error(error.message);
        }
    }
    return app;
}
