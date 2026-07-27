import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { StoresService } from './stores.service';
import { CreateStoreDto } from './dto/create-store.dto';
import { UpdateStoreDto } from './dto/update-store.dto';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { StoreEntity } from './entities/store.entity';

@ApiTags('stores')
@Controller('stores')
export class StoresController {
  constructor(private storesService: StoresService) {}

  // public — storefront "find a stockist near you"
  @Get()
  @ApiOkResponse({ type: StoreEntity, isArray: true })
  findAll() {
    return this.storesService.findAll();
  }

  @Post()
  @ApiBearerAuth()
  @ApiOkResponse({ type: StoreEntity })
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('ADMIN', 'SUPER_ADMIN')
  create(@Body() dto: CreateStoreDto) {
    return this.storesService.create(dto);
  }

  @Patch(':id')
  @ApiBearerAuth()
  @ApiOkResponse({ type: StoreEntity })
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('ADMIN', 'SUPER_ADMIN')
  update(@Param('id') id: string, @Body() dto: UpdateStoreDto) {
    return this.storesService.update(id, dto);
  }

  @Delete(':id')
  @ApiBearerAuth()
  @ApiOkResponse({ type: StoreEntity })
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('SUPER_ADMIN')
  remove(@Param('id') id: string) {
    return this.storesService.remove(id);
  }
}