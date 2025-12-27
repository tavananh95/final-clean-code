import express, { type Request, type Response } from 'express';
import {initHandlers} from "./presentation/http/handlers/init-handlers";

export function createApp() {
    const app = express();
    const cors = require('cors');

    app.use(cors({ origin: "http://localhost:5173" }));
    app.use(express.json());
    initHandlers(app);

    return app;
}

export function startServer() {
    const app = createApp();
    const port = 3000;
    try {
        app.listen(port, () => console.log(`Server running on http://localhost:${port}`));
    } catch (error) {
        if (error instanceof Error) console.error(error.message);
    }
}
