import {
  Controller, Get, Post, Patch, Delete, Param, Body, Query,
  UseGuards, UseInterceptors, UploadedFile,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiBearerAuth, ApiConsumes, ApiOkResponse, ApiQuery } from '@nestjs/swagger';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { ProductEntity } from './entities/product.entity';
import type { MulterFile } from '../common/multer-file.type';

@ApiTags('products')
@Controller('products')
export class ProductsController {
  constructor(private productsService: ProductsService) {}

  @Get()
  @ApiQuery({ name: 'includeInactive', required: false })
  @ApiOkResponse({ type: ProductEntity, isArray: true })   
  findAll(@Query('includeInactive') includeInactive?: string) {
    return this.productsService.findAll(includeInactive === 'true');
  }

@Get(':id')
@ApiOkResponse({ type: ProductEntity })                  
findOne(@Param('id') id: string) {
  return this.productsService.findOne(id);
}

@Post()
@ApiBearerAuth()
@ApiOkResponse({ type: ProductEntity })                   
@UseGuards(AuthGuard('jwt'), RolesGuard)
@Roles('ADMIN', 'SUPER_ADMIN')
create(@Body() dto: CreateProductDto) {
  return this.productsService.create(dto);
}

@Patch(':id')
@ApiBearerAuth()
@ApiOkResponse({ type: ProductEntity })                   
@UseGuards(AuthGuard('jwt'), RolesGuard)
@Roles('ADMIN', 'SUPER_ADMIN')
update(@Param('id') id: string, @Body() dto: UpdateProductDto) {
  return this.productsService.update(id, dto);
}

@Post(':id/image')
@ApiBearerAuth()
@ApiConsumes('multipart/form-data')
@ApiOkResponse({ type: ProductEntity })
@UseGuards(AuthGuard('jwt'), RolesGuard)
@Roles('ADMIN', 'SUPER_ADMIN')
@UseInterceptors(FileInterceptor('file'))
uploadImage(@Param('id') id: string, @UploadedFile() file: MulterFile) {
  return this.productsService.uploadImage(id, file);
}

@Delete(':id')
@ApiBearerAuth()
@ApiOkResponse({ type: ProductEntity })                 
@UseGuards(AuthGuard('jwt'), RolesGuard)
@Roles('SUPER_ADMIN')
remove(@Param('id') id: string) {
  return this.productsService.remove(id);
}
}