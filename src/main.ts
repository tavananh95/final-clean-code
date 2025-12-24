import {initDatabase} from "./infrastructure/database/init";
import {createApp} from "./app";

async function bootstrap() {
    await initDatabase();

    const app = createApp();
    const port = 3000;

    app.listen(port, () => {
        console.log(`Server running on port ${port}`);
    });
}

bootstrap();