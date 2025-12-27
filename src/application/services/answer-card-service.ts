import {CardNotFoundError} from "../../domain/errors/card-not-found-error";
import {QuizzRepository} from "../ports/quizz.repository";
import {Category} from "../../domain/models/category";
import {QuizzScheduler} from "../../domain/services/quizz-scheduler";
import {CardReader} from "../ports/card-reader.port";
import {CardWriter} from "../ports/card-writer.port";

export class AnswerCardService {
    constructor(
        private readonly cardReader: CardReader,
        private readonly cardWriter: CardWriter,
        private readonly quizzRepository: QuizzRepository
    ) {
    }

    /**
     * Executes the use case of answering a card.
     * @param cardId - The ID of the card being answered.
     * @param isValid - Whether the user answered correctly.
     */
    async execute(cardId: string, isValid: boolean): Promise<void> {
        const card = await this.cardReader.getById(cardId);

        if (!card) {
            throw new CardNotFoundError();
        }

        card.answerQuestion(isValid);
        await this.cardWriter.update(card);

        if (card.category === Category.DONE) {
            await this.quizzRepository.delete(cardId);
            return;
        }

        const quizz = QuizzScheduler.scheduleNextReview(card.id, card.category, new Date());
        await this.quizzRepository.save(quizz);
    }
}