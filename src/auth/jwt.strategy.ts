import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';

interface JwtPayload {
  sub: string; // ID del usuario (estándar JWT)
  email: string;
  role: string;
  iat?: number;
  exp?: number;
}

interface ValidatedUser {
  id: string;
  email: string;
  role: string;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get('JWT_SECRET'), // Usar ConfigService
      issuer: 'venta-motos-api', // Validar issuer
      audience: 'venta-motos-app', // Validar audience
    });
  }

  async validate(payload: JwtPayload): Promise<ValidatedUser> {
    // Verificación de campos esenciales
    if (!payload.sub || !payload.email || !payload.role) {
      throw new UnauthorizedException('Token inválido: Faltan campos esenciales');
    }

    // Validación de roles
    if (!['admin', 'customer'].includes(payload.role)) {
      throw new UnauthorizedException('Rol de usuario inválido');
    }

    return {
      id: payload.sub, // Usar sub como ID de usuario
      email: payload.email,
      role: payload.role
    };
  }
}