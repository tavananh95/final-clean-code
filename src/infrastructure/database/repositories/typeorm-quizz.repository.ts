import {DataSource, Repository} from 'typeorm';
import {QuizzRepository} from '../../../application/ports/quizz.repository';
import {QuizzEntity} from '../entities/quizz.entity'; //
import {Quizz} from '../../../domain/models/quizz';
import {QuizzMapper} from "../../mappers/Quizz.mapper";

export class TypeOrmQuizzRepository implements QuizzRepository {
    private repo: Repository<QuizzEntity>;

    constructor(dataSource: DataSource) {
        this.repo = dataSource.getRepository(QuizzEntity);
    }

    async save(quizz: Quizz): Promise<void> {
        await this.repo.upsert(
            QuizzMapper.toPersistence(quizz),
            ['cardId']
        );
    }

    async delete(cardId: string): Promise<void> {
        await this.repo.delete({cardId});
    }
}