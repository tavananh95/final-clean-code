export interface TokenServicePort {
    issueAccessToken(payload: { userId: string }): Promise<string>;
}
