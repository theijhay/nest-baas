import { 
    IsNotEmpty, 
    IsString, IsArray, 
    ValidateNested, 
    IsIn } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class FieldDto {
    @ApiProperty({ example: 'title', description: 'The name of the field' })
    @IsNotEmpty()
    @IsString()
    name: string;

    @ApiProperty({ example: 'string', description: 'The type of the field' })
    @IsIn(['string', 'number', 'boolean', 'text', 'date'])
    type: string;
}

export class CreateCollectionDto {
    @ApiProperty({ example: 'Books', description: 'The name of the collection' })
    @IsNotEmpty()
    @IsString()
    name: string;

    @ApiProperty({
        type: [FieldDto],
        description: 'The fields of the collection',
        example: [
            { name: 'title', type: 'string' },
            { name: 'pages', type: 'number' },
            { name: 'published', type: 'boolean' },
        ],
    })
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => FieldDto)
    fields: FieldDto[];
}
