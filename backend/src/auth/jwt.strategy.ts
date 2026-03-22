import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || 'fallback-dev-secret-ficaqui', 
    });
  }

  async validate(payload: any) {
    if (!payload.sub) throw new UnauthorizedException();
    
    return { 
      id: payload.sub, 
      email: payload.email, 
      role: payload.role,
      centrocoinsBalance: payload.centrocoinsBalance 
    };
  }
}
