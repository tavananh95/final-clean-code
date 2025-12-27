
import {AuthAccountRepositoryPort} from "../../../../application/ports/auth/auth-account-repository.port";
import {AuthProvider, AuthProviderAccount} from "../../../../domain/models/auth-provider-account";

export class FakeAuthAccountRepository implements AuthAccountRepositoryPort {
    private accounts: AuthProviderAccount[] = [];

    async findByProviderIdentity(input: {
        provider: AuthProvider;
        providerUserId: string;
    }): Promise<AuthProviderAccount | null> {
        return (
            this.accounts.find(
                a =>
                    a.provider === input.provider &&
                    a.providerUserId === input.providerUserId
            ) ?? null
        );
    }

    async save(account: AuthProviderAccount): Promise<AuthProviderAccount> {
        this.accounts.push(account);
        return account;
    }
}
