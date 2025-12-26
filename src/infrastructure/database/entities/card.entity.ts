import {Entity, PrimaryGeneratedColumn, Column} from 'typeorm';

@Entity({name: 'cards'})
export class CardEntity {
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @Column()
    question!: string;

    @Column()
    answer!: string;

    @Column()
    category!: string;

    @Column({nullable: true})
    tag?: string;

    @Column({type: 'timestamp', nullable: true})
    nextReviewDate?: Date;
}