import { Body, Controller, Post } from '@nestjs/common';
import { SkipThrottle } from '@nestjs/throttler';
import { ApiTags, ApiOperation, ApiOkResponse } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { LoginResponseEntity, RefreshResponseEntity } from './entities/auth-response.entity';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  @ApiOperation({ summary: 'Admin login' })
  @ApiOkResponse({ type: LoginResponseEntity })
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto.email, dto.password);
  }

  @Post('refresh')
  @SkipThrottle() // refreshes are frequent, don't penalise
  @ApiOperation({ summary: 'Refresh access token' })
  @ApiOkResponse({ type: RefreshResponseEntity })
  refresh(@Body('refreshToken') refreshToken: string) {
    return this.authService.refresh(refreshToken);
  }
}