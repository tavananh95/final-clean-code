import {Card} from "../../domain/models/card";
import {QuizzSource} from "../ports/quizz-source.port";

export class GetQuizzCardsService {
    constructor(private readonly quizzSource: QuizzSource) {
    }

    async execute(date: Date): Promise<Card[]> {
        return this.quizzSource.getCardsToReview(date);
    }
}