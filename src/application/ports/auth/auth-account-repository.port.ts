import { AuthProviderAccount } from '../../../domain/models/auth-provider-account';
import { AuthProvider } from '../../../domain/models/auth-provider-account';

export interface AuthAccountRepositoryPort {
    findByProviderIdentity(input: {
        provider: AuthProvider;
        providerUserId: string;
    }): Promise<AuthProviderAccount | null>;
    save(account: AuthProviderAccount): Promise<AuthProviderAccount>;
}
