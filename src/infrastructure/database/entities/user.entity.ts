import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    OneToMany,
    CreateDateColumn,
    UpdateDateColumn,
} from 'typeorm';
import { AuthProviderAccountEntity } from './auth-provider-account.entity';
import {User} from "../../../domain/models/user";

@Entity({ name: 'users' })
export class UserEntity {

    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @Column({ unique: true })
    email!: string;

    @Column({ nullable: true })
    displayName?: string;

    @Column({ default: true })
    isActive!: boolean;

    @OneToMany(
        () => AuthProviderAccountEntity,
        (account) => account.user,
        { cascade: true }
    )
    authAccounts!: AuthProviderAccountEntity[];

    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    updatedAt!: Date;

    static create(input: { email: string; displayName?: string }): User {
        return new User(null, input.email, input.displayName, true);
    }
}
