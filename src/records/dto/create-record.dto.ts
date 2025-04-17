import { IsNotEmpty, IsObject } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateRecordDto {
  @ApiProperty({
    type: 'object',
    example: {
      title: 'My Book',
      pages: 250,
      published: true,
    },
    description: 'Dynamic data object. Keys must match collection fields.',
    additionalProperties: true,
  })
  @IsNotEmpty()
  @IsObject()
  data: Record<string, any>;
}
