import {Category, ORDERED_CATEGORIES} from "./category";
import {calculateLeitnerInterval} from "../services/leitner-interval-calculator";

export interface CardProps {
    id: string;
    question: string;
    answer: string;
    category: Category;
    tag?: string;
}

export class Card {
    private props: CardProps;

    constructor(props: CardProps) {
        this.props = props;
    }

    // Getters to access properties safely
    get id(): string {
        return this.props.id;
    }

    get category(): Category {
        return this.props.category;
    }

    get state(): CardProps {
        return {...this.props};
    }

    static createNew(props: {
        id: string;
        question: string;
        answer: string;
        tag?: string;
    }): Card {
        return new Card({
            id: props.id,
            question: props.question,
            answer: props.answer,
            category: Category.FIRST,
            tag: props.tag,
        });
    }

    /**
     * Updates the card category based on the user's answer validity.
     * @param isValid - true if the user answered correctly, false otherwise.
     * @param now - current date for calculating next review date.
     */
    answerQuestion(isValid: boolean, now: Date = new Date()): void {
        if (!isValid) {
            this.props.category = Category.FIRST;
        } else {
            this.promoteCategory();
        }
    }

    updateTag(tag?: string): void {
        this.props.tag = tag;
    }

    private promoteCategory(): void {
        const currentIndex = ORDERED_CATEGORIES.indexOf(this.props.category);
        if (currentIndex !== -1 && currentIndex < ORDERED_CATEGORIES.length - 1) {
            this.props.category = ORDERED_CATEGORIES[currentIndex + 1];
        }
    }
}