import {
    BadRequestException,
    Injectable,
    InternalServerErrorException,
  } from '@nestjs/common';
  import { InjectRepository } from '@nestjs/typeorm';
  import { DataSource, Repository } from 'typeorm';
  import { Collection } from './collection.entity';
  import { Field } from '../fields/field.entity';
  import { CreateCollectionDto, FieldDto } from './dto/create-collection.dto';
  import { User } from '../users/users.entity';
  import CommonUtil from '../utils/commons.util';
  
  @Injectable()
  export class CollectionsService {
    constructor(
      @InjectRepository(Collection)
      private collectionRepo: Repository<Collection>,
  
      @InjectRepository(Field)
      private fieldRepo: Repository<Field>,
  
      private dataSource: DataSource,
    ) {}
  
    async create(dto: CreateCollectionDto, user: User) {
      const tableName = CommonUtil.generateTableName((user.id), dto.name);
  
      await this.ensureUniqueTableName(tableName);
  
      const collection = await this.saveMetadata(dto, tableName, user);
  
      try {
        await this.createPhysicalTable(tableName, dto.fields);
      } catch (err) {
        throw new InternalServerErrorException('Table creation failed', err.message);
      }
  
      return {
        message: 'Collection created successfully',
        tableName,
        collectionId: collection.id,
      };
    }
  
    private async ensureUniqueTableName(tableName: string) {
      const exists = await this.collectionRepo.findOne({ where: { tableName } });
      if (exists) {
        throw new BadRequestException('Collection with that name already exists');
      }
    }
  
    private async saveMetadata(
      dto: CreateCollectionDto,
      tableName: string,
      user: User,
    ): Promise<Collection> {
      const collection = this.collectionRepo.create({
        name: dto.name,
        tableName,
        user,
      });
      await this.collectionRepo.save(collection);
  
      const fields = dto.fields.map((f: FieldDto) =>
        this.fieldRepo.create({ ...f, collection }),
      );
      await this.fieldRepo.save(fields);
  
      return collection;
    }
  
    private async createPhysicalTable(
      tableName: string,
      fields: { name: string; type: string }[],
    ) {
      const runner = this.dataSource.createQueryRunner();
      await runner.connect();
      await runner.startTransaction();
  
      try {
        const sqlFields = fields.map((field) => {
          const columnType = this.mapFieldType(field.type);
          return `"${field.name}" ${columnType}`;
        });
  
        const query = `
          CREATE TABLE "${tableName}" (
            id SERIAL PRIMARY KEY,
            ${sqlFields.join(',')},
            "createdAt" TIMESTAMP DEFAULT now(),
            "updatedAt" TIMESTAMP DEFAULT now()
          );
        `;
  
        await runner.query(query);
        await runner.commitTransaction();
      } catch (error) {
        await runner.rollbackTransaction();
        throw error;
      } finally {
        await runner.release();
      }
    }
  
    private mapFieldType(type: string): string {
      switch (type) {
        case 'string':
          return 'varchar';
        case 'number':
          return 'integer';
        case 'boolean':
          return 'boolean';
        case 'text':
          return 'text';
        case 'date':
          return 'timestamp';
        default:
          throw new Error(`Unsupported field type: ${type}`);
      }
    }
  }
  