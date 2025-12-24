import { AuthProviderAccount } from './auth-provider-account';

export class User {
    constructor(
        public readonly id: string | null,
        public email: string,
        public displayName: string | undefined,
        public isActive: boolean,
        public authAccounts: AuthProviderAccount[] = [],
        public createdAt?: Date,
        public updatedAt?: Date,
    ) {}

    static create(input: { email: string; displayName?: string }): User {
        return new User(null, input.email, input.displayName, true);
    }
}