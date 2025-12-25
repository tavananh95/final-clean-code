import {AuthProvider} from "../../../domain/models/auth-provider-account";

export type OidcUserInfo = {
    provider: AuthProvider;
    providerUserId: string;
    email: string;
    emailVerified?: boolean;
    displayName?: string;
};

export interface OidcProviderPort {
    verifyAndGetUserInfo(input: {
        idToken?: string;
        authorizationCode?: string;
        codeVerifier?: string;
        redirectUri?: string;
    }): Promise<OidcUserInfo>;
}
