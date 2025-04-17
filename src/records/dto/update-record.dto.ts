import { IsNotEmpty, IsObject } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateRecordDto {
  @ApiProperty({
    type: 'object',
    example: {
      pages: 400,
      published: false
    },
    description: 'Fields to update in the record',
    additionalProperties: true,
  })
  @IsNotEmpty()
  @IsObject()
  data: Record<string, any>;
}
