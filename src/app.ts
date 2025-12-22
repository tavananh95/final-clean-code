import express, { type Request, type Response } from 'express';

const app = async () => {
    const app = express();
    const port = 3000;
    const cors = require('cors');

    app.use(cors({
        origin: "http://localhost:5173"
    }));
    app.use(express.json());
    // initHandlers(app);

    try {
        console.log("Connecting to the database ...");
        // await AppDataSource.initialize();
        console.log("Database connected successfully !");

        app.listen(port, () => {
            console.log(`Server running on http://localhost:${port}`);
            // swaggerDocs(app, port);
        });
    } catch (error) {
        if (error instanceof Error) {
            console.error(error.message);
        }
    }
}

app();
