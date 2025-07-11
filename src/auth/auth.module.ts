import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './jwt.strategy';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { CustomersModule } from '../customers/customers.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    CustomersModule,
    
    // Configuración CORREGIDA de PassportModule
    PassportModule.register({ 
      defaultStrategy: 'jwt',
      session: false, // Recomendado para APIs REST
      property: 'user' // Cambia esto si necesitas otro nombre en request
    }),
    
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (config: ConfigService) => ({
        secret: config.get('JWT_SECRET'),
        signOptions: { 
          expiresIn: config.get('JWT_EXPIRES_IN', '1h'),
          issuer: 'venta-motos-api',
          audience: 'venta-motos-app'
        },
      }),
      inject: [ConfigService],
    }),
    
    ConfigModule,
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    JwtStrategy,
  ],
  exports: [
    // EXPORTAR LA CONFIGURACIÓN COMPLETA
    PassportModule, // Exporta el módulo configurado
    JwtModule,      // Exporta el módulo JWT configurado
    JwtStrategy,    // Estrategia de autenticación
    AuthService,    // Servicio de autenticación
    TypeOrmModule.forFeature([User]), // Repositorio de usuarios
  ],
})
export class AuthModule {}