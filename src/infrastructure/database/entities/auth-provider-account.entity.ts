import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    Index,
    CreateDateColumn,
} from 'typeorm';
import { UserEntity } from './user.entity';
import {AuthProvider} from "../../../domain/models/auth-provider-account";


@Entity({ name: 'auth_provider_accounts' })
@Index(['provider', 'providerUserId'], { unique: true })
export class AuthProviderAccountEntity {

    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @Column({ type: 'enum', enum: AuthProvider })
    provider!: AuthProvider;

    @Column()
    providerUserId!: string;

    @ManyToOne(
        () => UserEntity,
        (user) => user.authAccounts,
        { onDelete: 'CASCADE' }
    )
    user!: UserEntity;

    @CreateDateColumn()
    linkedAt!: Date;
}
