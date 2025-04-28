import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Collection } from '../../entities/collection.entity';
import { User } from '../../entities/users.entity';
import { CreateRecordDto } from './dto/create-record.dto';
import { WebhookService } from 'src/modules/webhooks/webhook.service';

@Injectable()
export class RecordsService {
  constructor(
    @InjectRepository(Collection)
    private readonly collectionRepo: Repository<Collection>,
    private readonly dataSource: DataSource,
    private readonly webhookService: WebhookService,
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
    const createdRecord = result[0];

    // Trigger webhook
    await this.webhookService.trigger('create', collection.name, user.id, createdRecord);

    return createdRecord;
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
    const updatedRecord = result[0];

    // Trigger webhook
    await this.webhookService.trigger('update', collection.name, user.id, updatedRecord);

    return updatedRecord;
  }

  async delete(collectionName: string, id: string, user: User) {
    const collection = await this.findUserCollection(collectionName, user);

    const query = `DELETE FROM "${collection.tableName}" WHERE id = $1 RETURNING *;`;
    const result = await this.dataSource.query(query, [id]);

    if (!result.length) throw new NotFoundException('Record not found');
    const deletedRecord = result[0];

    // Trigger webhook
    await this.webhookService.trigger('delete', collection.name, user.id, deletedRecord);

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
  