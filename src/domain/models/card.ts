import {Category} from "./category";

export interface CardProps {
    id: string;
    question: string;
    answer: string;
    category: Category;
    tag?: string;
}

const CATEGORY_FLOW = [
    Category.FIRST,
    Category.SECOND,
    Category.THIRD,
    Category.FOURTH,
    Category.FIFTH,
    Category.SIXTH,
    Category.SEVENTH,
    Category.DONE,
];

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

    // Helper to expose the full state (useful for mappers)
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
            tag: props.tag
        });
    }

    /**
     * Updates the card category based on the user's answer validity.
     * @param isValid - true if the user answered correctly, false otherwise.
     */
    answerQuestion(isValid: boolean): void {
        if (!isValid) {
            this.props.category = Category.FIRST;
        } else {
            this.promoteCategory();
        }
    }

    private promoteCategory(): void {
        const currentIndex = CATEGORY_FLOW.indexOf(this.props.category);
        if (currentIndex !== -1 && currentIndex < CATEGORY_FLOW.length - 1) {
            this.props.category = CATEGORY_FLOW[currentIndex + 1];
        }
    }


}