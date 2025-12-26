import { OidcProviderPort, OidcUserInfo } from '../../src/application/ports/auth/oidc-provider.port';
import { TokenServicePort } from '../../src/application/ports/token-service.port';
import { AuthProvider } from '../../src/domain/models/auth-provider-account';
import { User } from '../../src/domain/models/user';
import {FindOrCreateUserService} from "../../src/application/services/find-or-create-user-service";
import {AuthenticateService} from "../../src/application/services/auth/authenticate-service";

const mockOidc = {
    verifyAndGetUserInfo: jest.fn(),
} as unknown as OidcProviderPort;

const mockFindOrCreate = {
    execute: jest.fn(),
} as unknown as FindOrCreateUserService;

const mockTokens = {
    issueAccessToken: jest.fn(),
} as unknown as TokenServicePort;

describe('AuthenticateService', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should verify OIDC using authorization code, find or create user, then issue an access token', async () => {
        // ARRANGE
        const service = new AuthenticateService(mockOidc, mockFindOrCreate, mockTokens);

        // 
        const claims: OidcUserInfo = {
            provider: AuthProvider.GOOGLE,
            providerUserId: 'fake-google-sub-123',
            email: 'john.doe@gmail.com',
            emailVerified: true,
            displayName: 'John Doe',
        };

        const user = new User(
            'user-123',
            'john.doe@gmail.com',
            'John Doe',
            true,
            [],
        );

        (mockOidc.verifyAndGetUserInfo as jest.Mock).mockResolvedValue(claims);
        (mockFindOrCreate.execute as jest.Mock).mockResolvedValue(user);
        (mockTokens.issueAccessToken as jest.Mock).mockResolvedValue('jwt-token');

        // ACT
        const result = await service.execute({
            authorizationCode: 'auth-code',
            codeVerifier: 'verifier',
            redirectUri: 'http://localhost:3000/auth/callback',
        });

        // ASSERT
        expect(mockOidc.verifyAndGetUserInfo).toHaveBeenCalledWith({
            idToken: undefined,
            authorizationCode: 'auth-code',
            codeVerifier: 'verifier',
            redirectUri: 'http://localhost:3000/auth/callback',
        });

        expect(mockFindOrCreate.execute).toHaveBeenCalledWith({
            provider: AuthProvider.GOOGLE,
            providerUserId: 'fake-google-sub-123',
            email: 'john.doe@gmail.com',
            displayName: 'John Doe',
        });

        expect(mockTokens.issueAccessToken).toHaveBeenCalledWith({ userId: 'user-123' });

        expect(result).toEqual({ accessToken: 'jwt-token', userId: 'user-123' });
    });

    it('should throw if user is disabled and should not issue a token', async () => {
        // ARRANGE
        const service = new AuthenticateService(mockOidc, mockFindOrCreate, mockTokens);

        const claims: OidcUserInfo = {
            provider: AuthProvider.GOOGLE,
            providerUserId: 'sub',
            email: 'x@y.com',
            displayName: 'X',
        };

        const disabledUser = new User(
            'user-disabled',
            'x@y.com',
            'X',
            false,
            [],
        );

        (mockOidc.verifyAndGetUserInfo as jest.Mock).mockResolvedValue(claims);
        (mockFindOrCreate.execute as jest.Mock).mockResolvedValue(disabledUser);

        // ACT & ASSERT
        await expect(
            service.execute({ idToken: 'some-id-token' })
        ).rejects.toThrow('User is disabled');

        expect(mockTokens.issueAccessToken).not.toHaveBeenCalled();
    });

    it('should propagate error if OIDC verification fails', async () => {
        // ARRANGE
        const service = new AuthenticateService(mockOidc, mockFindOrCreate, mockTokens);

        (mockOidc.verifyAndGetUserInfo as jest.Mock).mockRejectedValue(
            new Error('Invalid token')
        );

        // ACT & ASSERT
        await expect(
            service.execute({ idToken: 'bad-token' })
        ).rejects.toThrow('Invalid token');

        expect(mockFindOrCreate.execute).not.toHaveBeenCalled();
        expect(mockTokens.issueAccessToken).not.toHaveBeenCalled();
    });


});
