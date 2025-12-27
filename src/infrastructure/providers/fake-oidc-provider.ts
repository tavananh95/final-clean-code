import {OidcProviderPort, OidcUserInfo} from "../../application/ports/auth/oidc-provider.port";
import {AuthProvider} from "../../domain/models/auth-provider-account";


export class FakeOidcProvider implements OidcProviderPort {
    async verifyAndGetUserInfo(_input: {
        idToken?: string;
        authorizationCode?: string;
        codeVerifier?: string;
        redirectUri?: string;
    }): Promise<OidcUserInfo> {
        // exchange idToken or authorization code with provider
        // provider's response includes id_token
        // aud in id_token should match client_id of application
        // providerUserId, email, displayName are extracted from id_token
        return {
            provider: AuthProvider.GOOGLE,
            providerUserId: 'fake-google-sub-123',
            email: 'john.doe@gmail.com',
            emailVerified: true,
            displayName: 'John Doe'
        };
    }
}

