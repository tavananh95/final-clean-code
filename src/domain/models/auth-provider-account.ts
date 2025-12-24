import { User } from './user';

export enum AuthProvider {
    GOOGLE = 'GOOGLE',
    GITHUB = 'GITHUB',
    MICROSOFT = 'MICROSOFT',
}


export class AuthProviderAccount {
    constructor(
        public readonly id: string | null,
        public readonly provider: AuthProvider,
        public readonly providerUserId: string,
        public readonly userId: string,
        public readonly linkedAt?: Date,
    ) {}

    static link(input: {
        provider: AuthProvider;
        providerUserId: string;
        userId: string;
    }): AuthProviderAccount {
        return new AuthProviderAccount(
            null,
            input.provider,
            input.providerUserId,
            input.userId,
            undefined,
        );
    }
}

