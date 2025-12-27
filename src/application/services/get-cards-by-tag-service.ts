import {Card} from "../../domain/models/card";
import {CardReader} from "../ports/card-reader.port";

export class GetCardsByTagService {
    constructor(private readonly cardReader: CardReader) {
    }

    async execute(tag: string): Promise<Card[]> {
        return this.cardReader.findByTag(tag);
    }
}
