import { ApiProperty } from '@nestjs/swagger';

export class SettingsEntity {
  @ApiProperty() id!: string;
  @ApiProperty() siteName!: string;
  @ApiProperty() supportPhone!: string;
  @ApiProperty() supportEmail!: string;
  @ApiProperty() whatsappNumber!: string;
  @ApiProperty({ required: false, nullable: true, type: String }) aboutImageUrl?: string | null;
  @ApiProperty() updatedAt!: Date;
}