import { User } from '../../domain/models/user';
import { AuthProviderAccount, AuthProvider } from '../../domain/models/auth-provider-account';
import { UserRepositoryPort } from '../ports/user-repository.port';
import { AuthAccountRepositoryPort } from '../ports/auth-account-repository.port';

export class FindOrCreateUserService {
    constructor(
        private readonly users: UserRepositoryPort,
        private readonly accounts: AuthAccountRepositoryPort,
    ) {}

    async execute(input: {
        provider: AuthProvider;
        providerUserId: string;
        email: string;
        displayName?: string;
    }): Promise<User> {
        // 1) Strongest key: provider identity
        const existingAccount = await this.accounts.findByProviderIdentity({
            provider: input.provider,
            providerUserId: input.providerUserId,
        });

        if (existingAccount) {
            const user = await this.users.findById(existingAccount.userId);
            if (user) return user;
            throw new Error('Inconsistent identity mapping: account linked but user not found');
        }

        // 2) Fallback: user by email (careful)
        const existingUser = await this.users.findByEmail(input.email);

        if (existingUser) {
            const account = AuthProviderAccount.link({
                provider: input.provider,
                providerUserId: input.providerUserId,
                userId: existingUser.id!,
            });
            await this.accounts.save(account);
            return existingUser;
        }

        // 3) Create user + link provider account
        const newUser = User.create({ email: input.email, displayName: input.displayName });
        const savedUser = await this.users.save(newUser);

        const newAccount = AuthProviderAccount.link({
            provider: input.provider,
            providerUserId: input.providerUserId,
            userId: savedUser.id!,
        });
        await this.accounts.save(newAccount);

        return savedUser;
    }
}
