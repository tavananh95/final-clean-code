import {Card} from "../../domain/models/card";

export interface CardReader {
    getById(id: string): Promise<Card | undefined>;

    findByTag(tag: string): Promise<Card[]>;
}