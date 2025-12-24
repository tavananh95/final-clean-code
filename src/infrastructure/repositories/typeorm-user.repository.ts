import {UserRepositoryPort} from "../../application/ports/user-repository.port";
import {Repository} from "typeorm";
import {UserEntity} from "../typeorm/entities/user.entity";
import {User} from "../../domain/models/user";
import {UserMapper} from "../mappers/user.mapper";

export class TypeormUserRepository implements UserRepositoryPort {
    constructor(private readonly repo: Repository<UserEntity>) {}

    async findByEmail(email: string): Promise<User | null> {
        const entity = await this.repo.findOne({ where: { email } });
        return entity ? UserMapper.toDomain(entity) : null;
    }

    async save(user: User): Promise<User> {
        const entity = UserMapper.toEntity(user);
        const saved = await this.repo.save(entity);
        return UserMapper.toDomain(saved);
    }

    async findById(id: string): Promise<User | null> {
        const entity = await this.repo.findOne({ where: { id } });
        return entity ? UserMapper.toDomain(entity) : null;
    }
}