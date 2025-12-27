import {Card} from "../../domain/models/card";

export interface CardWriter {
    save(card: Card): Promise<void>;

    update(card: Card): Promise<void>;
}