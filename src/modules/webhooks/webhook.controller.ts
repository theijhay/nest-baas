import {
    Controller,
    Post,
    Get,
    Delete,
    Param,
    Body,
    UseGuards, 
    UsePipes, 
    ValidationPipe
  } from '@nestjs/common';
  import { WebhookService } from './webhook.service';
  import { CreateWebhookDto } from './dto/create-webhook.dto';
  import { AuthGuard } from 'src/guards/auth.guard';
  import { User } from 'src/utils/decorators/user.decorator';
  import { User as UserEntity } from '../../entities/users.entity';
  import { 
    ApiTags, 
    ApiBearerAuth, 
    ApiBody, 
    ApiOperation, 
    ApiResponse } from '@nestjs/swagger';
  
  @ApiTags('webhooks')
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Controller('api/user/webhooks/')
  export class WebhookController {
    constructor(private readonly webhookService: WebhookService) {}
  
    @Post("create")
    @ApiOperation({
      summary: 'Register a webhook for create/update/delete events',
      description: `
  **Purpose:** Register a webhook to be notified when records are created, updated, or deleted in a specific collection.
  
  **How to test using [webhook.site](https://webhook.site):**
  1. Visit [https://webhook.site](https://webhook.site)
  2. Copy the temporary URL it gives you (e.g. \`https://webhook.site/3a756fe0-abc...\`)
  3. Paste that URL as the \`url\` field below
  4. Set the \`event\` field to one of: \`create\`, \`update\`, or \`delete\`
  5. Set the \`collection\` field to the name of an existing collection you’ve created (e.g. \`Books\`, case-sensitive)
  6. You’ll see the webhook hit on webhook.site!
  
  📤 The POST request sent to your webhook URL will contain:
  \`\`\`json
  {
    "event": "create",
    "collection": "Books",
    "data": { ...record data },
    "timestamp": "2025-04-17T22:30:00.123Z"
  }
  \`\`\`
  `,
    })
    @ApiBody({
      schema: {
        example: {
          url: 'https://webhook.site/your-temp-url',
          event: 'delete',
          collection: 'Books',
        },
      },
    })
    @ApiResponse({ status: 201, description: 'Webhook registered successfully.' })
    async create(@Body() dto: CreateWebhookDto, @User() user: UserEntity) {
      return {
        status_code: 201,
        message: 'Webhook registered successfully',
        data: await this.webhookService.create(dto, user),
      };
    }
  
    @Get(":webhooks")
    @ApiOperation({ summary: 'List all registered webhooks for the current user' })
    @ApiResponse({ status: 200, description: 'Webhooks fetched successfully.' })
    async findAll(@User() user: UserEntity) {
      return {
        status_code: 200,
        message: 'Webhooks fetched',
        data: await this.webhookService.findAll(user),
      };
    }
  
    @Delete(':webhooks/:id')
    @ApiOperation({ summary: 'Delete a registered webhook by ID' })
    @ApiResponse({ status: 200, description: 'Webhook deleted successfully.' })
    async delete(@Param('id') id: string, @User() user: UserEntity) {
      await this.webhookService.delete(id, user);
      return {
        status_code: 200,
        message: 'Webhook deleted',
      };
    }
  }
  