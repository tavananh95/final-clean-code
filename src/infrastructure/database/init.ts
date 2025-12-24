import {AppDataSource} from "./data-source";

export async function initDatabase(): Promise<void> {
    try {
        await AppDataSource.initialize();
        console.log("Database connected");
    } catch (error) {
        console.error("Database connection failed");
        throw error;
    }
}