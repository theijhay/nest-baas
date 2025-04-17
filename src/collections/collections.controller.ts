import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { CollectionsService } from './collections.service';
import { CreateCollectionDto } from './dto/create-collection.dto';
import { User } from '../utils/decorators/user.decorator';
import { User as UserEntity } from '../users/users.entity';
import { ApiTags, ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/auth.guard';


@ApiTags('collections')
@ApiBearerAuth()
@Controller('collections')
export class CollectionsController {
    constructor(private readonly collectionsService: CollectionsService) {}
  
@UseGuards(JwtAuthGuard)
    @Post("create")
    async create(@Body() dto: CreateCollectionDto, @User() user: UserEntity) {
      const created = await this.collectionsService.create(dto, user);
      return {
        status_code: 201,
        message: 'Collections created successfully',
        data: created,
      };
    }
}