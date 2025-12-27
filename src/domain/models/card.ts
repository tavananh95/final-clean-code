import {Category, ORDERED_CATEGORIES} from "./category";
import {calculateLeitnerInterval} from "../services/leitner-interval-calculator";

export interface CardProps {
    id: string;
    question: string;
    answer: string;
    category: Category;
    tag?: string;
    nextReviewDate?: Date;
    lastQuizzDate?: Date;
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

    get nextReviewDate(): Date | undefined {
        return this.props.nextReviewDate;
    }

    get state(): CardProps {
        return {...this.props};
    }

    get lastQuizzDate(): Date | undefined {
        return this.props.lastQuizzDate;
    }

    setLastQuizzDate(date: Date) {
        this.props.lastQuizzDate = date;
    }

    static createNew(props: {
        id: string;
        question: string;
        answer: string;
        tag?: string;
    }): Card {
        if (!props.question || props.question.trim() === '') {
            throw new Error('Question is required');
        }

        if (!props.answer || props.answer.trim() === '') {
            throw new Error('Answer is required');
        }
        return new Card({
            id: props.id,
            question: props.question,
            answer: props.answer,
            category: Category.FIRST,
            tag: props.tag,
            nextReviewDate: undefined,
            lastQuizzDate: undefined
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
        if (this.props.category === Category.DONE) {
            this.props.nextReviewDate = undefined;
            return;
        }

        const intervalInDays = calculateLeitnerInterval(this.props.category);
        const nextDate = new Date(now);
        nextDate.setDate(nextDate.getDate() + intervalInDays);
        console.log("nextDate")
        console.log(nextDate)
        this.props.nextReviewDate = nextDate;
    }
    private promoteCategory(): void {
        const currentIndex = ORDERED_CATEGORIES.indexOf(this.props.category);
        if (currentIndex !== -1 && currentIndex < ORDERED_CATEGORIES.length - 1) {
            this.props.category = ORDERED_CATEGORIES[currentIndex + 1];
        }
    }
    updateTag(tag?: string): void {
        this.props.tag = tag;
    }
}