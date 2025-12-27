import {Card} from "../../domain/models/card";
import {randomUUID} from "crypto";
import {QuizzRepository} from "../ports/quizz.repository";
import {QuizzScheduler} from "../../domain/services/quizz-scheduler";
import {CardWriter} from "../ports/card-writer.port";
import {Quizz} from "../../domain/models/quizz";

export interface CreateCardCommand {
    question: string;
    answer: string;
    tag?: string;
}

export class CreateCardService {
    constructor(
        private readonly cardWritter: CardWriter,
        private readonly quizzRepository: QuizzRepository
    ) {
    }

    async execute(command: CreateCardCommand): Promise<Card> {
        const card = Card.createNew({
            id: randomUUID(),
            question: command.question,
            answer: command.answer,
            tag: command.tag
        });

        await this.cardWritter.save(card);
        const quizz = new Quizz(card.id, new Date());

        await this.quizzRepository.save(quizz);
        return card;
    }
}
