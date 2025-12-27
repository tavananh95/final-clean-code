export class Quizz {
    constructor(
        public readonly cardId: string,
        public readonly nextReviewDate: Date,
    ) {
    }
}