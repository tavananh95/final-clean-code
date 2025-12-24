import { AuthProviderAccountEntity } from '../typeorm/entities/auth-provider-account.entity';
import { UserEntity } from '../typeorm/entities/user.entity';

import {
    AuthProviderAccount as AuthProviderAccountDomain,
    AuthProvider as AuthProviderDomain,
} from '../../domain/models/auth-provider-account';

import { AuthProvider as AuthProviderEntity } from '../typeorm/entities/auth-provider-account.entity';

export class AuthProviderAccountMapper {
    static toDomain(entity: AuthProviderAccountEntity): AuthProviderAccountDomain {
        const userId = entity.user?.id;
        if (!userId) {
            throw new Error('AuthProviderAccountEntity.user is not loaded (missing userId).');
        }

        return new AuthProviderAccountDomain(
            entity.id,
            entity.provider as unknown as AuthProviderDomain,
            entity.providerUserId,
            userId,
            entity.linkedAt,
        );
    }

    static toEntity(
        domain: AuthProviderAccountDomain,
        userEntity: UserEntity,
    ): AuthProviderAccountEntity {
        const entity = new AuthProviderAccountEntity();

        if (domain.id) entity.id = domain.id;

        entity.provider = domain.provider as unknown as AuthProviderEntity;
        entity.providerUserId = domain.providerUserId;
        entity.user = userEntity;

        return entity;
    }
}
