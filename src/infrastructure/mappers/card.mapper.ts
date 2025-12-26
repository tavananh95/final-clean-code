import {CardEntity} from "../database/entities/card.entity";
import {Card} from "../../domain/models/card";
import {Category} from "../../domain/models/category";


export class CardMapper {
    /**
     * Converts a DB Entity to a Domain Entity.
     */
    static toDomain(entity: CardEntity): Card {
        return new Card({
            id: entity.id,
            question: entity.question,
            answer: entity.answer,
            category: entity.category as Category, // Cast string to Enum
            tag: entity.tag,
            nextReviewDate: entity.nextReviewDate
        });
    }

    /**
     * Converts a Domain Entity to a DB Entity (Partial for updates).
     */
    static toPersistence(domain: Card): Partial<CardEntity> {
        return {
            id: domain.id,
            question: domain.state.question,
            answer: domain.state.answer,
            category: domain.state.category,
            tag: domain.state.tag,
            nextReviewDate: domain.state.nextReviewDate
        };
    }
}