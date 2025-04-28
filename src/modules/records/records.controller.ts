import {
    Controller,
    Post,
    Body,
    UseGuards,
    Param,
    Get,
    Patch,
    Delete,
  } from '@nestjs/common';
  import { RecordsService } from './records.service';
  import { CreateRecordDto } from './dto/create-record.dto';
  import { AuthGuard } from '../../guards/auth.guard';
  import { User } from '../../utils/decorators/user.decorator';
  import { User as UserEntity } from '../../entities/users.entity';
  import { 
    ApiTags, 
    ApiBearerAuth, 
    ApiResponse, ApiOperation  } from '@nestjs/swagger';
  import { UpdateRecordDto } from './dto/update-record.dto';
  
  @ApiTags('records')
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Controller('api/user/records/')
  export class RecordsController {
    constructor(private readonly recordsService: RecordsService) {}
  
    @Post(':collection')
    @ApiOperation({
      summary: 'Create a new data collection',
      description: `create a new record in a specified collection`,
    })
    @ApiOperation({ summary: 'Create a new record in a collection' })
    @ApiResponse({ status: 201, description: 'Collection created successfully' })
    async create(
      @Param('collection') collection: string,
      @Body() dto: CreateRecordDto,
      @User() user: UserEntity,
    ) {
      const created = await this.recordsService.create(collection, dto, user);
      return {
        status_code: 201,
        message: 'Record created successfully',
        data: created,
      };
    }
    
    @Get(':collection')
    @ApiOperation({ summary: 'Get all records in a collection' })
    @ApiResponse({ status: 200, description: 'Records fetched successfully' })
    async findAll(
      @Param('collection') collection: string,
      @User() user: UserEntity,
    ) {
      const all = await this.recordsService.findAll(collection, user);
      return {
        status_code: 200,
        message: 'Records fetched successfully',
        data: all,
      };
    }
    
    @Patch(':collection/:id')
    @ApiOperation({ summary: 'Update a record in a collection' })
    @ApiResponse({ status: 200, description: 'Record updated successfully' })
    async update(
      @Param('collection') collection: string,
      @Param('id') id: string,
      @Body() dto: UpdateRecordDto,
      @User() user: UserEntity,
    ) {
      const updated = await this.recordsService.update(collection, id, dto.data, user);
      return {
        status_code: 200,
        message: 'Record updated successfully',
        data: updated,
      };
    }
    
    @Delete(':collection/:id')
    @ApiOperation({ summary: 'Delete a record in a collection' })
    @ApiResponse({ status: 200, description: 'Record deleted successfully' })
    async delete(
      @Param('collection') collection: string,
      @Param('id') id: string,
      @User() user: UserEntity,
    ) {
      await this.recordsService.delete(collection, id, user);
      return {
        status_code: 200,
        message: 'Record deleted successfully',
      };
    }
  }    