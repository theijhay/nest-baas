import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Collection } from '../entities/collection.entity';
import { Repository } from 'typeorm';

@Injectable()
export class CollectionRepository {
  constructor(
    @InjectRepository(Collection)
    private readonly repo: Repository<Collection>,
  ) {}

  async findByTableName(tableName: string) {
    return this.repo.findOne({ where: { tableName } });
  }

  async findByNameAndUser(name: string, userId: string) {
    return this.repo.findOne({ where: { name, user: { id: userId } }, relations: ['user'] });
  }

  async save(collection: Partial<Collection>) {
    return this.repo.save(collection);
  }
}
