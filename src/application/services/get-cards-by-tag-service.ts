import {Card} from "../../domain/models/card";
import {CardRepository} from "../ports/card.repository";

export class GetCardsByTagService {
    constructor(private readonly cardRepository: CardRepository) {}

    async execute(tags?: string[]): Promise<Card[]> {
        return this.cardRepository.findByTags(tags);
    }
}
