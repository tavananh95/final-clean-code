// infrastructure/mappers/user.mapper.ts
import { User } from '../../domain/models/user';
import { UserEntity } from '../typeorm/entities/user.entity';
import {AuthProviderAccountMapper} from "./auth-provider-account.mapper";

export class UserMapper {
    static toDomain(entity: UserEntity): User {
        return new User(
            entity.id,
            entity.email,
            entity.displayName,
            entity.isActive,
            entity.authAccounts?.map(AuthProviderAccountMapper.toDomain) ?? [],
            entity.createdAt,
            entity.updatedAt,
        );
    }

    static toEntity(domain: User): UserEntity {
        const entity = new UserEntity();
        entity.id = domain.id!;
        entity.email = domain.email;
        entity.displayName = domain.displayName;
        return entity;
    }
}
