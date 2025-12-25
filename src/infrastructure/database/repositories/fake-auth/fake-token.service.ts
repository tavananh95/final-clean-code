// infrastructure/fakes/jwt-token.service.ts
import jwt from 'jsonwebtoken';
import {TokenServicePort} from "../../../../application/ports/token-service.port";

export class JwtTokenService implements TokenServicePort {
    private readonly secret = 'dev-secret-key';
    private readonly expiresIn = '1h';

    async issueAccessToken(payload: { userId: string }): Promise<string> {
        return jwt.sign(
            {
                sub: payload.userId,
                type: 'access',
            },
            this.secret,
            {
                expiresIn: this.expiresIn,
                issuer: 'clean-code-app',
                audience: 'clean-code-users',
            }
        );
    }
}
