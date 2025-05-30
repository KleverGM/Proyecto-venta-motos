import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

interface JwtPayload {
  id: string;
  email: string;
  iat?: number;
  exp?: number;
}

interface ValidatedUser {
  id: string;
  email: string;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET,
    });
  }

  async validate(payload: JwtPayload): Promise<ValidatedUser> {
    // Verificamos que las propiedades existan
    if (!payload.id || !payload.email) {
      throw new Error('Token inválido');
    }

    // Retornamos un objeto con tipos seguros
    const validatedUser: ValidatedUser = {
      id: payload.id,
      email: payload.email
    };

    return validatedUser;
  }
}