import {
    Injectable,
    NotFoundException,
    BadRequestException,
  } from '@nestjs/common';
  import { InjectRepository } from '@nestjs/typeorm';
  import { Repository, DataSource } from 'typeorm';
  import { Collection } from '../collections/collection.entity';
  import { User } from '../users/users.entity';
  import { CreateRecordDto } from './dto/create-record.dto';
  
  @Injectable()
  export class RecordsService {
    constructor(
      @InjectRepository(Collection)
      private collectionRepo: Repository<Collection>,
      private dataSource: DataSource,
    ) {}
  
    async create(collectionName: string, dto: CreateRecordDto, user: User) {
      const collection = await this.findUserCollection(collectionName, user);
  
      const keys = Object.keys(dto.data);
      const values = Object.values(dto.data);
  
      const columns = keys.map((k) => `"${k}"`).join(', ');
      const paramSlots = keys.map((_, i) => `$${i + 1}`).join(', ');
  
      const query = `
        INSERT INTO "${collection.tableName}" (${columns})
        VALUES (${paramSlots})
        RETURNING *;
      `;
  
      const result = await this.dataSource.query(query, values);
      return result[0];
    }
  
    async findAll(collectionName: string, user: User) {
      const collection = await this.findUserCollection(collectionName, user);
      return this.dataSource.query(
        `SELECT * FROM "${collection.tableName}" ORDER BY "createdAt" DESC`
      );
    }
  
    async update(collectionName: string, id: string, data: Record<string, any>, user: User) {
      const collection = await this.findUserCollection(collectionName, user);
  
      const keys = Object.keys(data);
      const values = Object.values(data);
      if (keys.length === 0) throw new BadRequestException('No fields to update');
  
      const setClause = keys.map((k, i) => `"${k}" = $${i + 1}`).join(', ');
      const query = `
        UPDATE "${collection.tableName}"
        SET ${setClause}, "updatedAt" = now()
        WHERE id = $${keys.length + 1}
        RETURNING *;
      `;
  
      const result = await this.dataSource.query(query, [...values, id]);
      if (!result.length) throw new NotFoundException('Record not found');
      return result[0];
    }
  
    async delete(collectionName: string, id: string, user: User) {
      const collection = await this.findUserCollection(collectionName, user);
  
      const query = `DELETE FROM "${collection.tableName}" WHERE id = $1 RETURNING *;`;
      const result = await this.dataSource.query(query, [id]);
  
      if (!result.length) throw new NotFoundException('Record not found');
      return { message: 'Deleted successfully' };
    }
  
    private async findUserCollection(name: string, user: User) {
      const collection = await this.collectionRepo.findOne({
        where: {
          name,
          user: { id: user.id },
        },
        relations: ['user'],
      });
  
      if (!collection) {
        throw new NotFoundException(`Collection "${name}" not found for this user`);
      }
  
      return collection;
    }
  }
  