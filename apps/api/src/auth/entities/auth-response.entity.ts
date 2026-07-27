import { ApiProperty } from '@nestjs/swagger';

class AdminSummary {
  @ApiProperty() id!: string;
  @ApiProperty() email!: string;
  @ApiProperty() role!: string;
}

export class LoginResponseEntity {
  @ApiProperty() accessToken!: string;
  @ApiProperty() refreshToken!: string;
  @ApiProperty({ type: AdminSummary }) admin!: AdminSummary;
}

export class RefreshResponseEntity {
  @ApiProperty() accessToken!: string;
}