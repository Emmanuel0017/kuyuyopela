import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
  ) {}

  async login(email: string, password: string) {
    const admin = await this.prisma.admin.findUnique({ where: { email } });
    if (!admin) throw new UnauthorizedException('Invalid credentials');

    const valid = await bcrypt.compare(password, admin.passwordHash);
    if (!valid) throw new UnauthorizedException('Invalid credentials');

    const payload = { sub: admin.id, role: admin.role };
    return {
      accessToken: this.jwt.sign(payload, { expiresIn: '15m' }),
      refreshToken: this.jwt.sign(payload, { expiresIn: '7d', secret: process.env.JWT_REFRESH_SECRET }),
      admin: { id: admin.id, email: admin.email, role: admin.role },
    };
  }

  async refresh(refreshToken: string) {
    try {
      const decoded = this.jwt.verify(refreshToken, { secret: process.env.JWT_REFRESH_SECRET });
      const payload = { sub: decoded.sub, role: decoded.role };
      return { accessToken: this.jwt.sign(payload, { expiresIn: '15m' }) };
    } catch {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }
}