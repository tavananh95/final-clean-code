import { FindOrCreateUserService } from '../../src/application/services/find-or-create-user-service';
import { User } from '../../src/domain/models/user';
import { AuthProviderAccount, AuthProvider } from '../../src/domain/models/auth-provider-account';

const mockUsers = {
    findById: jest.fn(),
    findByEmail: jest.fn(),
    save: jest.fn(),
};

const mockAccounts = {
    findByProviderIdentity: jest.fn(),
    save: jest.fn(),
};

describe('FindOrCreateUserService', () => {
    let service: FindOrCreateUserService;

    beforeEach(() => {
        jest.clearAllMocks();
        service = new FindOrCreateUserService(mockUsers as any, mockAccounts as any);
    });

    it('should return user if provider account exists', async () => {
        const existingUser = User.create({ email: 'a@b.com' });
        const existingAccount = AuthProviderAccount.link({
            provider: AuthProvider.GOOGLE,
            providerUserId: 'pid',
            userId: 'uid',
        });

        mockAccounts.findByProviderIdentity.mockResolvedValue(existingAccount);
        mockUsers.findById.mockResolvedValue(existingUser);

        const user = await service.execute({
            provider: AuthProvider.GOOGLE,
            providerUserId: 'pid',
            email: 'a@b.com',
        });

        expect(user).toBe(existingUser);
        expect(mockAccounts.save).not.toHaveBeenCalled();
    });

    it('should throw error if account exists but user not found', async () => {
        const existingAccount = AuthProviderAccount.link({
            provider: AuthProvider.GOOGLE,
            providerUserId: 'pid',
            userId: 'uid',
        });
        mockAccounts.findByProviderIdentity.mockResolvedValue(existingAccount);
        mockUsers.findById.mockResolvedValue(undefined);

        await expect(
            service.execute({
                provider: AuthProvider.GOOGLE,
                providerUserId: 'pid',
                email: 'a@b.com',
            })
        ).rejects.toThrow('Inconsistent identity mapping: account linked but user not found');
    });

    it('should link account if user exists via email', async () => {
        const existingUser = User.create({ email: 'a@b.com' });

        mockAccounts.findByProviderIdentity.mockResolvedValue(undefined);
        mockUsers.findByEmail.mockResolvedValue(existingUser);
        mockAccounts.save.mockResolvedValue(undefined);

        const user = await service.execute({
            provider: AuthProvider.GOOGLE,
            providerUserId: 'pid',
            email: 'a@b.com',
        });

        expect(user).toBe(existingUser);
        expect(mockAccounts.save).toHaveBeenCalledWith(
            expect.objectContaining({
                provider: AuthProvider.GOOGLE,
                providerUserId: 'pid',
                userId: existingUser.id,
            })
        );
    });

    it('should create new user and link provider account if no user exists', async () => {
    mockAccounts.findByProviderIdentity.mockResolvedValue(undefined);
    mockUsers.findByEmail.mockResolvedValue(undefined);

    const savedUser = User.create({ email: 'new@user.com' });
    const savedUserWithId = { ...savedUser, id: 'new-id' };
    mockUsers.save.mockResolvedValue(savedUserWithId as any);
    mockAccounts.save.mockResolvedValue(undefined);

    const user = await service.execute({
        provider: AuthProvider.GOOGLE,
        providerUserId: 'pid',
        email: 'new@user.com',
    });

    expect(user).toBe(savedUserWithId);
    expect(mockUsers.save).toHaveBeenCalled();
    expect(mockAccounts.save).toHaveBeenCalledWith(
        expect.objectContaining({
            provider: AuthProvider.GOOGLE,
            providerUserId: 'pid',
            userId: 'new-id',
        })
    );
});

});
