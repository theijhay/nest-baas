import { IsNotEmpty, IsUrl, IsIn, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateWebhookDto {
  @ApiProperty({ example: 'https://example.com/hook' })
  @IsNotEmpty()
  @IsUrl()
  url: string;

  @ApiProperty({ example: 'create', enum: ['create', 'update', 'delete'] })
  @IsIn(['create', 'update', 'delete'])
  event: 'create' | 'update' | 'delete';

  @ApiProperty({ example: 'books' })
  @IsNotEmpty()
  @IsString()
  collection: string;
}
