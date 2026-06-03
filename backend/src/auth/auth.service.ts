import { Injectable } from '@nestjs/common';
import { createRemoteJWKSet, jwtVerify, type JWTPayload } from 'jose';

@Injectable()
export class AuthService {
  private jwks: ReturnType<typeof createRemoteJWKSet> | null = null;
  private issuer: string;
  private audience: string;

  constructor() {
    const logtoEndpoint = process.env.LOGTO_ENDPOINT || 'http://103.232.122.149:3001';
    this.issuer = `${logtoEndpoint}/oidc`;
    this.audience = process.env.LOGTO_API_RESOURCE || 'http://103.232.122.149:4000/api';

    // Create remote JWKS set — jose caches keys automatically
    this.jwks = createRemoteJWKSet(
      new URL(`${logtoEndpoint}/oidc/jwks`),
    );
  }

  async verifyToken(token: string): Promise<JWTPayload> {
    if (!this.jwks) {
      throw new Error('JWKS not initialized');
    }

    const { payload } = await jwtVerify(token, this.jwks, {
      issuer: this.issuer,
      audience: this.audience,
    });

    return payload;
  }
}
