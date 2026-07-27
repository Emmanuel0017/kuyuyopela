import {
  Body, Controller, Get, Patch, Post, UploadedFile, UseGuards, UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiConsumes, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { SettingsService } from './settings.service';
import { UpdateSettingsDto } from './dto/update-settings.dto';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { SettingsEntity } from './entities/setting.entity';
import type { MulterFile } from '../common/multer-file.type';

@ApiTags('settings')
@Controller('settings')
export class SettingsController {
  constructor(private settingsService: SettingsService) {}

  @Get()
  @ApiOkResponse({ type: SettingsEntity })
  get() {
    return this.settingsService.get();
  }

  @Patch()
  @ApiBearerAuth()
  @ApiOkResponse({ type: SettingsEntity })
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('SUPER_ADMIN')
  update(@Body() dto: UpdateSettingsDto) {
    return this.settingsService.update(dto);
  }

  @Post('about-image')
  @ApiBearerAuth()
  @ApiConsumes('multipart/form-data')
  @ApiOkResponse({ type: SettingsEntity })
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('SUPER_ADMIN')
  @UseInterceptors(FileInterceptor('file'))
  uploadAboutImage(@UploadedFile() file: MulterFile) {
    return this.settingsService.uploadAboutImage(file);
  }
}