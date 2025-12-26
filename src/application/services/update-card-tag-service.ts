import {CardRepository} from "../ports/card.repository";
import {CardNotFoundError} from "../../domain/errors/card-not-found-error";

export type UpdateCardTagCommand = {
    cardId: string;
    tag?: string;
};

export class UpdateCardTagService {
    constructor(private readonly cardRepository: CardRepository) {}

    async execute(command: UpdateCardTagCommand): Promise<void> {
        const card = await this.cardRepository.getCardById(command.cardId);
        if (!card) throw new CardNotFoundError();

        card.updateTag(command.tag);
        await this.cardRepository.updateCard(card);
    }
}
