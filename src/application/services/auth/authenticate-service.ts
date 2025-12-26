import { TokenServicePort } from '../../ports/token-service.port';
import {OidcProviderPort} from "../../ports/auth/oidc-provider.port";
import {FindOrCreateUserService} from "../find-or-create-user-service";

export class AuthenticateService {
    constructor(
        private readonly oidc: OidcProviderPort,
        private readonly findOrCreateUser: FindOrCreateUserService,
        private readonly tokens: TokenServicePort,
    ) {}

    async execute(input: {
        idToken?: string;
        authorizationCode?: string;
        codeVerifier?: string;
        redirectUri?: string;
    }): Promise<{ accessToken: string; userId: string }> {
        // 1) Verify identity with provider (Google OIDC, etc.)
        const claims = await this.oidc.verifyAndGetUserInfo({
            idToken: input.idToken,
            authorizationCode: input.authorizationCode,
            codeVerifier: input.codeVerifier,
            redirectUri: input.redirectUri,
        });

        // 2) Find or create internal user
        const user = await this.findOrCreateUser.execute({
            provider: claims.provider,
            providerUserId: claims.providerUserId,
            email: claims.email,
            displayName: claims.displayName,
        });

        if (!user.isActive) {
            throw new Error('User is disabled');
        }

        // 3) Issue app token (login)
        const accessToken = await this.tokens.issueAccessToken({ userId: user.id! });

        return { accessToken, userId: user.id! };
    }
}
