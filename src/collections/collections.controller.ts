import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { CollectionsService } from './collections.service';
import { CreateCollectionDto } from './dto/create-collection.dto';
import { User } from '../utils/decorators/user.decorator';
import { User as UserEntity } from '../users/users.entity';
import { ApiTags, ApiBearerAuth, ApiResponse, ApiOperation } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/auth.guard';


@ApiTags('collections')
@ApiBearerAuth()
@Controller('collections')
export class CollectionsController {
    constructor(private readonly collectionsService: CollectionsService) {}
  
@UseGuards(JwtAuthGuard)
    @Post("create")
    @ApiOperation({
      summary: 'Create a new data collection',
      description: `Define a new table with custom fields for your app. E.g. "Books", "Invoices", etc.`,
    })
    @ApiResponse({ status: 201, description: 'Collection created successfully' })
    @ApiResponse({ status: 400, description: 'Bad Request' })
    async create(@Body() dto: CreateCollectionDto, @User() user: UserEntity) {
      const created = await this.collectionsService.create(dto, user);
      return {
        status_code: 201,
        message: 'Collections created successfully',
        data: created,
      };
    }
}