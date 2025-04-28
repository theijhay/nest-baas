import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Field } from '../entities/field.entity';
import { Repository } from 'typeorm';

@Injectable()
export class FieldRepository {
  constructor(
    @InjectRepository(Field)
    private readonly repo: Repository<Field>,
  ) {}

  async save(fields: Partial<Field>[]) {
    return this.repo.save(fields);
  }
}
