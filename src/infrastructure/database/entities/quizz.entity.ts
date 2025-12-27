import {Column, Entity, PrimaryGeneratedColumn} from "typeorm";

@Entity({name: 'quizz'})
export class QuizzEntity {
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @Column({type: 'uuid'})
    cardId!: string;

    @Column({type: 'timestamp'})
    nextReviewDate?: Date;
}