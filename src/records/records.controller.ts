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
  import { JwtAuthGuard } from '../auth/auth.guard';
  import { User } from '../utils/decorators/user.decorator';
  import { User as UserEntity } from '../users/users.entity';
  import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
  import { UpdateRecordDto } from './dto/update-record.dto';
  
  @ApiTags('records')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Controller('records')
  export class RecordsController {
    constructor(private readonly recordsService: RecordsService) {}
  
    @Post(':collection')
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