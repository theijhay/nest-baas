import { 
    Injectable, 
    Logger, 
    NotFoundException, 
    InternalServerErrorException 
  } from '@nestjs/common';
  import { WebhookRepository } from '../../repositories/webhook.repository';
  import { CreateWebhookDto } from './dto/create-webhook.dto';
  import { User } from '../../entities/users.entity';
  import axios from 'axios';
  
  @Injectable()
  export class WebhookService {
    private readonly logger = new Logger(WebhookService.name);
  
    constructor(
      private readonly webhookRepo: WebhookRepository,
    ) {}
  
    async create(dto: CreateWebhookDto, user: User) {
      try {
        return await this.webhookRepo.createWebhook({ ...dto, user });
      } catch (error) {
        this.logger.error('Error creating webhook', error.message);
        throw new InternalServerErrorException('Failed to create webhook');
      }
    }
  
    async findAll(user: User) {
      try {
        return await this.webhookRepo.findByUser(user.id);
      } catch (error) {
        this.logger.error('Error fetching webhooks', error.message);
        throw new InternalServerErrorException('Failed to fetch webhooks');
      }
    }
  
    async delete(id: string, user: User) {
      try {
        const result = await this.webhookRepo.deleteById(id, user.id);
        if (result.affected === 0) {
          throw new NotFoundException(`Webhook with ID ${id} not found`);
        }
        return { message: 'Webhook deleted successfully' };
      } catch (error) {
        this.logger.error('Error deleting webhook', error.message);
        if (error instanceof NotFoundException) {
          throw error;
        }
        throw new InternalServerErrorException('Failed to delete webhook');
      }
    }
  
    async trigger(event: 'create' | 'update' | 'delete', collection: string, userId: string, data: any) {
      try {
        const hooks = await this.webhookRepo.findByEventCollectionUser(event, collection, userId);
  
        for (const hook of hooks) {
          await this.retryWebhookPost(hook.url, {
            event,
            collection,
            data,
            timestamp: new Date().toISOString(),
          });
        }
      } catch (error) {
        this.logger.error('Error triggering webhooks', error.message);
        throw new InternalServerErrorException('Failed to trigger webhooks');
      }
    }
  
    private async retryWebhookPost(url: string, payload: any, retries = 1, delay = 5000) {
      try {
        await axios.post(url, payload);
        this.logger.log(`Webhook POST successful: ${url}`);
      } catch (error) {
        if (retries <= 0) {
          this.logger.error(`All retries failed for webhook ${url}`, error.message);
          return;
        }
  
        this.logger.warn(`Retrying webhook ${url} in ${delay}ms...`);
        await new Promise((res) => setTimeout(res, delay));
        return this.retryWebhookPost(url, payload, retries - 1, delay);
      }
    }
  }
  