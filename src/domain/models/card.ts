import {Category} from "./category";

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
            tag: props.tag
        });
    }

    // Getters to access properties safely
    get id(): string {
        return this.props.id;
    }

    get category(): Category {
        return this.props.category;
    }

    // Helper to expose the full state (useful for mappers)
    get state(): CardProps {
        return { ...this.props };
    }

    /**
     * Updates the card category based on the user's answer validity.
     * @param isValid - true if the user answered correctly, false otherwise.
     */
    answerQuestion(isValid: boolean): void {
        if (!isValid) {
            this.props.category = Category.FIRST;
        }
        // TODO: Handle the 'isValid === true' case in a future User Story
    }
}