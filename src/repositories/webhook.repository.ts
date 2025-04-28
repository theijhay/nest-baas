import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Webhook } from '../entities/webhook.entity';
import { Repository } from 'typeorm';

@Injectable()
export class WebhookRepository {
  constructor(
    @InjectRepository(Webhook)
    private readonly repo: Repository<Webhook>,
  ) {}

  async createWebhook(data: Partial<Webhook>) {
    return this.repo.save(data);
  }

  async findByUser(userId: string) {
    return this.repo.find({ where: { user: { id: userId } } });
  }

  async findByEventCollectionUser(
    event: "create" | "update" | "delete",
    collection: string,
    userId: string,
  ) {
    return this.repo.find({
      where: { event, collection, user: { id: userId } },
    });
  }

  async deleteById(id: string, userId: string) {
    return this.repo.delete({ id, user: { id: userId } });
  }
}
