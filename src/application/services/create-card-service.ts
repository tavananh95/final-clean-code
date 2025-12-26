import { CardRepository } from "../ports/card.repository";
import { Card } from "../../domain/models/card";
import { randomUUID } from "crypto";

export interface CreateCardCommand {
    question: string;
    answer: string;
    tag?: string;
}

export class CreateCardService {
    constructor(private readonly cardRepository: CardRepository) {}

    async execute(command: CreateCardCommand): Promise<Card> {
        const card = Card.createNew({
            id: randomUUID(),
            question: command.question,
            answer: command.answer,
            tag: command.tag
        });

        await this.cardRepository.createCard(card);
        return card;
    }
}
