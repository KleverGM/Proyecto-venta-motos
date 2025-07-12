import {
  Controller,
  Post,
  Body,
  UnauthorizedException,
  ConflictException,
  UseGuards,
  Req,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterUserDto } from './dto/register-user.dto';
import { SuccessResponseDto } from '../common/dto/response.dto';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('Authentication') // Swagger Tag
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    try {
      const result = await this.authService.login(loginDto);
      return new SuccessResponseDto('Login successful', result);
    } catch (error) {
      throw new UnauthorizedException('Invalid credentials');
    }
  }

  @Post('register')
  async register(@Body() registerDto: RegisterUserDto) {
    try {
      const result = await this.authService.register(registerDto);
      return new SuccessResponseDto('Registration successful', result);
    } catch (error) {
      if (error instanceof ConflictException) {
        throw new ConflictException(error.message);
      }
      throw new UnauthorizedException('Registration failed');
    }
  }

  // Nuevo endpoint para renovación de token
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @Post('refresh-token')
  async refreshToken(@Req() req: any) {
    try {
      const user = req.user;
      const payload = { 
        email: user.email, 
        sub: user.id,
        role: user.role
      };
      
      const newToken = this.authService.createJwtPayload(user);
      return new SuccessResponseDto('Token refreshed', {
        access_token: newToken
      });
    } catch (error) {
      throw new UnauthorizedException('Token refresh failed');
    }
  }
}