import { Injectable, BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { CollectionRepository } from '../../repositories/collection.repository';
import { FieldRepository } from '../../repositories/field.repository';
import { DataSource } from 'typeorm';
import { User } from '../../entities/users.entity';
import { CreateCollectionDto, FieldDto } from './dto/create-collection.dto';
import CommonUtil from 'src/utils/commons.util';

@Injectable()
export class CollectionsService {
  constructor(
    private readonly collectionRepo: CollectionRepository,
    private readonly fieldRepo: FieldRepository,
    private readonly dataSource: DataSource,
  ) {}

  async create(dto: CreateCollectionDto, user: User) {
    const tableName = CommonUtil.generateTableName(user.id, dto.name);
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
    const exists = await this.collectionRepo.findByTableName(tableName);
    if (exists) {
      throw new BadRequestException('Collection with that name already exists');
    }
  }

  private async saveMetadata(dto: CreateCollectionDto, tableName: string, user: User) {
    const collection = await this.collectionRepo.save({ name: dto.name, tableName, user });
    const fields = dto.fields.map((f: FieldDto) => ({ ...f, collection }));
    await this.fieldRepo.save(fields);
    return collection;
  }

  private async createPhysicalTable(tableName: string, fields: FieldDto[]) {
    const runner = this.dataSource.createQueryRunner();
    await runner.connect();
    await runner.startTransaction();
    try {
      const sqlFields = fields.map(f => `"${f.name}" ${this.mapFieldType(f.type)}`);
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
      case 'string': return 'varchar';
      case 'number': return 'integer';
      case 'boolean': return 'boolean';
      case 'text': return 'text';
      case 'date': return 'timestamp';
      default: throw new Error(`Unsupported field type: ${type}`);
    }
  }
}
