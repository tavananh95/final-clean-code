import { Request, Response } from 'express';
import {AuthenticateService} from "../../../../application/services/auth/authenticate-service";

export class AuthenticateHandler {
    constructor(private readonly authenticate: AuthenticateService) {}

    /**
     * POST /auth/provider
     * Body can contain either:
     * - { idToken }
     * OR
     * - { authorizationCode, codeVerifier, redirectUri }
     */
    handle = async (req: Request, res: Response) => {
        try {
            const { idToken, authorizationCode, codeVerifier, redirectUri } = req.body ?? {};

            const hasIdToken = typeof idToken === 'string' && idToken.length > 0;
            const hasAuthCode = typeof authorizationCode === 'string' && authorizationCode.length > 0;

            if (!hasIdToken && !hasAuthCode) {
                return res.status(400).json({
                    message: 'Provide either idToken or authorizationCode.',
                });
            }

            if (hasAuthCode && typeof redirectUri !== 'string') {
                return res.status(400).json({
                    message: 'redirectUri is required for authorizationCode flow.',
                });
            }

            const result = await this.authenticate.execute({
                idToken: hasIdToken ? idToken : undefined,
                authorizationCode: hasAuthCode ? authorizationCode : undefined,
                codeVerifier: typeof codeVerifier === 'string' ? codeVerifier : undefined,
                redirectUri: typeof redirectUri === 'string' ? redirectUri : undefined,
            });

            return res.status(200).json(result); // { accessToken, userId }
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Unexpected error';

            const status = message.toLowerCase().includes('token') ||
            message.toLowerCase().includes('auth') ||
            message.toLowerCase().includes('disabled')
                ? 401
                : 500;

            return res.status(status).json({ message });
        }
    };
}
