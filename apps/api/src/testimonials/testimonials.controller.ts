import {
  Body, Controller, Delete, Get, Param, Patch, Post,
  UploadedFile, UseGuards, UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiConsumes, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { TestimonialsService } from './testimonials.service';
import { CreateTestimonialDto } from './dto/create-testimonial.dto';
import { UpdateTestimonialDto } from './dto/update-testimonial.dto';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { TestimonialEntity } from './entities/testimonial.entity';
import type { MulterFile } from '../common/multer-file.type';

@ApiTags('testimonials')
@Controller('testimonials')
export class TestimonialsController {
  constructor(private testimonialsService: TestimonialsService) {}

  @Get()
  @ApiOkResponse({ type: TestimonialEntity, isArray: true })
  findAll() {
    return this.testimonialsService.findAll();
  }

  @Post()
  @ApiBearerAuth()
  @ApiOkResponse({ type: TestimonialEntity })
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('ADMIN', 'SUPER_ADMIN')
  create(@Body() dto: CreateTestimonialDto) {
    return this.testimonialsService.create(dto);
  }

  @Patch(':id')
  @ApiBearerAuth()
  @ApiOkResponse({ type: TestimonialEntity })
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('ADMIN', 'SUPER_ADMIN')
  update(@Param('id') id: string, @Body() dto: UpdateTestimonialDto) {
    return this.testimonialsService.update(id, dto);
  }

  @Post(':id/before-image')
  @ApiBearerAuth()
  @ApiConsumes('multipart/form-data')
  @ApiOkResponse({ type: TestimonialEntity })
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('ADMIN', 'SUPER_ADMIN')
  @UseInterceptors(FileInterceptor('file'))
  uploadBeforeImage(@Param('id') id: string, @UploadedFile() file: MulterFile) {
    return this.testimonialsService.uploadBeforeImage(id, file);
  }

  @Post(':id/after-image')
  @ApiBearerAuth()
  @ApiConsumes('multipart/form-data')
  @ApiOkResponse({ type: TestimonialEntity })
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('ADMIN', 'SUPER_ADMIN')
  @UseInterceptors(FileInterceptor('file'))
  uploadAfterImage(@Param('id') id: string, @UploadedFile() file: MulterFile) {
    return this.testimonialsService.uploadAfterImage(id, file);
  }

  @Delete(':id')
  @ApiBearerAuth()
  @ApiOkResponse({ type: TestimonialEntity })
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('SUPER_ADMIN')
  remove(@Param('id') id: string) {
    return this.testimonialsService.remove(id);
  }
}