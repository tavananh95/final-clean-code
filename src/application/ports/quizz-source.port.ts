import {Card} from "../../domain/models/card";

export interface QuizzSource {
    getCardsToReview(date: Date): Promise<Card[]>;
}