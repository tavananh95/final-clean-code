import {CardNotFoundError} from "../../domain/errors/card-not-found-error";
import {CardReader} from "../ports/card-reader.port";
import {CardWriter} from "../ports/card-writer.port";

export type UpdateCardTagCommand = {
    cardId: string;
    tag?: string;
};

export class UpdateCardTagService {
    constructor(
        private readonly cardReader: CardReader,
        private readonly cardWritter: CardWriter
    ) {
    }

    async execute(command: UpdateCardTagCommand): Promise<void> {
        const card = await this.cardReader.getById(command.cardId);
        if (!card) throw new CardNotFoundError();

        card.updateTag(command.tag);
        await this.cardWritter.update(card);
    }
}
