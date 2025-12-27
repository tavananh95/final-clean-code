import {Category} from "../models/category";
import {Quizz} from "../models/quizz";
import {calculateLeitnerInterval} from "./leitner-interval-calculator";

export class QuizzScheduler {
    /**
     * Calcule la prochaine date de révision et retourne l'objet Quizz prêt à être sauvegardé.
     * @param cardId - L'identifiant de la carte
     * @param category - La catégorie actuelle de la carte
     * @param now - (Optionnel) Date de référence pour le calcul (par défaut : maintenant)
     */
    static scheduleNextReview(cardId: string, category: Category, now: Date = new Date()): Quizz {
        if (category === Category.DONE) {
            throw new Error("Cannot schedule a DONE card.");
        }

        const intervalInDays = calculateLeitnerInterval(category);

        const nextReviewDate = new Date(now);
        nextReviewDate.setUTCDate(nextReviewDate.getUTCDate() + intervalInDays);

        return new Quizz(cardId, nextReviewDate);
    }
}
