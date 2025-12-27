import {Quizz} from "../../domain/models/quizz";


export interface QuizzRepository {
    save(quizz: Quizz): Promise<void>;

    delete(quizzId: string): Promise<void>; // When card is DONE
}